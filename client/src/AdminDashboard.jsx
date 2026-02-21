import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
    const [parts, setParts] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        type: 'case',
        price: '',
        image: '',
        specs: {}
    });

    useEffect(() => {
        fetchParts();
    }, []);

    const fetchParts = async () => {
        try {
            const res = await api.get('/parts');
            if (res.data.success) {
                setParts(res.data.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSpecChange = (key, value) => {
        setFormData({
            ...formData,
            specs: { ...formData.specs, [key]: value }
        });
    };

    const renderSpecFields = () => {
        switch (formData.type) {
            case 'case':
                return (
                    <>
                        <div className="form-group">
                            <label>Layout</label>
                            <input
                                placeholder="e.g. 60%, TKL"
                                value={formData.specs?.layout || ''}
                                onChange={(e) => handleSpecChange('layout', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Mounting Type</label>
                            <input
                                placeholder="e.g. Tray, Gasket"
                                value={formData.specs?.mountingType || ''}
                                onChange={(e) => handleSpecChange('mountingType', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Supported Layouts (comma separated)</label>
                            <input
                                placeholder="e.g. 60%, 65%"
                                value={formData.specs?.supportedLayouts || ''}
                                onChange={(e) => handleSpecChange('supportedLayouts', e.target.value.split(',').map(s => s.trim()))}
                            />
                        </div>
                    </>
                );
            case 'pcb':
                return (
                    <>
                        <div className="form-group">
                            <label>Layout</label>
                            <input
                                placeholder="e.g. 60%"
                                value={formData.specs?.layout || ''}
                                onChange={(e) => handleSpecChange('layout', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Mounting Type</label>
                            <input
                                placeholder="e.g. Tray"
                                value={formData.specs?.mountingType || ''}
                                onChange={(e) => handleSpecChange('mountingType', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Switch Support</label>
                            <select
                                value={formData.specs?.switchSupport || '5-pin'}
                                onChange={(e) => handleSpecChange('switchSupport', e.target.value)}
                            >
                                <option value="3-pin">3-pin</option>
                                <option value="5-pin">5-pin</option>
                            </select>
                        </div>
                    </>
                );
            case 'switch':
                return (
                    <>
                        <div className="form-group">
                            <label>Brand</label>
                            <input
                                placeholder="e.g. Cherry"
                                value={formData.specs?.brand || ''}
                                onChange={(e) => handleSpecChange('brand', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Switch Type</label>
                            <select
                                value={formData.specs?.switchType || 'Linear'}
                                onChange={(e) => handleSpecChange('switchType', e.target.value)}
                            >
                                <option value="Linear">Linear</option>
                                <option value="Tactile">Tactile</option>
                                <option value="Clicky">Clicky</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Price Per Unit</label>
                            <input
                                type="number" step="0.01"
                                value={formData.specs?.pricePerUnit || ''}
                                onChange={(e) => handleSpecChange('pricePerUnit', e.target.value)}
                            />
                        </div>
                    </>
                );
            case 'keycap':
                return (
                    <>
                        <div className="form-group">
                            <label>Material</label>
                            <input
                                placeholder="e.g. PBT"
                                value={formData.specs?.material || ''}
                                onChange={(e) => handleSpecChange('material', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Supported Layouts (comma separated)</label>
                            <input
                                placeholder="e.g. 60%, TKL"
                                value={formData.specs?.layoutSupport || ''}
                                onChange={(e) => handleSpecChange('layoutSupport', e.target.value.split(',').map(s => s.trim()))}
                            />
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/parts', formData);
            alert('Part added!');
            fetchParts();
            setFormData({ name: '', type: 'case', price: '', image: '', specs: {} });
        } catch (err) {
            alert('Failed to add part: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this part?')) return;
        try {
            await api.delete(`/parts/${id}`);
            fetchParts(); // Refresh list
        } catch (err) {
            console.error(err);
            alert('Failed to delete part');
        }
    };

    return (
        <div className="page-container" style={{ textAlign: 'left', marginTop: '2rem' }}>
            <h1>Admin Dashboard</h1>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3>Add New Part</h3>
                <form onSubmit={handleSubmit} className="auth-form" style={{ maxWidth: '100%' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Name</label>
                            <input name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Type</label>
                            <select name="type" value={formData.type} onChange={handleChange}>
                                <option value="case">Case</option>
                                <option value="pcb">PCB</option>
                                <option value="switch">Switch</option>
                                <option value="keycap">Keycap</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Price</label>
                            <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Image URL</label>
                            <input name="image" value={formData.image} onChange={handleChange} required />
                        </div>

                        {/* Dynamic Specs Fields */}
                        {renderSpecFields()}

                    </div>
                    <button type="submit" className="btn-primary" style={{ width: 'fit-content' }}>
                        <Plus size={16} /> Add Part
                    </button>
                </form>
            </div>

            <h3>Manage Inventory</h3>
            <div className="grid">
                {parts.map(part => (
                    <div key={part._id} className="card part-card" style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <strong>{part.name}</strong>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{part.type} - ${part.price}</div>
                            </div>
                            <button onClick={() => handleDelete(part._id)} className="btn-sm" style={{ color: 'var(--brick-red)', borderColor: 'var(--brick-red)' }}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
