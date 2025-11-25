import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Star, Zap, Shield, MessageSquare, Briefcase, FileText, GraduationCap, Lightbulb, CheckCircle2 } from 'lucide-react';

const Guide = () => {
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
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            style={{ maxWidth: '1000px', margin: '0 auto' }}
        >
            {/* Header */}
            <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '1rem', lineHeight: '1.2' }}>
                    How to Use Job Agent
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                    Your complete guide to mastering our AI-powered career tools and landing your dream job.
                </p>
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                {/* Getting Started Section */}
                <motion.section variants={itemVariants} className="glass-panel" style={{ padding: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            padding: '0.75rem',
                            borderRadius: '12px',
                            background: 'var(--primary-gradient)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px var(--shadow-color)'
                        }}>
                            <Zap size={24} />
                        </div>
                        Getting Started
                    </h2>
                    <div style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.7' }}>
                        <p style={{ marginBottom: '1.5rem' }}>
                            Welcome to Job Agent! Our platform is designed to streamline your job search using advanced AI.
                            Here's how to get up and running in minutes:
                        </p>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {[
                                { title: 'Create your Profile', desc: 'Upload your resume to let our AI understand your skills.' },
                                { title: 'Set Preferences', desc: 'Tell us what kind of roles you\'re looking for.' },
                                { title: 'Start Exploring', desc: 'Use the dashboard to track your progress.' }
                            ].map((step, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '1rem',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    background: 'var(--surface-strong)',
                                    border: '1px solid var(--border)'
                                }}>
                                    <div style={{
                                        background: 'var(--primary)',
                                        color: 'white',
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                        marginTop: '0.2rem'
                                    }}>
                                        {i + 1}
                                    </div>
                                    <div>
                                        <strong style={{ color: 'var(--text)', display: 'block', marginBottom: '0.25rem' }}>{step.title}</strong>
                                        <span style={{ fontSize: '0.95rem' }}>{step.desc}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Features Overview */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '2rem' }}>
                    {[
                        {
                            icon: <MessageSquare size={24} />,
                            title: 'AI Chat Assistant',
                            desc: 'Interact with our intelligent agent to get career advice, interview prep, and instant answers.',
                            features: ['Resume feedback', 'Interview practice', 'Salary tips'],
                            color: '#6366F1'
                        },
                        {
                            icon: <Briefcase size={24} />,
                            title: 'Smart Job Board',
                            desc: 'A curated list of opportunities matched to your profile. Our AI analyzes thousands of listings.',
                            features: ['Match scores', 'One-click apply', 'Status tracking'],
                            color: '#14B8A6'
                        },
                        {
                            icon: <FileText size={24} />,
                            title: 'Resume Builder',
                            desc: 'Create ATS-friendly resumes in minutes. Choose from professional templates.',
                            features: ['Auto-formatting', 'Keyword optimization', 'PDF export'],
                            color: '#F59E0B'
                        },
                        {
                            icon: <GraduationCap size={24} />,
                            title: 'Learning Hub',
                            desc: 'Upskill with recommended courses and resources tailored to your career goals.',
                            features: ['Skill gap analysis', 'Course recommendations', 'Progress tracking'],
                            color: '#EC4899'
                        }
                    ].map((feature, i) => (
                        <motion.section
                            key={i}
                            variants={itemVariants}
                            className="glass-panel"
                            style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}
                        >
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '12px',
                                background: `${feature.color}20`,
                                color: feature.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.5rem'
                            }}>
                                {feature.icon}
                            </div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem' }}>{feature.title}</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6', flex: 1 }}>
                                {feature.desc}
                            </p>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {feature.features.map((item, j) => (
                                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                        <CheckCircle2 size={16} style={{ color: feature.color }} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.section>
                    ))}
                </div>

                {/* Pro Tips */}
                <motion.section
                    variants={itemVariants}
                    style={{
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                        borderRadius: '24px',
                        padding: '3rem',
                        border: '1px solid var(--border)'
                    }}
                >
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Lightbulb size={28} style={{ color: '#F59E0B' }} />
                        Pro Tips for Success
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                        {[
                            { title: 'Be Specific', desc: 'The more details you provide to the AI Chat, the better the advice you\'ll receive.' },
                            { title: 'Update Regularly', desc: 'Keep your profile and resume updated to ensure the best job matches.' },
                            { title: 'Use Keywords', desc: 'Tailor your resume with keywords from job descriptions to pass ATS filters.' }
                        ].map((tip, i) => (
                            <div key={i}>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--primary)' }}>{tip.title}</h4>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{tip.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.section>
            </div>
        </motion.div>
    );
};

export default Guide;
