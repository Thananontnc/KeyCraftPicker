import { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, AlertTriangle, CheckCircle, X } from 'lucide-react';

const Builder = () => {
    // State for selected parts
    const [build, setBuild] = useState({
        case: null,
        pcb: null,
        switch: null,
        keycap: null
    });

    const [parts, setParts] = useState([]);
    const [compatibility, setCompatibility] = useState({ compatible: true, issues: [] });
    const [activeSlot, setActiveSlot] = useState(null); // 'case', 'pcb', etc.

    useEffect(() => {
        // Check compatibility whenever build changes
        checkCompatibility();
    }, [build]);

    const checkCompatibility = async () => {
        const payload = {
            case: build.case?._id,
            pcb: build.pcb?._id,
            switch: build.switch?._id,
            keycap: build.keycap?._id,
        };

        // Only check if at least 2 parts are selected
        const selectedCount = Object.values(payload).filter(Boolean).length;
        if (selectedCount < 2) {
            setCompatibility({ compatible: true, issues: [] });
            return;
        }

        try {
            const res = await axios.post('http://localhost:3000/api/compatibility', { parts: payload });
            if (res.data.success) {
                setCompatibility({
                    compatible: res.data.compatible,
                    issues: res.data.issues
                });
            }
        } catch (err) {
            console.error('Compatibility check failed', err);
        }
    };

    const fetchPartsForSlot = async (type) => {
        setActiveSlot(type);
        try {
            const res = await axios.get(`http://localhost:3000/api/parts?type=${type}`);
            if (res.data.success) {
                setParts(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch parts', err);
        }
    };

    const selectPart = (part) => {
        setBuild({ ...build, [activeSlot]: part });
        setActiveSlot(null); // Close selection modal/area
    };

    const calculateTotal = () => {
        return Object.values(build).reduce((acc, part) => acc + (part?.price || 0), 0).toFixed(2);
    };

    const handleSave = async () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            alert('Please login to save your build');
            return;
        }
        const user = JSON.parse(userStr);

        try {
            if (!compatibility.compatible) {
                if (!confirm('Your build has compatibility issues. Save anyway?')) return;
            }

            await axios.post('http://localhost:3000/api/builds', {
                userId: user.id || user._id, // Handle different id formats
                name: `My Custom Build - ${new Date().toLocaleDateString()}`,
                parts: {
                    case: build.case?._id,
                    pcb: build.pcb?._id,
                    switch: build.switch?._id,
                    keycap: build.keycap?._id,
                },
                totalPrice: Number(calculateTotal())
            });
            alert('Build saved successfully!');
        } catch (err) {
            alert('Failed to save build: ' + (err.response?.data?.error || err.message));
        }
    };

    const [showCompatibleOnly, setShowCompatibleOnly] = useState(true);

    const isPartCompatible = (part) => {
        if (!part || !part.specs) return true;

        // 1. Case <-> PCB Compatibility
        if (activeSlot === 'pcb' && build.case) {
            // Layout mismatch
            if (!build.case.specs.supportedLayouts.includes(part.specs.layout)) return false;
            // Mounting mismatch (Strict for now)
            if (build.case.specs.mountingType !== part.specs.mountingType) return false;
        }
        if (activeSlot === 'case' && build.pcb) {
            if (!part.specs.supportedLayouts.includes(build.pcb.specs.layout)) return false;
            if (part.specs.mountingType !== build.pcb.specs.mountingType) return false;
        }

        // 2. PCB <-> Switch Compatibility
        if (activeSlot === 'switch' && build.pcb) {
            // Optical vs Mechanical (socketType not strictly defined in seed yet, assuming standard mechanical for now)
            // If PCB is 3-pin (hotSwap: false or specific spec), and Switch is 5-pin?
            // Simplified: If PCB says "switchSupport: '3-pin'" and switch is 5-pin -> Incompatible
            if (build.pcb.specs.switchSupport === '3-pin' && part.specs.pinType === '5-pin') return false;
        }

        // 3. PCB <-> Keycap Compatibility
        if (activeSlot === 'keycap' && build.pcb) {
            // Basic layout check
            if (part.specs.layoutSupport && !part.specs.layoutSupport.includes(build.pcb.specs.layout)) return false;
        }

        return true;
    };

    const filteredParts = showCompatibleOnly
        ? parts.filter(isPartCompatible)
        : parts;

    return (
        <div className="page-container" style={{ textAlign: 'left', marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '700' }}>Keyboard Builder</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Select components to visualize your custom keyboard.</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <h2 className="price" style={{ marginBottom: '0.5rem' }}>Total: ${calculateTotal()}</h2>
                    <button onClick={handleSave} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Save size={18} /> Save Build
                    </button>
                </div>
            </div>

            {/* Compatibility Status */}
            {!compatibility.compatible && (
                <div className="alert-error" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <AlertTriangle size={24} />
                    <div>
                        <strong>Compatibility Issues Found:</strong>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            {compatibility.issues.map((issue, i) => (
                                <li key={i}>{issue}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            {compatibility.compatible && Object.values(build).some(p => p) && (
                <div className="alert-success" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '2rem'
                }}>
                    <CheckCircle size={24} /> <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>All parts compatible so far!</span>
                </div>
            )}

            {/* Build Slots */}
            <div className="grid">
                {['case', 'pcb', 'switch', 'keycap'].map(type => (
                    <div key={type} className="card part-card" style={{
                        borderStyle: build[type] ? 'solid' : 'dashed',
                        borderColor: build[type] ? 'var(--border-color)' : 'var(--brick-grey)',
                        background: build[type] ? 'white' : '#f4f4f5',
                        borderWidth: '3px'
                    }}>
                        {build[type] ? (
                            <>
                                <div className="part-image-container" style={{ height: '160px' }}>
                                    <img
                                        src={build[type].image}
                                        alt={build[type].name}
                                        className="part-image"
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
                                    />
                                </div>
                                <div className="part-info">
                                    <h3 style={{ textTransform: 'capitalize' }}>{type}</h3>
                                    <div style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>{build[type].name}</div>
                                    <p className="price" style={{ fontSize: '1.25rem' }}>${build[type].price}</p>
                                    <button onClick={() => fetchPartsForSlot(type)} className="btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}>Change</button>
                                </div>
                            </>
                        ) : (
                            <div style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                <h3 style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '1rem', marginBottom: '1rem', color: 'var(--brick-grey)' }}>Select {type}</h3>
                                <button onClick={() => fetchPartsForSlot(type)} className="btn-primary" style={{ padding: '0.5rem 1.5rem' }}>+ Add Block</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Selection Modal */}
            {activeSlot && (
                <div style={{
                    position: 'fixed', inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
                    zIndex: 200,
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    padding: '2rem'
                }}>
                    <div className="card" style={{
                        width: '100%', maxWidth: '900px', maxHeight: '85vh',
                        display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden'
                    }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.03)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <h2 style={{ textTransform: 'capitalize', margin: 0, fontSize: '1.8rem', color: 'var(--text-main)' }}>Select {activeSlot}</h2>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', cursor: 'pointer', userSelect: 'none', color: 'var(--text-secondary)' }}>
                                    <input
                                        type="checkbox"
                                        checked={showCompatibleOnly}
                                        onChange={(e) => setShowCompatibleOnly(e.target.checked)}
                                        style={{ width: '18px', height: '18px', accentColor: 'var(--brick-blue)' }}
                                    />
                                    Show Compatible Only <span style={{ fontSize: '0.85rem', background: '#e5e7eb', padding: '2px 8px', borderRadius: '12px', color: '#374151' }}>{filteredParts.length}</span>
                                </label>
                            </div>
                            <button onClick={() => setActiveSlot(null)} className="btn-sm" style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={28} /></button>
                        </div>

                        <div style={{ overflowY: 'auto', padding: '1.5rem' }}>
                            {filteredParts.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                    <p>No compatible parts found for your current build.</p>
                                    <p style={{ fontSize: '0.9rem' }}>Try unchecking "Show Compatible Only" to see all options.</p>
                                </div>
                            ) : (
                                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
                                    {filteredParts.map(part => (
                                        <div key={part._id} className="card part-card" onClick={() => selectPart(part)} style={{ cursor: 'pointer', border: '1px solid var(--border-hover)' }}>
                                            <div className="part-image-container" style={{ height: '140px' }}>
                                                <img
                                                    src={part.image}
                                                    alt={part.name}
                                                    className="part-image"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
                                                />
                                                {/* Recommended Badge */}
                                                {isPartCompatible(part) && (
                                                    <div style={{
                                                        position: 'absolute', top: '8px', right: '8px',
                                                        background: 'var(--success-color)', color: 'white',
                                                        fontSize: '0.75rem', fontWeight: '700',
                                                        padding: '2px 8px', borderRadius: '12px',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                                    }}>
                                                        Recommended
                                                    </div>
                                                )}
                                            </div>
                                            <div className="part-info" style={{ padding: '1rem' }}>
                                                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{part.name}</h4>
                                                <p className="price" style={{ fontSize: '1.1rem' }}>${part.price}</p>
                                                {!isPartCompatible(part) && (
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--brick-red)', marginTop: '0.5rem', fontWeight: '600' }}>
                                                        Incompatible
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Builder;
