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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{
                        fontSize: '3rem', fontWeight: '900', color: 'var(--brick-red)',
                        textTransform: 'uppercase', letterSpacing: '-1px',
                        textShadow: '3px 3px 0px rgba(0,0,0,0.1)'
                    }}>Keyboard Builder</h1>
                    <p style={{ fontSize: '1.2rem', fontWeight: '600', color: '#555' }}>Drag, drop, and click to build your dream board.</p>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <div style={{
                        background: 'var(--brick-yellow)',
                        padding: '0.5rem 1.5rem',
                        borderRadius: '12px',
                        border: '3px solid var(--brick-black)',
                        boxShadow: '4px 4px 0px rgba(0,0,0,0.1)'
                    }}>
                        <h2 className="price" style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800' }}>Total: ${calculateTotal()}</h2>
                    </div>
                    <button onClick={handleSave} className="btn-primary" style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        border: '3px solid var(--brick-black)',
                        boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
                        transform: 'rotate(-1deg)'
                    }}>
                        <Save size={20} /> Save Build
                    </button>
                </div>
            </div>

            {/* Compatibility Status */}
            {!compatibility.compatible && (
                <div className="alert-error" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '2rem', border: '3px solid var(--brick-red)', background: '#fee2e2' }}>
                    <AlertTriangle size={24} color="var(--brick-red)" />
                    <div>
                        <strong style={{ color: 'var(--brick-red)', fontSize: '1.1rem' }}>Compatibility Issues Found:</strong>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', color: '#b91c1c' }}>
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
                    marginBottom: '2rem',
                    border: '3px solid var(--brick-green)',
                    background: '#dcfce7',
                    boxShadow: '4px 4px 0px rgba(0,0,0,0.05)'
                }}>
                    <CheckCircle size={24} color="var(--brick-green)" /> <span style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--brick-green)' }}>All parts compatible!</span>
                </div>
            )}

            {/* Build Slots */}
            <div className="grid">
                {['case', 'pcb', 'switch', 'keycap'].map(type => (
                    <div key={type} className="card part-card" style={{
                        borderStyle: build[type] ? 'solid' : 'dashed',
                        borderColor: build[type] ? 'var(--brick-black)' : 'var(--brick-grey)',
                        background: build[type] ? 'white' : 'rgba(0,0,0,0.03)',
                        borderWidth: '3px',
                        boxShadow: build[type] ? '8px 8px 0px rgba(0,0,0,0.1)' : 'none',
                        transition: 'transform 0.2s',
                        transform: build[type] ? 'translate(-2px, -2px)' : 'none'
                    }}>
                        {build[type] ? (
                            <>
                                <div className="part-image-container" style={{ height: '180px', borderBottom: '3px solid var(--brick-black)' }}>
                                    <img
                                        src={build[type].image}
                                        alt={build[type].name}
                                        className="part-image"
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
                                    />
                                </div>
                                <div className="part-info" style={{ padding: '1.5rem' }}>
                                    <h3 style={{ textTransform: 'uppercase', fontSize: '0.9rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>{type}</h3>
                                    <div style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.5rem', lineHeight: '1.2' }}>{build[type].name}</div>
                                    <p className="price" style={{ fontSize: '1.5rem', color: 'var(--brick-blue)' }}>${build[type].price}</p>
                                    <button onClick={() => fetchPartsForSlot(type)} className="btn-sm" style={{
                                        width: '100%', justifyContent: 'center', marginTop: '1rem',
                                        background: 'var(--brick-black)', color: 'white',
                                        border: 'none', borderRadius: '8px', padding: '0.8rem',
                                        fontSize: '1rem', fontWeight: 'bold'
                                    }}>Change Part</button>
                                </div>
                            </>
                        ) : (
                            <div style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                <div style={{
                                    width: '60px', height: '60px', borderRadius: '50%',
                                    border: '3px dashed var(--brick-grey)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '1rem', color: 'var(--brick-grey)'
                                }}>
                                    <span style={{ fontSize: '2rem', fontWeight: '300' }}>+</span>
                                </div>
                                <h3 style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--brick-grey)', fontWeight: '800' }}>Select {type}</h3>
                                <button onClick={() => fetchPartsForSlot(type)} className="btn-primary" style={{
                                    padding: '0.8rem 2rem',
                                    background: 'white', color: 'var(--brick-blue)',
                                    border: '3px solid var(--brick-blue)',
                                    boxShadow: '4px 4px 0px var(--brick-blue)',
                                    transition: 'transform 0.1s'
                                }}
                                    onMouseDown={(e) => e.target.style.transform = 'translate(2px, 2px)'}
                                    onMouseUp={(e) => e.target.style.transform = 'none'}
                                >+ Add Block</button>
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
                        <div style={{
                            padding: '1.5rem',
                            borderBottom: '4px solid var(--brick-black)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            background: 'repeating-linear-gradient(45deg, var(--brick-yellow) 0, var(--brick-yellow) 10px, #facc15 10px, #facc15 20px)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'white', padding: '0.5rem 1.5rem', borderRadius: '12px', border: '3px solid var(--brick-black)', boxShadow: '4px 4px 0px rgba(0,0,0,0.1)' }}>
                                <h2 style={{ textTransform: 'capitalize', margin: 0, fontSize: '1.8rem', color: 'var(--brick-black)', fontWeight: '900' }}>{activeSlot}</h2>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', cursor: 'pointer', userSelect: 'none', color: 'var(--text-main)', fontWeight: '600' }}>
                                    <input
                                        type="checkbox"
                                        checked={showCompatibleOnly}
                                        onChange={(e) => setShowCompatibleOnly(e.target.checked)}
                                        style={{ width: '20px', height: '20px', accentColor: 'var(--brick-blue)', cursor: 'pointer' }}
                                    />
                                    <span style={{ opacity: showCompatibleOnly ? 1 : 0.6 }}>Compatible Only</span>
                                    {showCompatibleOnly && <span style={{ fontSize: '0.85rem', background: 'var(--brick-blue)', padding: '2px 8px', borderRadius: '12px', color: 'white' }}>{filteredParts.length}</span>}
                                </label>
                            </div>
                            <button onClick={() => setActiveSlot(null)} className="btn-sm" style={{
                                border: '3px solid var(--brick-black)',
                                background: 'var(--brick-red)',
                                color: 'white',
                                borderRadius: '8px',
                                width: '40px', height: '40px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
                                cursor: 'pointer'
                            }}><X size={28} /></button>
                        </div>

                        <div style={{ overflowY: 'auto', padding: '1.5rem' }}>
                            {filteredParts.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                    <p>No compatible parts found for your current build.</p>
                                    <p style={{ fontSize: '0.9rem' }}>Try unchecking "Show Compatible Only" to see all options.</p>
                                </div>
                            ) : (
                                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2rem' }}>
                                    {filteredParts.map(part => (
                                        <div key={part._id} className="card part-card" onClick={() => selectPart(part)} style={{
                                            cursor: 'pointer',
                                            border: '3px solid var(--brick-black)',
                                            boxShadow: '6px 6px 0px rgba(0,0,0,0.1)',
                                            transition: 'transform 0.1s',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = '8px 8px 0px rgba(0,0,0,0.15)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '6px 6px 0px rgba(0,0,0,0.1)'; }}
                                        >
                                            <div className="part-image-container" style={{ height: '160px', borderBottom: '3px solid var(--brick-black)' }}>
                                                <img
                                                    src={part.image}
                                                    alt={part.name}
                                                    className="part-image"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
                                                />
                                                {/* Recommended Badge */}
                                                {isPartCompatible(part) && (
                                                    <div style={{
                                                        position: 'absolute', top: '10px', right: '10px',
                                                        background: 'var(--brick-green)', color: 'white',
                                                        fontSize: '0.8rem', fontWeight: '800',
                                                        padding: '4px 10px', borderRadius: '20px',
                                                        border: '2px solid var(--brick-black)',
                                                        boxShadow: '2px 2px 0px rgba(0,0,0,0.2)',
                                                        zIndex: 2,
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px'
                                                    }}>
                                                        Best Match
                                                    </div>
                                                )}
                                            </div>
                                            <div className="part-info" style={{ padding: '1.2rem' }}>
                                                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: '800', lineHeight: '1.3' }}>{part.name}</h4>
                                                <p className="price" style={{ fontSize: '1.3rem', color: 'var(--brick-blue)' }}>${part.price}</p>
                                                {!isPartCompatible(part) && (
                                                    <div style={{
                                                        fontSize: '0.85rem', color: 'var(--brick-red)',
                                                        marginTop: '0.8rem', fontWeight: '700',
                                                        display: 'flex', alignItems: 'center', gap: '0.4rem'
                                                    }}>
                                                        <AlertTriangle size={14} /> Incompatible
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
