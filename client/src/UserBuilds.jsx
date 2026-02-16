import { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, DollarSign, Trash2 } from 'lucide-react';

const UserBuilds = () => {
    const [builds, setBuilds] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="page-container" style={{ textAlign: 'center', marginTop: '4rem' }}><div className="loader"></div><p style={{marginTop: '1rem', fontWeight: '700'}}>Loading your builds...</p></div>;

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
                            <button
                                onClick={() => handleDelete(build._id)}
                                className="btn-delete-build"
                                title="Delete Build"
                            >
                                <Trash2 size={20} />
                            </button>

                            <div className="build-header">
                                <h3 className="build-title">{build.name}</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                                    <span className="build-price">${build.totalPrice.toFixed(2)}</span>
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
        </div>
    );
};

export default UserBuilds;
