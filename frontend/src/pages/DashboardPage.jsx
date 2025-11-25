import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Briefcase, TrendingUp, Award, FileText, ArrowRight, UserPlus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Skeleton from '../components/Skeleton';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        total_jobs: 0,
        jobs_applied: 0,
        active_learning_paths: 0,
        resume_score: 0,
        recent_activity: [],
        application_history: []
    });
    const [user, setUser] = useState({ name: 'User' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, profileRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/dashboard`),
                    axios.get(`${API_BASE_URL}/api/profile`)
                ]);
                setStats(statsRes.data);
                setUser(profileRes.data);
            } catch (e) {
                console.error("Failed to fetch dashboard data", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                        Welcome back, {loading ? '...' : user.name.split(' ')[0]}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                        Here's what's happening with your job search today.
                    </p>
                </div>
                {!loading && user.name === 'Alex Johnson' && (
                    <button
                        onClick={() => navigate('/profile')}
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--accent)', border: 'none' }}
                    >
                        <UserPlus size={18} /> Create Your Profile
                    </button>
                )}
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2.5rem'
            }}>
                <StatCard
                    icon={<Briefcase size={24} />}
                    label="Jobs Found"
                    value={stats.total_jobs}
                    color="#3b82f6"
                    loading={loading}
                />
                <StatCard
                    icon={<TrendingUp size={24} />}
                    label="Applications"
                    value={stats.jobs_applied}
                    color="#10b981"
                    loading={loading}
                />
                <StatCard
                    icon={<Award size={24} />}
                    label="Skills Learning"
                    value={stats.active_learning_paths}
                    color="#8b5cf6"
                    loading={loading}
                />
                <StatCard
                    icon={<FileText size={24} />}
                    label="Resume Score"
                    value={stats.resume_score}
                    color="#f59e0b"
                    loading={loading}
                />
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '2rem'
            }}>
                {/* Activity Chart */}
                <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>
                        Application Activity
                    </h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        {loading ? (
                            <Skeleton width="100%" height="100%" />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stats.application_history || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="var(--text-muted)"
                                        tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        stroke="var(--text-muted)"
                                        tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                                        axisLine={false}
                                        tickLine={false}
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--surface)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '8px',
                                            color: 'var(--text)'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="jobs"
                                        stroke="url(#colorGradient)"
                                        strokeWidth={3}
                                        dot={{ fill: 'var(--primary)', strokeWidth: 2 }}
                                        activeDot={{ r: 6, fill: 'var(--primary)' }}
                                    />
                                    <defs>
                                        <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#3b82f6" />
                                            <stop offset="100%" stopColor="#8b5cf6" />
                                        </linearGradient>
                                    </defs>
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>
                        Recent Activity
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {loading ? (
                            <>
                                <Skeleton width="100%" height="60px" />
                                <Skeleton width="100%" height="60px" />
                                <Skeleton width="100%" height="60px" />
                            </>
                        ) : stats.recent_activity && stats.recent_activity.length > 0 ? (
                            stats.recent_activity.map((activity, i) => (
                                <div key={i} style={{
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    background: 'var(--surface-strong)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem'
                                }}>
                                    <div style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: 'var(--primary)'
                                    }} />
                                    <span style={{ fontSize: '0.95rem', color: 'var(--text)' }}>
                                        {activity}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                <p>No recent activity.</p>
                                <button
                                    onClick={() => navigate('/jobs')}
                                    className="btn-secondary"
                                    style={{ marginTop: '1rem', fontSize: '0.9rem' }}
                                >
                                    Find Jobs
                                </button>
                            </div>
                        )}
                    </div>
                    {stats.recent_activity && stats.recent_activity.length > 0 && (
                        <button className="btn-primary" style={{ marginTop: '1.5rem', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                            View All Activity <ArrowRight size={16} />
                        </button>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};

const StatCard = ({ icon, label, value, color, loading }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
        }}
        className="glass-panel"
        style={{ padding: '1.5rem' }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{
                padding: '0.75rem',
                borderRadius: '12px',
                background: `${color}20`,
                color: color
            }}>
                {icon}
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>
                {label}
            </span>
        </div>
        {loading ? (
            <Skeleton width="60%" height="3rem" />
        ) : (
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text)' }}>
                {value}
            </div>
        )}
    </motion.div>
);

export default DashboardPage;


