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
            const res = await axios.get('http://localhost:3000/api/parts');
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Basic specs handling based on type
            let specs = {};
            if (formData.type === 'case') specs = { layout: '60%', mountingType: 'Tray', supportedLayouts: ['60%'] };
            if (formData.type === 'switch') specs = { type: 'Linear', pinType: '5-pin' };
            // In a real app, these would be form fields. Hardcoding for rapid prototype speed as requested.

            await axios.post('http://localhost:3000/api/parts', { ...formData, specs });
            alert('Part added!');
            fetchParts();
            setFormData({ name: '', type: 'case', price: '', image: '', specs: {} });
        } catch (err) {
            alert('Failed to add part');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this part?')) return;
        // Implement DELETE API if needed, or just hide for now
        // await axios.delete(`http://localhost:3000/api/parts/${id}`);
        alert('Delete functionality to be implemented in API');
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
                            <select name="type" value={formData.type} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: 'var(--radius)', backgroundColor: 'var(--bg-color)', color: 'white', border: '1px solid var(--border-color)' }}>
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
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{part.type} - ${part.price}</div>
                            </div>
                            <button onClick={() => handleDelete(part._id)} className="btn-sm" style={{ color: '#ef4444', borderColor: '#ef4444' }}>
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
