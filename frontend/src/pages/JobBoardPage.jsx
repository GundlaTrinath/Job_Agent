import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MapPin, DollarSign, Building, Calendar, CheckCircle2, MessageSquare, ExternalLink } from 'lucide-react';
import Skeleton from '../components/Skeleton';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

const JobBoardPage = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/jobs`);
                setJobs(res.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const handleApply = async (job) => {
        // If it's a web job with an external link, open it in new tab
        if (job.application_details && job.application_details.link) {
            window.open(job.application_details.link, '_blank', 'noopener,noreferrer');

            // Mark as viewed
            try {
                await axios.post(`${API_BASE_URL}/api/jobs/${job.id}/apply`);
                setJobs(prev => prev.map(j => j.id === job.id ? {
                    ...j,
                    status: 'Applied'
                } : j));
            } catch (e) {
                console.error(e);
            }
            return;
        }

        // Regular job application
        try {
            await axios.post(`${API_BASE_URL}/api/jobs/${job.id}/apply`);
            setJobs(prev => prev.map(j => j.id === job.id ? {
                ...j,
                status: 'Applied',
                application_details: {
                    applied_date: new Date().toISOString(),
                    status: 'Applied',
                    notes: ''
                }
            } : j));
        } catch (e) {
            console.error(e);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    if (loading) {
        return (
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2.5rem' }}>
                    <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                        Smart Job Board
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                        AI-curated opportunities matched to your profile and skills.
                    </p>
                </div>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <Skeleton width="100%" height="150px" />
                    <Skeleton width="100%" height="150px" />
                    <Skeleton width="100%" height="150px" />
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '2.5rem' }}
            >
                <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                    Smart Job Board
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                    AI-curated opportunities matched to your profile and skills.
                </p>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ display: 'grid', gap: '1.5rem' }}
            >
                {jobs.length > 0 ? (
                    jobs.map(job => {
                        const isExternalJob = job.application_details && job.application_details.link;

                        return (
                            <motion.div
                                key={job.id}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                className="glass-panel"
                                style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem' }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text)', marginBottom: '0.25rem' }}>
                                                {job.title}
                                            </h2>
                                            {isExternalJob && (
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem',
                                                    padding: '0.25rem 0.5rem',
                                                    background: 'rgba(59, 130, 246, 0.1)',
                                                    color: '#3b82f6',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600'
                                                }}>
                                                    <ExternalLink size={12} /> External Link
                                                </span>
                                            )}
                                        </div>
                                        {job.status === 'Applied' && (
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                background: 'rgba(16, 185, 129, 0.2)',
                                                color: '#10b981',
                                                fontSize: '0.85rem',
                                                fontWeight: '600',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.25rem',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                <CheckCircle2 size={14} /> Applied
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '1rem' }}>
                                        <Building size={16} /> {job.company}
                                        <span>•</span>
                                        <MapPin size={16} /> {job.location}
                                    </div>

                                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                                        {job.description}
                                    </p>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {job.requirements.map((req, i) => (
                                            <span key={i} style={{
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '6px',
                                                background: 'var(--surface)',
                                                border: '1px solid var(--border)',
                                                fontSize: '0.85rem',
                                                color: 'var(--text-muted)'
                                            }}>
                                                {req}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem', minWidth: '150px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '1.1rem', fontWeight: '600', color: 'var(--text)' }}>
                                        <DollarSign size={18} className="text-primary" />
                                        {job.salary_range}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                        <Calendar size={14} /> Posted recently
                                    </div>

                                    {job.status !== 'Applied' ? (
                                        <button
                                            onClick={() => handleApply(job)}
                                            className="btn-primary"
                                            style={{ marginTop: '1rem', width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
                                        >
                                            {isExternalJob ? (
                                                <>Apply Now <ExternalLink size={16} /></>
                                            ) : 'Easy Apply'}
                                        </button>
                                    ) : (
                                        <button
                                            disabled
                                            className="btn-secondary"
                                            style={{ marginTop: '1rem', width: '100%', opacity: 0.7, cursor: 'not-allowed' }}
                                        >
                                            Applied
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }} className="glass-panel">
                        <MessageSquare size={64} style={{ margin: '0 auto 1.5rem', opacity: 0.5 }} />
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No jobs yet</h3>
                        <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
                            Ask the AI Chat to find jobs for you!
                        </p>
                        <button
                            onClick={() => navigate('/chat')}
                            className="btn-primary"
                            style={{ padding: '1rem 2rem', fontSize: '1rem' }}
                        >
                            <MessageSquare size={20} style={{ marginRight: '0.5rem' }} />
                            Start Chat
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default JobBoardPage;

