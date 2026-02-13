import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Part } from '@/models/Schemas';

export async function POST(request) {
    await dbConnect();
    try {
        const { parts } = await request.json(); // Expect simplified object: { case: 'id', pcb: 'id', ... } or array of specific parts
        const { case: caseId, pcb: pcbId, switch: switchId, keycap: keycapId } = parts;

        // Fetch full objects to check specs
        const [caseObj, pcbObj, switchObj, keycapObj] = await Promise.all([
            caseId ? Part.findById(caseId) : null,
            pcbId ? Part.findById(pcbId) : null,
            switchId ? Part.findById(switchId) : null,
            keycapId ? Part.findById(keycapId) : null,
        ]);

        const issues = [];

        // --- Compatibility Logic ---

        // 1. Case & PCB
        if (caseObj && pcbObj) {
            // Check layout compatibility
            const pcbLayout = pcbObj.specs.get('layout');
            const supportedLayouts = caseObj.specs.get('supportedLayouts') || [];

            if (!supportedLayouts.includes(pcbLayout)) {
                issues.push(`Incompatible Layout: Case supports [${supportedLayouts.join(', ')}] but PCB is ${pcbLayout}`);
            }

            // Check mounting type
            const caseMount = caseObj.specs.get('mountingType');
            const pcbMount = pcbObj.specs.get('mountingType'); // Some PCBs support multiple, simplified here to single string comparison
            if (caseMount !== pcbMount && caseMount !== 'Universal') {
                // This is strict. Real world might be looser (e.g. Tray mount pcb fits many). 
                // For this project, let's keep it simple: if defined, must match.
                if (pcbMount && caseMount !== pcbMount) {
                    issues.push(`Mounting Mismatch: Case is ${caseMount} but PCB expects ${pcbMount}`);
                }
            }
        }

        // 2. PCB & Switch
        if (pcbObj && switchObj) {
            const socketType = pcbObj.specs.get('socketType'); // 'Hotswap', 'Solder'
            const switchPin = switchObj.specs.get('pinType'); // '3-pin', '5-pin'
            const pcbSupport = pcbObj.specs.get('switchSupport'); // '3-pin', '5-pin', 'Both'

            // Pin Check
            if (pcbSupport === '3-pin' && switchPin === '5-pin') {
                issues.push(`Pin Mismatch: PCB only supports 3-pin switches, but you selected a 5-pin switch. (Requires clipping legs)`);
            }
        }

        // 3. Keycap & Layout (Simplified)
        if (keycapObj && pcbObj) {
            // Naive check: does keycap set name imply layout support?
            // In real app, we'd check key sizes.
            // Here, let's just assume standard unless specified.
        }

        return NextResponse.json({
            success: true,
            compatible: issues.length === 0,
            issues
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
