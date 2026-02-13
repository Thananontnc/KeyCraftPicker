import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, CircuitBoard, Keyboard, Cpu } from 'lucide-react';

const PartTypeIcon = ({ type }) => {
    switch (type) {
        case 'case': return <Package size={20} />;
        case 'pcb': return <CircuitBoard size={20} />;
        case 'switch': return <Cpu size={20} />;
        case 'keycap': return <Keyboard size={20} />;
        default: return <Package size={20} />;
    }
};

const PartBrowser = () => {
    const [parts, setParts] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchParts();
    }, [activeTab]);

    const fetchParts = async () => {
        setLoading(true);
        try {
            // Build query string
            const url = activeTab === 'all'
                ? 'http://localhost:3000/api/parts'
                : `http://localhost:3000/api/parts?type=${activeTab}`;

            const res = await axios.get(url);
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
            <h1>Part Catalog</h1>

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
                <p>Loading components...</p>
            ) : (
                <div className="grid">
                    {parts.map(part => (
                        <div key={part._id} className="card part-card">
                            <div className="part-image" style={{ backgroundImage: `url(${part.image})` }}></div>
                            <div className="part-info">
                                <div className="part-header">
                                    <h3>{part.name}</h3>
                                    <span className="badge"><PartTypeIcon type={part.type} /> {part.type}</span>
                                </div>
                                <p className="price">${part.price.toFixed(2)}</p>
                                {/* Specs preview could go here */}
                                {part.specs && part.type === 'case' && <p className="specs">{part.specs.layout} Layout</p>}
                                {part.specs && part.type === 'switch' && <p className="specs">{part.specs.type} Switch</p>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PartBrowser;
