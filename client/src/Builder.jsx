import { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, AlertTriangle, CheckCircle } from 'lucide-react';

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

    return (
        <div className="page-container" style={{ textAlign: 'left', marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Keyboard Builder</h1>
                <div style={{ textAlign: 'right' }}>
                    <h2 className="price">Total: ${calculateTotal()}</h2>
                    <button onClick={handleSave} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Save size={18} /> Save Build
                    </button>
                </div>
            </div>

            {/* Compatibility Status */}
            {!compatibility.compatible && (
                <div className="alert-error" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
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
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    color: '#4ade80',
                    padding: '1rem',
                    borderRadius: 'var(--radius)',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <CheckCircle size={20} /> All parts compatible so far.
                </div>
            )}

            {/* Build Slots */}
            <div className="grid">
                {['case', 'pcb', 'switch', 'keycap'].map(type => (
                    <div key={type} className="card part-card" style={{ borderStyle: build[type] ? 'solid' : 'dashed' }}>
                        {build[type] ? (
                            <>
                                <div className="part-image" style={{ backgroundImage: `url(${build[type].image})`, height: '140px' }}></div>
                                <div className="part-info">
                                    <h3>{build[type].name}</h3>
                                    <p className="price" style={{ fontSize: '1rem' }}>${build[type].price}</p>
                                    <button onClick={() => fetchPartsForSlot(type)} className="btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Change</button>
                                </div>
                            </>
                        ) : (
                            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                <h3>Select {type.toUpperCase()}</h3>
                                <button onClick={() => fetchPartsForSlot(type)} className="btn-primary" style={{ marginTop: '1rem' }}>+ Add</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Selection Modal (Simplified as inline list for now) */}
            {activeSlot && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 50,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div className="card" style={{ width: '90%', maxWidth: '800px', maxHeight: '80vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h2>Select {activeSlot}</h2>
                            <button onClick={() => setActiveSlot(null)} className="btn-sm">Close</button>
                        </div>

                        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                            {parts.map(part => (
                                <div key={part._id} className="part-card" onClick={() => selectPart(part)} style={{ cursor: 'pointer' }}>
                                    <div className="part-image" style={{ backgroundImage: `url(${part.image})`, height: '120px' }}></div>
                                    <div className="part-info">
                                        <h4 style={{ fontSize: '1rem' }}>{part.name}</h4>
                                        <p className="price" style={{ fontSize: '1rem' }}>${part.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Builder;
