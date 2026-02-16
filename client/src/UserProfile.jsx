import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Camera, Save, Package, Cpu, Zap, Award, TrendingUp, DollarSign, Shield, Sparkles, Heart } from 'lucide-react';

const UserProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState('');
    const [builds, setBuilds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                const userId = parsedUser.id || parsedUser._id;

                if (userId) {
                    fetchProfile(userId);
                    fetchBuilds(userId);
                } else {
                    navigate('/login');
                }
            } catch (e) {
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, []);

    const fetchProfile = async (userId) => {
        try {
            const res = await axios.get(`http://localhost:3000/api/user/profile?userId=${userId}`);
            if (res.data.success) {
                setUser(res.data.user);
                setBio(res.data.user.bio || '');
                setAvatar(res.data.user.avatar || '');
            }
        } catch (err) {
            console.error('Failed to fetch profile', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchBuilds = async (userId) => {
        if (!userId) return;
        try {
            const res = await axios.get(`http://localhost:3000/api/builds?userId=${userId}`);
            if (res.data.success) {
                // Sort: favorites first, then by date (newest first)
                const sorted = (res.data.data || []).sort((a, b) => {
                    const favA = a.favorite === true;
                    const favB = b.favorite === true;
                    if (favA && !favB) return -1;
                    if (!favA && favB) return 1;
                    const dateA = new Date(a.createdAt || 0);
                    const dateB = new Date(b.createdAt || 0);
                    return dateB - dateA;
                });
                setBuilds(sorted);
            }
        } catch (err) {
            console.error('Failed to fetch builds', err);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const res = await axios.post('http://localhost:3000/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                setAvatar(res.data.url);
            }
        } catch (err) {
            alert('Failed to upload image');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (!user) return;

        try {
            const res = await axios.put('http://localhost:3000/api/user/profile', {
                userId: user._id,
                bio,
                avatar
            });

            if (res.data.success) {
                const updatedUser = res.data.user;
                localStorage.setItem('user', JSON.stringify({
                    ...JSON.parse(localStorage.getItem('user')),
                    avatar: updatedUser.avatar,
                    ...updatedUser
                }));
                window.dispatchEvent(new Event('auth-change'));

                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
                setUser(updatedUser);
            }
        } catch (err) {
            console.error('Failed to update profile', err);
            alert('Failed to update profile.');
        }
    };

    // --- Stats Calculation ---
    const totalValue = builds.reduce((acc, b) => acc + b.totalPrice, 0);
    const totalBuilds = builds.length;
    const uniqueSwitches = new Set(builds.map(b => b.parts.switch?.name).filter(Boolean)).size;

    // --- Badge Logic ---
    const badges = [];
    if (totalBuilds >= 1) badges.push({ icon: <Package size={14} />, label: 'Builder', color: 'var(--brick-blue)' });
    if (totalBuilds >= 5) badges.push({ icon: <Zap size={14} />, label: 'Power User', color: 'var(--brick-yellow)' });
    if (totalValue >= 500) badges.push({ icon: <DollarSign size={14} />, label: 'Big Spender', color: 'var(--brick-green)' });
    if (uniqueSwitches >= 3) badges.push({ icon: <Cpu size={14} />, label: 'Switch Hitter', color: 'var(--brick-red)' });
    if (new Date(user?.createdAt) < new Date('2024-01-01')) badges.push({ icon: <Award size={14} />, label: 'Early Adopter', color: '#ff00ff' });

    // --- Loading State ---
    if (loading) {
        return (
            <div className="profile-page">
                <div className="profile-empty-state">
                    <div className="profile-empty-icon">⏳</div>
                    <h2>Loading Profile...</h2>
                    <p>Fetching your keyboard data</p>
                </div>
            </div>
        );
    }

    // --- Unauthenticated State ---
    if (!user) {
        return (
            <div className="profile-page">
                <div className="profile-empty-state">
                    <div className="profile-empty-icon">🔒</div>
                    <h2>Access Required</h2>
                    <p>Please login to view your profile and builder stats.</p>
                    <a href="/login" className="btn-primary" style={{ marginTop: '1rem' }}>
                        <Shield size={18} /> Login Now
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">

            {/* === PROFILE BANNER === */}
            <div className="profile-banner">
                <div className="profile-banner-pattern"></div>
                <div className="profile-banner-content">
                    <div className="profile-avatar-wrapper">
                        <div className="profile-avatar">
                            {avatar ? (
                                <img src={`http://localhost:3000${avatar}`} alt="Profile" />
                            ) : (
                                <User size={60} color="var(--text-muted)" />
                            )}
                        </div>
                        <label className="profile-avatar-btn">
                            <Camera size={18} />
                            <input type="file" style={{ display: 'none' }} onChange={handleFileChange} accept="image/*" />
                        </label>
                        {uploading && <span className="profile-uploading">Uploading...</span>}
                    </div>

                    <div className="profile-header-info">
                        <h1 className="profile-username">{user.username}</h1>
                        <p className="profile-member-since">
                            Member since {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                        {badges.length > 0 && (
                            <div className="profile-badges">
                                {badges.map((badge, idx) => (
                                    <span key={idx} className="profile-badge" style={{ background: badge.color }}>
                                        {badge.icon} {badge.label}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* === STATS ROW === */}
            <div className="profile-stats-row">
                <div className="profile-stat-card">
                    <div className="profile-stat-accent" style={{ background: 'var(--brick-blue)' }}></div>
                    <div className="profile-stat-content">
                        <div className="profile-stat-icon" style={{ background: 'rgba(0, 85, 191, 0.1)', color: 'var(--brick-blue)' }}>
                            <Package size={22} />
                        </div>
                        <div className="profile-stat-value" style={{ color: 'var(--brick-blue)' }}>{totalBuilds}</div>
                        <div className="profile-stat-label">Total Builds</div>
                    </div>
                </div>
                <div className="profile-stat-card">
                    <div className="profile-stat-accent" style={{ background: 'var(--brick-green)' }}></div>
                    <div className="profile-stat-content">
                        <div className="profile-stat-icon" style={{ background: 'rgba(35, 126, 54, 0.1)', color: 'var(--brick-green)' }}>
                            <DollarSign size={22} />
                        </div>
                        <div className="profile-stat-value" style={{ color: 'var(--brick-green)' }}>${totalValue.toFixed(0)}</div>
                        <div className="profile-stat-label">Collection Value</div>
                    </div>
                </div>
                <div className="profile-stat-card">
                    <div className="profile-stat-accent" style={{ background: 'var(--brick-red)' }}></div>
                    <div className="profile-stat-content">
                        <div className="profile-stat-icon" style={{ background: 'rgba(209, 16, 19, 0.1)', color: 'var(--brick-red)' }}>
                            <Cpu size={22} />
                        </div>
                        <div className="profile-stat-value" style={{ color: 'var(--brick-red)' }}>{uniqueSwitches}</div>
                        <div className="profile-stat-label">Switches Tried</div>
                    </div>
                </div>
            </div>

            {/* === BIO SECTION === */}
            <div className="profile-bio-card">
                <h3 className="profile-section-title">
                    <Sparkles size={20} /> About Me
                </h3>
                <div className="profile-bio-field">
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about your keyboard journey..."
                        rows="4"
                        maxLength={160}
                        className="profile-bio-textarea"
                    />
                    <div className="profile-bio-counter">{bio.length}/160</div>
                </div>
                <button onClick={handleSave} className="profile-save-btn">
                    <Save size={18} /> Save Changes
                </button>
                {saveSuccess && (
                    <div className="profile-save-success">
                        ✨ Profile updated successfully!
                    </div>
                )}
            </div>

            {/* === THE ARMORY === */}
            <div className="profile-armory">
                <h3 className="profile-section-title">
                    <Package size={20} /> The Armory
                </h3>

                {builds.length === 0 ? (
                    <div className="profile-armory-empty">
                        <p>No builds in the armory yet. Go build something!</p>
                        <a href="/builder" className="btn-primary" style={{ marginTop: '1rem', fontSize: '1rem', padding: '0.7rem 1.5rem' }}>
                            Start Building
                        </a>
                    </div>
                ) : (
                    <div className="profile-build-grid">
                        {builds.map(build => {
                            console.log('Rendering build:', build);
                            return (
                                <div
                                    key={build._id}
                                    className="profile-build-card"
                                    onClick={() => navigate(`/builder/${build._id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="profile-build-header">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span className="profile-build-name">{build.name || 'Untitled Build'}</span>
                                            {build.favorite && <Heart size={16} fill="var(--brick-red)" color="var(--brick-red)" />}
                                        </div>
                                        <span className="profile-build-price">${(build.totalPrice || 0).toFixed(0)}</span>
                                    </div>
                                    <div className="profile-build-parts">
                                        {build.parts?.case && (
                                            <div className="profile-build-part">
                                                <span className="profile-part-emoji">📦</span>
                                                <span className="profile-part-name">{build.parts.case.name}</span>
                                            </div>
                                        )}
                                        {build.parts?.switch && (
                                            <div className="profile-build-part">
                                                <span className="profile-part-emoji">🏗️</span>
                                                <span className="profile-part-name">{build.parts.switch.name}</span>
                                            </div>
                                        )}
                                        {build.parts?.keycap && (
                                            <div className="profile-build-part">
                                                <span className="profile-part-emoji">🎨</span>
                                                <span className="profile-part-name">{build.parts.keycap.name}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

        </div>
    );
};

export default UserProfile;
