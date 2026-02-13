import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { User, Keyboard, Settings, LogIn } from 'lucide-react';
import './style.css'; // Assuming vanilla CSS is here or index.css
import Login from './Login';
import Register from './Register';
import PartBrowser from './PartBrowser';
import UserBuilds from './UserBuilds';

// Pages (Placeholder for now)
const Home = () => (
    <div className="page-container">
        <h1>Welcome to KeyCraft Picker</h1>
        <p>Build your dream mechanical keyboard with confidence.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/builder" className="btn-primary">Start Building</Link>
            <Link to="/parts" className="btn-primary" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>Browse Parts</Link>
        </div>
    </div>
);

// Builder still placeholder for now
const Builder = () => <div className="page-container"><h2>Keyboard Builder</h2></div>;

function App() {
    return (
        <Router>
            <div className="app-container">
                <nav className="navbar">
                    <div className="logo">
                        <Keyboard size={24} /> KeyCraft
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
                    </Routes>
                </main>
            </div>
        </Router>
    );
}


export default App;
