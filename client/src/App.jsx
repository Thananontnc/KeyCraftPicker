import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { User, Keyboard, LogIn, LogOut } from 'lucide-react';
import './index.css';
import Login from './Login';
import Register from './Register';
import PartBrowser from './PartBrowser';
import UserBuilds from './UserBuilds';
import AdminDashboard from './AdminDashboard';
import Builder from './Builder';
import Home from './Home';
import UserProfile from './UserProfile';
import SharedBuild from './SharedBuild';

// Navbar Component to use hooks inside Router
const Navbar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const checkUser = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
    };

    useEffect(() => {
        checkUser();
        // Listen for custom event to update state immediately
        window.addEventListener('auth-change', checkUser);
        return () => window.removeEventListener('auth-change', checkUser);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth-change'));
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="logo">
                <Keyboard size={32} /> KeyCraft
            </Link>
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/builder">Builder</Link>
                <Link to="/parts">Parts</Link>
                {user && <Link to="/builds">My Builds</Link>}
            </div>
            <div className="auth-links">
                {user ? (
                    <>
                        <Link to="/profile" className="user-greeting" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {user.avatar ? (
                                <img src={`${user.avatar}`} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--brick-black)' }} />
                            ) : (
                                <User size={18} />
                            )}
                            {user.username}
                        </Link>
                        <button onClick={handleLogout} className="btn-sm btn-logout">
                            <LogOut size={16} /> Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register" className="btn-register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

function App() {
    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/parts" element={<PartBrowser />} />
                        <Route path="/builder" element={<Builder />} />
                        <Route path="/builder/:buildId" element={<Builder />} />
                        <Route path="/builds" element={<UserBuilds />} />
                        <Route path="/shared/:buildId" element={<SharedBuild />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
