import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getImageUrl } from './utils/api';
import { Heart, Search, TrendingUp, Clock, DollarSign, ArrowUpDown, User, Keyboard, Package, Cpu, Sparkles, Filter } from 'lucide-react';

const CommunityShowcase = () => {
    const [builds, setBuilds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState('newest');
    const [search, setSearch] = useState('');
    const [searchDebounce, setSearchDebounce] = useState('');
    const navigate = useNavigate();

    const currentUser = (() => {
        try {
            const u = localStorage.getItem('user');
            return u ? JSON.parse(u) : null;
        } catch { return null; }
    })();
    const currentUserId = currentUser?.id || currentUser?._id;

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => setSearchDebounce(search), 300);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        fetchCommunityBuilds();
    }, [sort, searchDebounce]);

    const fetchCommunityBuilds = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ sort });
            if (searchDebounce) params.append('search', searchDebounce);
            const res = await api.get(`/community?${params}`);
            if (res.data.success) {
                setBuilds(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch community builds', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (e, buildId) => {
        e.stopPropagation();
        if (!currentUserId) {
            alert('Please login to like builds!');
            return;
        }
        try {
            const res = await api.post(`/community/${buildId}/like`);
            if (res.data.success) {
                setBuilds(prev => prev.map(b => {
                    if (b._id === buildId) {
                        const newLikes = res.data.liked
                            ? [...(b.likes || []), currentUserId]
                            : (b.likes || []).filter(id => id !== currentUserId);
                        return { ...b, likes: newLikes };
                    }
                    return b;
                }));
            }
        } catch (err) {
            console.error('Failed to like build', err);
        }
    };

    const isLikedByMe = (build) => {
        if (!currentUserId) return false;
        return (build.likes || []).includes(currentUserId);
    };

    const sortOptions = [
        { value: 'newest', label: 'Newest', icon: <Clock size={14} /> },
        { value: 'popular', label: 'Most Liked', icon: <TrendingUp size={14} /> },
        { value: 'price-high', label: 'Price: High → Low', icon: <DollarSign size={14} /> },
        { value: 'price-low', label: 'Price: Low → High', icon: <DollarSign size={14} /> },
    ];

    const partColors = {
        case: { bg: 'var(--brick-red)', border: '#b91c1c' },
        pcb: { bg: 'var(--brick-blue)', border: '#1e40af' },
        switch: { bg: 'var(--brick-yellow)', border: '#b45309', text: 'var(--brick-black)' },
        keycap: { bg: 'var(--brick-green)', border: '#15803d' },
    };

    return (
        <div className="page-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <h1 style={{
                    fontSize: '3rem', fontWeight: '900', color: 'var(--brick-red)',
                    textTransform: 'uppercase', letterSpacing: '-1px',
                    textShadow: '3px 3px 0px rgba(0,0,0,0.1)', marginBottom: '0.5rem'
                }}>
                    <Sparkles size={32} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                    Community Builds
                </h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    Explore keyboard builds from the community. Get inspired!
                </p>
            </div>

            {/* Controls */}
            <div style={{
                display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap',
                alignItems: 'center', justifyContent: 'space-between'
            }}>
                {/* Search */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: 'white', border: '3px solid var(--brick-black)',
                    borderRadius: '12px', padding: '0.5rem 1rem', flex: '1', minWidth: '200px',
                    boxShadow: '4px 4px 0px rgba(0,0,0,0.05)'
                }}>
                    <Search size={18} color="var(--text-muted)" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search builds..."
                        style={{
                            border: 'none', outline: 'none', flex: 1, fontSize: '1rem',
                            fontFamily: 'Fredoka, sans-serif', fontWeight: '600', background: 'transparent'
                        }}
                    />
                </div>

                {/* Sort Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {sortOptions.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => setSort(opt.value)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.4rem',
                                padding: '0.5rem 1rem', borderRadius: '10px',
                                border: sort === opt.value ? '3px solid var(--brick-black)' : '3px solid var(--brick-grey)',
                                background: sort === opt.value ? 'var(--brick-yellow)' : 'white',
                                fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer',
                                fontFamily: 'Fredoka, sans-serif',
                                boxShadow: sort === opt.value ? '3px 3px 0px rgba(0,0,0,0.15)' : 'none',
                                transition: 'all 0.15s ease',
                                color: sort === opt.value ? 'var(--brick-black)' : 'var(--text-muted)'
                            }}
                        >
                            {opt.icon} {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results count */}
            <div style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                {loading ? 'Loading...' : `${builds.length} build${builds.length !== 1 ? 's' : ''} shared`}
            </div>

            {/* Builds Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <div className="loader"></div>
                    <p style={{ marginTop: '1rem', fontWeight: '700', color: 'var(--text-muted)' }}>Loading community builds...</p>
                </div>
            ) : builds.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '4rem',
                    background: 'white', borderRadius: '16px',
                    border: '3px dashed var(--brick-grey)'
                }}>
                    <Keyboard size={48} color="var(--brick-grey)" />
                    <h3 style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>No builds found</h3>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {search ? 'Try a different search term' : 'Be the first to share a build!'}
                    </p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {builds.map(build => {
                        const liked = isLikedByMe(build);
                        const likeCount = build.likes?.length || 0;
                        const creator = build.userId;

                        return (
                            <div
                                key={build._id}
                                onClick={() => navigate(`/shared/${build._id}`)}
                                style={{
                                    background: 'white',
                                    border: '3px solid var(--brick-black)',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    transition: 'transform 0.15s, box-shadow 0.15s',
                                    boxShadow: '6px 6px 0px rgba(0,0,0,0.1)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translate(-3px, -3px)';
                                    e.currentTarget.style.boxShadow = '9px 9px 0px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'none';
                                    e.currentTarget.style.boxShadow = '6px 6px 0px rgba(0,0,0,0.1)';
                                }}
                            >
                                {/* Part Images Strip */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(4, 1fr)',
                                    height: '120px',
                                    borderBottom: '3px solid var(--brick-black)',
                                    overflow: 'hidden'
                                }}>
                                    {['case', 'pcb', 'switch', 'keycap'].map(type => {
                                        const part = build.parts?.[type];
                                        return (
                                            <div key={type} style={{
                                                background: '#f5f5f5',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                borderRight: type !== 'keycap' ? '1px solid #e0e0e0' : 'none',
                                                overflow: 'hidden'
                                            }}>
                                                {part?.image ? (
                                                    <img
                                                        src={part.image}
                                                        alt={part.name}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                                                    />
                                                ) : (
                                                    <Package size={20} color="#ccc" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Card Body */}
                                <div style={{ padding: '1.2rem' }}>

                                    {/* Creator Info */}
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem'
                                    }}>
                                        {creator?.avatar ? (
                                            <img
                                                src={getImageUrl(creator.avatar)}
                                                alt=""
                                                style={{
                                                    width: '28px', height: '28px', borderRadius: '50%',
                                                    objectFit: 'cover', border: '2px solid var(--brick-grey)'
                                                }}
                                            />
                                        ) : (
                                            <div style={{
                                                width: '28px', height: '28px', borderRadius: '50%',
                                                background: '#eee', display: 'flex', alignItems: 'center',
                                                justifyContent: 'center', border: '2px solid var(--brick-grey)'
                                            }}>
                                                <User size={14} color="#999" />
                                            </div>
                                        )}
                                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                                            {creator?.username || 'Anonymous'}
                                        </span>
                                    </div>

                                    {/* Build Name + Price */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                                        <h3 style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0, lineHeight: 1.2, flex: 1 }}>
                                            {build.name}
                                        </h3>
                                        <span style={{
                                            fontSize: '1.1rem', fontWeight: '800', color: 'var(--brick-blue)',
                                            whiteSpace: 'nowrap', marginLeft: '0.5rem'
                                        }}>
                                            ${build.totalPrice?.toFixed(0)}
                                        </span>
                                    </div>

                                    {/* Parts Tags */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                                        {['case', 'pcb', 'switch', 'keycap'].map(type => {
                                            const part = build.parts?.[type];
                                            if (!part) return null;
                                            const colors = partColors[type];
                                            return (
                                                <span key={type} style={{
                                                    fontSize: '0.7rem', fontWeight: '700',
                                                    padding: '2px 8px', borderRadius: '8px',
                                                    background: colors.bg, color: colors.text || 'white',
                                                    border: `2px solid ${colors.border}`,
                                                    textTransform: 'uppercase', letterSpacing: '0.5px'
                                                }}>
                                                    {type}
                                                </span>
                                            );
                                        })}
                                    </div>

                                    {/* Parts List */}
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                        {build.parts?.case && <div style={{ marginBottom: '2px' }}>📦 {build.parts.case.name}</div>}
                                        {build.parts?.switch && <div style={{ marginBottom: '2px' }}>🔧 {build.parts.switch.name}</div>}
                                        {build.parts?.keycap && <div>🎨 {build.parts.keycap.name}</div>}
                                    </div>

                                    {/* Like Button */}
                                    <div style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        borderTop: '2px solid #f0f0f0', paddingTop: '0.8rem'
                                    }}>
                                        <button
                                            onClick={(e) => handleLike(e, build._id)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '0.4rem',
                                                background: liked ? '#fee2e2' : '#f5f5f5',
                                                border: liked ? '2px solid var(--brick-red)' : '2px solid #ddd',
                                                borderRadius: '10px', padding: '0.4rem 1rem',
                                                cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem',
                                                fontFamily: 'Fredoka, sans-serif',
                                                color: liked ? 'var(--brick-red)' : '#888',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <Heart size={16} fill={liked ? 'var(--brick-red)' : 'none'} />
                                            {likeCount}
                                        </button>
                                        <span style={{ fontSize: '0.8rem', color: '#bbb', fontWeight: '600' }}>
                                            {new Date(build.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CommunityShowcase;
