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

    if (loading) return <div className="page-container"><p>Loading builds...</p></div>;

    return (
        <div className="page-container" style={{ textAlign: 'left', marginTop: '2rem' }}>
            <h1>My Saved Builds</h1>

            {builds.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <p>You haven't saved any builds yet.</p>
                </div>
            ) : (
                <div className="grid">
                    {builds.map(build => (
                        <div key={build._id} className="card part-card" style={{ padding: '1.5rem', position: 'relative' }}>
                            <button
                                onClick={() => handleDelete(build._id)}
                                className="btn-sm"
                                style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    color: 'var(--brick-red)',
                                    borderColor: 'transparent',
                                    background: 'transparent'
                                }}
                                title="Delete Build"
                            >
                                <Trash2 size={18} />
                            </button>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', paddingRight: '2rem' }}>
                                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{build.name}</h3>
                                <span className="price">${build.totalPrice.toFixed(2)}</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                                {build.parts.case && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Case:</span> <span>{build.parts.case.name}</span></div>}
                                {build.parts.pcb && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>PCB:</span> <span>{build.parts.pcb.name}</span></div>}
                                {build.parts.switch && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Switch:</span> <span>{build.parts.switch.name}</span></div>}
                                {build.parts.keycap && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Keycaps:</span> <span>{build.parts.keycap.name}</span></div>}
                            </div>

                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={14} /> {new Date(build.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserBuilds;
