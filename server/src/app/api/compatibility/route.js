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
        const warnings = [];

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
                // Allow Gummy O-ring & Gasket mount cases (common in 60%) to use Tray mount PCBs
                const isUniversal60 = (caseMount === 'Gummy O-ring' || caseMount === 'Gasket')
                    && pcbMount === 'Tray'
                    && pcbLayout === '60%'; // Only allow this exception for 60% form factor

                if (pcbMount && !isUniversal60) {
                    issues.push(`Mounting Mismatch: Case is ${caseMount} but PCB expects ${pcbMount}`);
                }
            }
        }

        // 2. PCB & Switch
        if (pcbObj && switchObj) {
            const socketType = pcbObj.specs.get('socketType') || 'Mechanical'; // Default to Mechanical if missing
            const switchTech = switchObj.specs.get('technology') || 'Mechanical'; // Default to Mechanical

            const switchPin = switchObj.specs.get('pinType'); // '3-pin', '5-pin'
            const pcbSupport = pcbObj.specs.get('switchSupport'); // '3-pin', '5-pin', 'Both'
            if (socketType !== switchTech) {
                issues.push(`Technology Mismatch: PCB is ${socketType} but Switch is ${switchTech}. They are physically incompatible.`);
            }

            if (pcbSupport === '3-pin' && switchPin === '5-pin') {
                warnings.push(`Pin Mismatch: Switch has 5 pins but PCB only supports 3. You will need to clip the 2 extra plastic legs for it to fit.`);
            }
        }

        // 3. Keycap & Layout (Simplified)
        if (keycapObj && pcbObj) {
        }

        return NextResponse.json({
            success: true,
            compatible: issues.length === 0,
            issues,
            warnings
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
