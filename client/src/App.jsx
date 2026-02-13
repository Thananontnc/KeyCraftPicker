import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { User, Keyboard, Settings, LogIn } from 'lucide-react';
import './index.css';
import Login from './Login';
import Register from './Register';
import PartBrowser from './PartBrowser';
import UserBuilds from './UserBuilds';
import AdminDashboard from './AdminDashboard';
import Builder from './Builder';
import Home from './Home';

function App() {
    return (
        <Router>
            <div className="app-container">
                <nav className="navbar">
                    <div className="logo">
                        <Keyboard size={28} /> KeyCraft
                    </div>
                    <div className="nav-links">
                        <Link to="/">Home</Link>
                        <Link to="/builder">Builder</Link>
                        <Link to="/parts">Parts</Link>
                        <Link to="/builds">My Builds</Link>
                    </div>
                    <div className="auth-links">
                        <Link to="/login" className="btn-sm"><LogIn size={16} /> Login</Link>
                        <Link to="/register" className="btn-sm">Register</Link>
                    </div>
                </nav>

                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/parts" element={<PartBrowser />} />
                        <Route path="/builder" element={<Builder />} />
                        <Route path="/builds" element={<UserBuilds />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
