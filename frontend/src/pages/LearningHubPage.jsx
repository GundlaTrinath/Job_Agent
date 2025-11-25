import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BookOpen, Video, Code, TrendingUp, CheckCircle2, Award, Clock, Target, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Skeleton from '../components/Skeleton';

const LearningHubPage = () => {
    const navigate = useNavigate();
    const [learningPaths, setLearningPaths] = useState([]);
    const [skillTests, setSkillTests] = useState([]);
    const [testResults, setTestResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch learning paths
                const pathsRes = await axios.get('${API_BASE_URL}/api/learning/all');
                setLearningPaths(pathsRes.data || []);

                // Fetch available skill tests
                const testsRes = await axios.get('${API_BASE_URL}/api/tests');
                setSkillTests(testsRes.data || []);

                // Fetch test history
                const resultsRes = await axios.get('${API_BASE_URL}/api/tests/results');
                setTestResults(resultsRes.data || []);
            } catch (e) {
                console.error('Failed to fetch learning data:', e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getTestStatus = (testId) => {
        const results = testResults.filter(r => r.test_id === testId);
        if (results.length === 0) return null;

        const latest = results[0]; // Already sorted by taken_at DESC
        return {
            taken: true,
            score: latest.score,
            total: latest.total_questions,
            percentage: latest.percentage,
            date: new Date(latest.taken_at).toLocaleDateString()
        };
    };

    const allRecommendations = learningPaths.flatMap(path => path.data?.recommendations || []);

    if (loading) {
        return (
            <div>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
                    Learning Hub
                </h1>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <Skeleton width="100%" height="200px" />
                    <Skeleton width="100%" height="200px" />
                </div>
            </div>
        );
    }

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '2.5rem' }}
            >
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                    Learning Hub
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
                    Master new skills with AI-powered learning paths and skill tests
                </p>
            </motion.div>

            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <BookOpen size={20} className="text-primary" />
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                            Learning Paths
                        </div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text)' }}>
                        {learningPaths.length}
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Target size={20} style={{ color: '#10b981' }} />
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                            Skill Tests
                        </div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text)' }}>
                        {skillTests.length}
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(249, 115, 22, 0.05) 100%)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Award size={20} style={{ color: '#f59e0b' }} />
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                            Tests Completed
                        </div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text)' }}>
                        {testResults.length}
                    </div>
                </div>
            </div>

            {/* Skill Tests Section */}
            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Target className="text-primary" size={28} />
                    Skill Tests
                </h2>

                {skillTests.length > 0 ? (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {skillTests.map((test, i) => {
                            const status = getTestStatus(test.id);
                            return (
                                <motion.div
                                    key={test.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="glass-panel card-hover"
                                    style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                                            {test.skill_name} Assessment
                                        </h3>
                                        <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Code size={16} /> {test.question_count} Questions
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Clock size={16} /> ~{test.question_count * 2} mins
                                            </span>
                                            <span style={{ textTransform: 'capitalize', fontWeight: '600', color: 'var(--primary)' }}>
                                                {test.difficulty}
                                            </span>
                                        </div>
                                        {status && (
                                            <div style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                padding: '0.5rem 1rem',
                                                background: status.percentage >= 80 ? 'rgba(16, 185, 129, 0.1)' :
                                                    status.percentage >= 60 ? 'rgba(251, 146, 60, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                color: status.percentage >= 80 ? '#10b981' :
                                                    status.percentage >= 60 ? '#f59e0b' : '#ef4444',
                                                borderRadius: '8px',
                                                fontSize: '0.9rem',
                                                fontWeight: '600'
                                            }}>
                                                <CheckCircle2 size={16} />
                                                Last Score: {status.score}/{status.total} ({status.percentage}%) - {status.date}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => navigate(`/test/${test.id}`)}
                                        className="btn-primary"
                                        style={{ padding: '1rem 2rem', fontSize: '1rem', whiteSpace: 'nowrap' }}
                                    >
                                        {status ? 'Retake Test' : 'Take Test'}
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Target size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                        <p style={{ fontSize: '1.1rem' }}>No skill tests available yet</p>
                        <p style={{ fontSize: '0.95rem' }}>Ask the AI to find jobs - tests will be auto-generated for required skills!</p>
                    </div>
                )}
            </section>

            {/* Learning Resources Section */}
            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BookOpen className="text-primary" size={28} />
                    Learning Resources
                </h2>

                {allRecommendations.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {allRecommendations.map((rec, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="glass-panel card-hover"
                                style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        flexShrink: 0
                                    }}>
                                        {rec.type === 'Documentation' ? <BookOpen size={24} /> :
                                            rec.type === 'Course' ? <Video size={24} /> : <Code size={24} />}
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>{rec.skill}</h3>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{rec.type}</div>
                                    </div>
                                </div>
                                <a
                                    href={rec.resource}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary"
                                    style={{
                                        width: '100%',
                                        marginTop: 'auto',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    Start Learning <ExternalLink size={16} />
                                </a>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <BookOpen size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                        <p style={{ fontSize: '1.1rem' }}>No learning resources yet</p>
                        <p style={{ fontSize: '0.95rem' }}>Learning paths will be created when you search for jobs via AI chat</p>
                    </div>
                )}
            </section>

            {/* Learning Paths Section */}
            {learningPaths.length > 0 && (
                <section>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <TrendingUp className="text-primary" size={28} />
                        Your Learning Journeys ({learningPaths.length})
                    </h2>
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {learningPaths.map((path, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="glass-panel"
                                style={{ padding: '2rem' }}
                            >
                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: '700', marginBottom: '0.5rem' }}>
                                        Learning Path #{i + 1}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        Created: {new Date(path.timestamp).toLocaleDateString()}
                                    </div>
                                </div>
                                <div style={{ color: 'var(--text-muted)' }}>
                                    <p>{path.data?.message || 'Custom learning path created for your career goals'}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default LearningHubPage;

