import { useState } from 'react';
import api from './utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ... imports

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', formData);

            if (res.data.success) {
                // Store user and token
                localStorage.setItem('user', JSON.stringify(res.data.data));
                localStorage.setItem('token', res.data.token);
                window.dispatchEvent(new Event('auth-change'));
                navigate('/builder'); // Redirect to builder after login
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="auth-container">
            {/* Left Side - Branding */}
            <div className="auth-left">
                <div className="auth-left-content">
                    <h1>KeyCraft</h1>
                    <p>Build your dream keyboard, brick by brick.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="auth-right">
                <div className="auth-card">
                    <h2 className="auth-title">Login</h2>
                    <p className="auth-subtitle">Welcome back, get building!</p>

                    {error && <div className="alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div>
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                placeholder="Enter your username"
                            />
                        </div>
                        <div>
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter your password"
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                            <LogIn size={20} style={{ marginRight: '8px' }} /> Login
                        </button>
                    </form>

                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)' }}>
                            New here? <Link to="/register" style={{ color: 'var(--brick-blue)', fontWeight: '800' }}>Create an account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
