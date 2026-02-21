import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, CircuitBoard, Keyboard, Cpu, Filter } from 'lucide-react';

const PartTypeIcon = ({ type }) => {
    switch (type) {
        case 'case': return <Package size={18} />;
        case 'pcb': return <CircuitBoard size={18} />;
        case 'switch': return <Cpu size={18} />;
        case 'keycap': return <Keyboard size={18} />;
        default: return <Package size={18} />;
    }
};

const PartBrowser = () => {
    const [parts, setParts] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Debounce search effect could be added here, 
        // but for simplicity, we'll fetch when activeTab changes or search is submitted (or maybe just typing?)
        // Let's attach fetchParts to searchQuery as well for live search
        const delayDebounceFn = setTimeout(() => {
            fetchParts();
        }, 300); // 300ms debounce

        return () => clearTimeout(delayDebounceFn);
    }, [activeTab, searchQuery]);

    const fetchParts = async () => {
        setLoading(true);
        try {
            // Build query params
            const params = new URLSearchParams();
            if (activeTab !== 'all') params.append('type', activeTab);
            if (searchQuery) params.append('search', searchQuery);

            const res = await api.get(`/parts?${params.toString()}`);
            if (res.data.success) {
                setParts(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch parts', err);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'all', label: 'All Parts' },
        { id: 'case', label: 'Cases' },
        { id: 'pcb', label: 'PCBs' },
        { id: 'switch', label: 'Switches' },
        { id: 'keycap', label: 'Keycaps' },
    ];

    return (
        <div className="page-container" style={{ textAlign: 'left', marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '3rem', color: 'var(--brick-red)' }}>Part Catalog</h1>
                    <p style={{ color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: '600' }}>Browse high-quality components for your next build.</p>
                </div>

                {/* Search Bar */}
                <div style={{ position: 'relative', width: '300px' }}>
                    <Filter className="search-icon" size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search parts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 10px 10px 40px',
                            borderRadius: '12px',
                            border: '2px solid var(--border-color)',
                            fontSize: '1rem',
                            outline: 'none',
                            transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--brick-blue)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                    />
                </div>
            </div>

            <div className="tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    Loading components...
                </div>
            ) : (
                <div className="grid">
                    {parts.map(part => (
                        <div key={part._id} className="card part-card">
                            <div className="part-image-container">
                                <img
                                    src={part.image}
                                    alt={part.name}
                                    className="part-image"
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
                                />
                                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                                    <span className="badge">
                                        <PartTypeIcon type={part.type} /> {part.type}
                                    </span>
                                </div>
                            </div>
                            <div className="part-info">
                                <div className="part-header">
                                    <h3>{part.name}</h3>
                                </div>
                                <p className="price">${part.price.toFixed(2)}</p>

                                {/* Specs preview */}
                                {part.specs && (
                                    <div className="specs-container">
                                        {part.type === 'case' && (
                                            <>
                                                <span className="specs">{part.specs.layout}</span>
                                                <span className="specs">{part.specs.mountingType}</span>
                                            </>
                                        )}
                                        {part.type === 'pcb' && (
                                            <>
                                                <span className="specs">{part.specs.layout}</span>
                                                <span className="specs">{part.specs.hotSwap ? 'Hot-swap' : 'Solder'}</span>
                                            </>
                                        )}
                                        {part.type === 'switch' && (
                                            <>
                                                <span className="specs">{part.specs.brand}</span>
                                                <span className="specs">{part.specs.switchType}</span>
                                            </>
                                        )}
                                        {part.type === 'keycap' && (
                                            <>
                                                <span className="specs">{part.specs.material}</span>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PartBrowser;
