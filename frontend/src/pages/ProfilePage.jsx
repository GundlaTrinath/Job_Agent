import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, Mail, MapPin, Briefcase, DollarSign, Save, Plus, X, Edit2 } from 'lucide-react';
import Skeleton from '../components/Skeleton';

const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        role: '',
        location: '',
        salary_min: '',
        salary_max: '',
        skills: [],
        preferences: {}
    });
    const [loading, setLoading] = useState(true);
    const [newSkill, setNewSkill] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('${API_BASE_URL}/api/profile');
                if (res.data && res.data.name) {
                    setProfile(res.data);
                }
            } catch (e) {
                console.error("Failed to fetch profile", e);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        try {
            await axios.put('${API_BASE_URL}/api/profile', profile);
            setIsEditing(false);
        } catch (e) {
            console.error("Failed to save profile", e);
            alert("Failed to save profile.");
        }
    };

    const addSkill = (e) => {
        if (e.key === 'Enter' && newSkill.trim()) {
            if (!profile.skills.includes(newSkill.trim())) {
                setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] });
            }
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setProfile({
            ...profile,
            skills: profile.skills.filter(skill => skill !== skillToRemove)
        });
    };

    if (loading) {
        return (
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2.5rem' }}>
                    <Skeleton width="40%" height="3rem" style={{ marginBottom: '0.5rem' }} />
                    <Skeleton width="60%" height="1.1rem" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <Skeleton width="50%" height="1.5rem" style={{ marginBottom: '1.5rem' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <Skeleton width="80px" height="80px" style={{ borderRadius: '50%' }} />
                                <div style={{ width: '100%' }}>
                                    <Skeleton width="60%" height="1.5rem" style={{ marginBottom: '0.5rem' }} />
                                    <Skeleton width="40%" height="1rem" />
                                </div>
                            </div>
                            <Skeleton width="100%" height="3rem" />
                            <Skeleton width="100%" height="3rem" />
                        </div>
                    </div>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <Skeleton width="50%" height="1.5rem" style={{ marginBottom: '1.5rem' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <Skeleton width="100%" height="3rem" />
                            <Skeleton width="100%" height="5rem" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <div>
                    <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                        My Profile
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                        Manage your personal information and job preferences
                    </p>
                </div>
                <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Personal Info Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-panel"
                    style={{ padding: '2rem' }}
                >
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <User className="text-primary" size={24} />
                        Personal Info
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'var(--primary-gradient)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem',
                                color: 'white',
                                fontWeight: 'bold'
                            }}>
                                {profile.name ? profile.name.charAt(0) : 'U'}
                            </div>
                            <div style={{ width: '100%' }}>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        style={{
                                            fontSize: '1.2rem',
                                            fontWeight: 'bold',
                                            padding: '0.5rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border)',
                                            background: 'var(--background)',
                                            color: 'var(--text)',
                                            width: '100%',
                                            marginBottom: '0.5rem'
                                        }}
                                    />
                                ) : (
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{profile.name}</h3>
                                )}

                                {isEditing ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Mail size={14} className="text-muted" />
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            style={{
                                                fontSize: '0.9rem',
                                                padding: '0.4rem',
                                                borderRadius: '6px',
                                                border: '1px solid var(--border)',
                                                background: 'var(--background)',
                                                color: 'var(--text)',
                                                width: '100%'
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                        <Mail size={14} /> {profile.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Current Role</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profile.role}
                                        onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border)',
                                            background: 'var(--background)',
                                            color: 'var(--text)'
                                        }}
                                    />
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                                        <Briefcase size={18} className="text-primary" />
                                        {profile.role}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Location</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profile.location}
                                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border)',
                                            background: 'var(--background)',
                                            color: 'var(--text)'
                                        }}
                                    />
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                                        <MapPin size={18} className="text-primary" />
                                        {profile.location}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Job Preferences Card */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-panel"
                    style={{ padding: '2rem' }}
                >
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Briefcase className="text-primary" size={24} />
                        Job Preferences
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Salary Range</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ flex: 1, position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>₹</span>
                                    <input
                                        type="text"
                                        value={profile.salary_min.replace('$', '').replace('₹', '')}
                                        disabled={!isEditing}
                                        onChange={(e) => setProfile({ ...profile, salary_min: '₹' + e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 0.75rem 0.75rem 2rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border)',
                                            background: isEditing ? 'var(--background)' : 'transparent',
                                            color: 'var(--text)',
                                            opacity: isEditing ? 1 : 0.8
                                        }}
                                    />
                                </div>
                                <span style={{ color: 'var(--text-muted)' }}>-</span>
                                <div style={{ flex: 1, position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>₹</span>
                                    <input
                                        type="text"
                                        value={profile.salary_max.replace('$', '').replace('₹', '')}
                                        disabled={!isEditing}
                                        onChange={(e) => setProfile({ ...profile, salary_max: '₹' + e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 0.75rem 0.75rem 2rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border)',
                                            background: isEditing ? 'var(--background)' : 'transparent',
                                            color: 'var(--text)',
                                            opacity: isEditing ? 1 : 0.8
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Skills</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: isEditing ? '1rem' : 0 }}>
                                {profile.skills.map((skill, index) => (
                                    <span key={index} style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '20px',
                                        background: 'var(--surface-strong)',
                                        border: '1px solid var(--border)',
                                        fontSize: '0.9rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        color: 'var(--text)'
                                    }}>
                                        {skill}
                                        {isEditing && (
                                            <X
                                                size={14}
                                                style={{ cursor: 'pointer', color: 'var(--text-muted)' }}
                                                onClick={() => removeSkill(skill)}
                                            />
                                        )}
                                    </span>
                                ))}
                            </div>
                            {isEditing && (
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        onKeyDown={addSkill}
                                        placeholder="Type a skill and press Enter..."
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 2.5rem 0.75rem 1rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border)',
                                            background: 'var(--background)',
                                            color: 'var(--text)'
                                        }}
                                    />
                                    <Plus size={18} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;


