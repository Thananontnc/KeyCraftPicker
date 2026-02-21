import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from './utils/api';
import { ArrowLeft, Keyboard, DollarSign } from 'lucide-react';

const SharedBuild = () => {
    const { buildId } = useParams();
    const [build, setBuild] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBuild();
    }, [buildId]);

    const fetchBuild = async () => {
        try {
            const res = await api.get(`/builds/${buildId}`);
            if (res.data.success) {
                setBuild(res.data.data);
            } else {
                setError('Build not found');
            }
        } catch (err) {
            setError('This build does not exist or has been removed.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="page-container" style={{ textAlign: 'center', marginTop: '4rem' }}>
            <div className="loader"></div>
            <p style={{ marginTop: '1rem', fontWeight: '700' }}>Loading shared build...</p>
        </div>
    );

    if (error) return (
        <div className="page-container" style={{ textAlign: 'center', marginTop: '4rem' }}>
            <div style={{
                background: 'white', border: '3px solid var(--border-color)',
                borderRadius: 'var(--radius-md)', padding: '3rem', maxWidth: '500px',
                margin: '0 auto', boxShadow: 'var(--shadow-hard)'
            }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--brick-red)', marginBottom: '1rem' }}>Build Not Found</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
                <Link to="/builder" className="btn-primary" style={{ textDecoration: 'none' }}>
                    Go to Builder
                </Link>
            </div>
        </div>
    );

    const partTypes = [
        { key: 'case', label: 'Case' },
        { key: 'pcb', label: 'PCB' },
        { key: 'switch', label: 'Switch' },
        { key: 'keycap', label: 'Keycaps' },
    ];

    return (
        <div className="page-container shared-build-page">
            <Link to="/builder" className="shared-back-link">
                <ArrowLeft size={18} /> Back to Builder
            </Link>

            <div className="shared-build-header">
                <div className="shared-build-header-icon">
                    <Keyboard size={32} />
                </div>
                <h1 className="shared-build-title">{build.name}</h1>
                <p className="shared-build-subtitle">Shared Keyboard Build</p>
                <div className="shared-build-price-tag">
                    <DollarSign size={20} />
                    <span>${build.totalPrice?.toFixed(2)}</span>
                </div>
            </div>

            <div className="shared-parts-grid">
                {partTypes.map(({ key, label }) => {
                    const part = build.parts?.[key];
                    if (!part) return null;
                    return (
                        <div key={key} className="shared-part-card">
                            <div className="shared-part-image-wrapper">
                                <img
                                    src={part.image}
                                    alt={part.name}
                                    className="shared-part-image"
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x250?text=No+Image'; }}
                                />
                                <span className="shared-part-type-badge">{label}</span>
                            </div>
                            <div className="shared-part-info">
                                <h3 className="shared-part-name">{part.name}</h3>
                                <span className="shared-part-price">${part.price?.toFixed(2)}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="shared-build-footer">
                <p>Created on {new Date(build.createdAt).toLocaleDateString()}</p>
                <Link to="/builder" className="btn-primary" style={{
                    textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    border: '3px solid var(--brick-black)', boxShadow: '4px 4px 0px rgba(0,0,0,0.2)'
                }}>
                    <Keyboard size={18} /> Build Your Own
                </Link>
            </div>
        </div>
    );
};

export default SharedBuild;
