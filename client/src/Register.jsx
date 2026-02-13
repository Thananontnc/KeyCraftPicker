import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/api/auth/register', formData);

            if (res.data.success) {
                // Auto login after register
                localStorage.setItem('user', JSON.stringify(res.data.data));
                navigate('/builder');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="auth-container">
            {/* Left Side - Branding */}
            <div className="auth-left">
                <div className="auth-left-content">
                    <h1>KeyCraft</h1>
                    <p>Every great build starts with a single brick.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="auth-right">
                <div className="auth-card">
                    <h2 className="auth-title">Register</h2>
                    <p className="auth-subtitle">Join the builder community today.</p>

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
                                placeholder="Choose a username"
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
                                placeholder="Create a password"
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem', background: 'var(--brick-green)' }}>
                            <UserPlus size={20} style={{ marginRight: '8px' }} /> Join KeyCraft
                        </button>
                    </form>

                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Already have an account? <Link to="/login" style={{ color: 'var(--brick-blue)', fontWeight: '800' }}>Login here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
