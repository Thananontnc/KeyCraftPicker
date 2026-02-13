import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // In development, we need to point to the server port 3000 (Next.js) from client port 5173 (Vite)
            // Since we haven't set up a proxy yet, we'll use full URL or configure proxy in vite.config.js
            // Let's assume proxy or CORS is handled. For now, hardcode localhost:3000
            const res = await axios.post('http://localhost:3000/api/auth/login', formData);

            if (res.data.success) {
                // Store user in local storage for simple persistence
                localStorage.setItem('user', JSON.stringify(res.data.data));
                navigate('/builder'); // Redirect to builder after login
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="page-container" style={{ maxWidth: '400px' }}>
            <div className="card">
                <h2><LogIn size={24} style={{ marginBottom: '-6px' }} /> Login to KeyCraft</h2>
                {error && <div className="alert-error">{error}</div>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>Login</button>
                </form>
                <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--accent-color)' }}>Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
