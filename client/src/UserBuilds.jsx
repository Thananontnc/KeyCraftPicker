import { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, DollarSign, Trash2, X, Image as ImageIcon } from 'lucide-react';

const UserBuilds = () => {
    const [builds, setBuilds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewingBuild, setViewingBuild] = useState(null);

    useEffect(() => {
        fetchBuilds();
    }, []);

    const fetchBuilds = async () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            setLoading(false);
            return;
        }
        const user = JSON.parse(userStr);

        try {
            // Fetch builds for this user
            const res = await axios.get(`http://localhost:3000/api/builds?userId=${user.id || user._id}`);
            if (res.data.success) {
                setBuilds(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch builds', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this build?')) return;
        try {
            await axios.delete(`http://localhost:3000/api/builds/${id}`);
            setBuilds(builds.filter(build => build._id !== id));
        } catch (err) {
            console.error('Failed to delete build', err);
            alert('Failed to delete build');
        }
    };

    // Close modal on escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') setViewingBuild(null);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    if (loading) return <div className="page-container" style={{ textAlign: 'center', marginTop: '4rem' }}><div className="loader"></div><p style={{ marginTop: '1rem', fontWeight: '700' }}>Loading your builds...</p></div>;

    return (
        <div className="page-container my-builds-page">
            <h1>My Saved Builds</h1>

            {builds.length === 0 ? (
                <div className="empty-builds">
                    <p>You haven't saved any builds yet.</p>
                </div>
            ) : (
                <div className="grid">
                    {builds.map(build => (
                        <div key={build._id} className="build-card">
                            <div className="build-header">
                                <div className="build-header-left">
                                    <h3 className="build-title">{build.name}</h3>
                                    <span className="build-price">${build.totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="build-header-actions">
                                    <button
                                        onClick={() => setViewingBuild(build)}
                                        className="btn-card-action btn-card-view"
                                        title="View Component Images"
                                    >
                                        <ImageIcon size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(build._id)}
                                        className="btn-card-action btn-card-delete"
                                        title="Delete Build"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="build-parts-list">
                                {build.parts.case && (
                                    <div className="build-part-item">
                                        <span className="part-label">Case</span>
                                        <span className="part-name">{build.parts.case.name}</span>
                                    </div>
                                )}
                                {build.parts.pcb && (
                                    <div className="build-part-item">
                                        <span className="part-label">PCB</span>
                                        <span className="part-name">{build.parts.pcb.name}</span>
                                    </div>
                                )}
                                {build.parts.switch && (
                                    <div className="build-part-item">
                                        <span className="part-label">Switch</span>
                                        <span className="part-name">{build.parts.switch.name}</span>
                                    </div>
                                )}
                                {build.parts.keycap && (
                                    <div className="build-part-item">
                                        <span className="part-label">Keycaps</span>
                                        <span className="part-name">{build.parts.keycap.name}</span>
                                    </div>
                                )}
                            </div>

                            <div className="build-footer">
                                <Clock size={16} /> Created on {new Date(build.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Image Gallery Modal */}
            {viewingBuild && (
                <div className="modal-overlay" onClick={() => setViewingBuild(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setViewingBuild(null)}>
                            <X size={24} />
                        </button>

                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{viewingBuild.name}</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Component Gallery</p>

                        <div className="gallery-grid">
                            {viewingBuild.parts.case && (
                                <div className="gallery-item">
                                    <div className="gallery-label">Case</div>
                                    <div className="gallery-image-container">
                                        <img
                                            src={viewingBuild.parts.case.image}
                                            alt={viewingBuild.parts.case.name}
                                            className="gallery-image"
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
                                        />
                                    </div>
                                    <div className="gallery-title">{viewingBuild.parts.case.name}</div>
                                </div>
                            )}
                            {viewingBuild.parts.pcb && (
                                <div className="gallery-item">
                                    <div className="gallery-label">PCB</div>
                                    <div className="gallery-image-container">
                                        <img
                                            src={viewingBuild.parts.pcb.image}
                                            alt={viewingBuild.parts.pcb.name}
                                            className="gallery-image"
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
                                        />
                                    </div>
                                    <div className="gallery-title">{viewingBuild.parts.pcb.name}</div>
                                </div>
                            )}
                            {viewingBuild.parts.switch && (
                                <div className="gallery-item">
                                    <div className="gallery-label">Switch</div>
                                    <div className="gallery-image-container">
                                        <img
                                            src={viewingBuild.parts.switch.image}
                                            alt={viewingBuild.parts.switch.name}
                                            className="gallery-image"
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
                                        />
                                    </div>
                                    <div className="gallery-title">{viewingBuild.parts.switch.name}</div>
                                </div>
                            )}
                            {viewingBuild.parts.keycap && (
                                <div className="gallery-item">
                                    <div className="gallery-label">Keycaps</div>
                                    <div className="gallery-image-container">
                                        <img
                                            src={viewingBuild.parts.keycap.image}
                                            alt={viewingBuild.parts.keycap.name}
                                            className="gallery-image"
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
                                        />
                                    </div>
                                    <div className="gallery-title">{viewingBuild.parts.keycap.name}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserBuilds;
