import { Link } from 'react-router-dom';
import { ChevronRight, Cpu, Layers, Zap, Hammer, CircuitBoard, Keyboard, Box } from 'lucide-react';

const Home = () => {
    return (
        <div className="page-container">

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        BUILD YOUR DREAM <br /> <span style={{ color: 'var(--brick-blue)' }}>KEYBOARD</span>
                    </h1>
                    <p className="hero-subtitle">
                        Snap together components, check compatibility, and price out your custom build in minutes. The easiest way to visualize your perfect board.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/builder" className="btn-primary" style={{ padding: '1rem 2.5rem', background: 'var(--brick-red)' }}>
                            Start Building <Hammer size={24} strokeWidth={3} style={{ marginLeft: '10px' }} />
                        </Link>
                        <Link to="/parts" className="btn-primary" style={{
                            background: 'white',
                            color: 'var(--text-main)',
                            borderColor: 'var(--border-color)'
                        }}>
                            Browse Parts <ChevronRight size={24} strokeWidth={3} style={{ marginLeft: '10px' }} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works Section (New) */}
            <section className="steps-section">
                <h2 className="section-title">How It Works</h2>
                <div className="steps-grid">
                    <div className="step-card">
                        <div className="step-number">1</div>
                        <Box size={48} className="step-icon" style={{ color: 'var(--brick-red)' }} />
                        <h3>Pick a Case</h3>
                        <p>Choose the base for your build. 60%, TKL, or Full Size.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-number">2</div>
                        <CircuitBoard size={48} className="step-icon" style={{ color: 'var(--brick-blue)' }} />
                        <h3>Add PCB</h3>
                        <p>Find a compatible PCB with the features you need.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-number">3</div>
                        <Zap size={48} className="step-icon" style={{ color: 'var(--brick-yellow)' }} />
                        <h3>Select Switches</h3>
                        <p>Clicky, Tactile, or Linear? Choose your feel.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-number">4</div>
                        <Keyboard size={48} className="step-icon" style={{ color: 'var(--brick-green)' }} />
                        <h3>Keycaps</h3>
                        <p>Finish the look with a stunning keycap set.</p>
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="features-section">
                <h2 className="section-title">Why Use KeyCraft?</h2>
                <div className="features-grid">
                    <div className="card" style={{ textAlign: 'center', borderColor: 'var(--brick-blue)', borderWidth: '3px' }}>
                        <div style={{
                            margin: '0 auto 1.5rem',
                            width: '80px', height: '80px',
                            borderRadius: '50%',
                            background: 'var(--brick-blue)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white',
                            border: '3px solid #111',
                            boxShadow: '4px 4px 0 rgba(0,0,0,1)'
                        }}>
                            <Layers size={40} strokeWidth={2.5} />
                        </div>
                        <h3 style={{ color: 'var(--brick-blue)' }}>Compatibility Check</h3>
                        <p style={{ marginTop: '0.5rem', fontWeight: '500' }}>
                            Our engine automatically ensures your case, PCB, and switches snap together perfectly.
                        </p>
                    </div>

                    <div className="card" style={{ textAlign: 'center', borderColor: 'var(--brick-yellow)', borderWidth: '3px' }}>
                        <div style={{
                            margin: '0 auto 1.5rem',
                            width: '80px', height: '80px',
                            borderRadius: '50%',
                            background: 'var(--brick-yellow)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#111',
                            border: '3px solid #111',
                            boxShadow: '4px 4px 0 rgba(0,0,0,1)'
                        }}>
                            <Cpu size={40} strokeWidth={2.5} />
                        </div>
                        <h3 style={{ color: '#FBC02D' }}>Part Catalog</h3>
                        <p style={{ marginTop: '0.5rem', fontWeight: '500' }}>
                            Explore hundreds of premium parts from top brands like Gateron, Cherry, and GMK.
                        </p>
                    </div>

                    <div className="card" style={{ textAlign: 'center', borderColor: 'var(--brick-green)', borderWidth: '3px' }}>
                        <div style={{
                            margin: '0 auto 1.5rem',
                            width: '80px', height: '80px',
                            borderRadius: '50%',
                            background: 'var(--brick-green)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white',
                            border: '3px solid #111',
                            boxShadow: '4px 4px 0 rgba(0,0,0,1)'
                        }}>
                            <Zap size={40} strokeWidth={2.5} />
                        </div>
                        <h3 style={{ color: 'var(--brick-green)' }}>Instant Pricing</h3>
                        <p style={{ marginTop: '0.5rem', fontWeight: '500' }}>
                            Track your budget in real-time as you swap out components for your build.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
