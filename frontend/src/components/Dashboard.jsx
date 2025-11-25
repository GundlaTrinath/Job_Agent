import React from 'react';
import { motion } from 'framer-motion';

const Dashboard = ({ data }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Jobs Section */}
            {data.jobs && data.jobs.length > 0 && (
                <section>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Recommended Jobs</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                        {data.jobs.map((job, i) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-panel"
                                style={{
                                    padding: '1.5rem',
                                    backgroundColor: 'var(--surface)',
                                    border: '1px solid var(--border)'
                                }}
                            >
                                <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{job.title}</h4>
                                <div style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>{job.company}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{job.location} • {job.salary_range}</div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: '1.5', marginBottom: '1rem' }}>{job.description}</p>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {job.requirements.map((req, j) => (
                                        <span key={j} style={{
                                            fontSize: '0.7rem',
                                            padding: '0.25rem 0.75rem',
                                            backgroundColor: 'var(--background)',
                                            borderRadius: '2rem',
                                            border: '1px solid var(--border)',
                                            color: 'var(--text-muted)'
                                        }}>
                                            {req}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills Section */}
            {data.skills && (
                <section>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Skill Analysis</h3>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-panel"
                        style={{
                            padding: '2rem',
                            backgroundColor: 'var(--surface)'
                        }}
                    >
                        {data.skills.missing_skills.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                                <h3>You're all set!</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Your skills match the requirements perfectly.</p>
                            </div>
                        ) : (
                            <div>
                                <h4 style={{ marginBottom: '1.5rem' }}>Recommended Learning Path</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {data.skills.recommendations.map((rec, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '1rem',
                                                backgroundColor: 'var(--background)',
                                                borderRadius: '0.75rem',
                                                border: '1px solid var(--border)'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%',
                                                    backgroundColor: 'var(--primary)',
                                                    color: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600' }}>{rec.skill}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{rec.type}</div>
                                                </div>
                                            </div>
                                            <a
                                                href={rec.resource}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    color: 'var(--primary)',
                                                    textDecoration: 'none',
                                                    fontWeight: '500',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                Start Learning →
                                            </a>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </section>
            )}

            {/* Resume Review Section */}
            {data.resume && (
                <section>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Resume Audit</h3>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-panel"
                        style={{
                            padding: '2rem',
                            backgroundColor: 'var(--surface)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
                            <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="var(--border)"
                                        strokeWidth="3"
                                    />
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke={data.resume.score > 70 ? '#10b981' : '#ef4444'}
                                        strokeWidth="3"
                                        strokeDasharray={`${data.resume.score}, 100`}
                                    />
                                </svg>
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold'
                                }}>
                                    {data.resume.score}
                                </div>
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '1.2rem' }}>Resume Score</h4>
                                <p style={{ margin: '0.5rem 0 0', color: 'var(--text-muted)' }}>Based on industry standards</p>
                            </div>
                        </div>

                        <h4 style={{ marginBottom: '1rem' }}>Actionable Feedback</h4>
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                            {data.resume.feedback.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    style={{
                                        padding: '1rem',
                                        backgroundColor: 'var(--background)',
                                        borderRadius: '0.5rem',
                                        borderLeft: '4px solid var(--primary)',
                                        fontSize: '0.95rem',
                                        lineHeight: '1.5'
                                    }}
                                >
                                    {item}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </section>
            )}
        </div>
    );
};

export default Dashboard;
