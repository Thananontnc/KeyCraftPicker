import { Link } from 'react-router-dom';
import { ChevronRight, Cpu, Layers, Zap } from 'lucide-react';

const Home = () => {
    return (
        <div className="page-container" style={{ textAlign: 'center' }}>
            {/* Hero Section */}
            <section style={{
                padding: '4rem 0',
                background: 'white',
                border: '3px solid #111',
                borderRadius: '20px',
                boxShadow: '8px 8px 0px rgba(0,0,0,1)',
                margin: '2rem auto',
                maxWidth: '900px'
            }}>
                <h1 style={{
                    fontSize: '4rem',
                    fontWeight: '800',
                    marginBottom: '1rem',
                    color: 'var(--brick-red)',
                    textShadow: '3px 3px 0px #111',
                    lineHeight: '1.1'
                }}>
                    BUILD YOUR DREAM <br /> <span style={{ color: 'var(--brick-blue)' }}>KEYBOARD</span>
                </h1>
                <p style={{
                    fontSize: '1.5rem',
                    color: 'var(--text-main)',
                    marginBottom: '2.5rem',
                    maxWidth: '600px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    fontWeight: '600'
                }}>
                    Snap together components, check compatibility, and price out your build in minutes.
                </p>
                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                    <Link to="/builder" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.25rem', background: 'var(--brick-red)' }}>
                        Start Building <ChevronRight size={24} strokeWidth={3} />
                    </Link>
                    <Link to="/parts" className="btn-primary" style={{
                        padding: '1rem 2.5rem',
                        fontSize: '1.25rem',
                        background: 'white',
                        color: 'var(--text-main)',
                        borderColor: 'var(--border-color)'
                    }}>
                        Browse Parts
                    </Link>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="grid" style={{ marginTop: '4rem' }}>
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
            </section>
        </div>
    );
};

export default Home;
