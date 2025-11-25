import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, XCircle, Award, ArrowLeft, ChevronRight } from 'lucide-react';
import Skeleton from '../components/Skeleton';

const TestPage = () => {
    const { testId } = useParams();
    const navigate = useNavigate();

    const [test, setTest] = useState(null);
    const [answers, setAnswers] = useState({});
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [startTime] = useState(Date.now());

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/tests/${testId}`);
                setTest(res.data);
            } catch (e) {
                console.error('Failed to fetch test:', e);
                alert('Test not found');
                navigate('/learning');
            } finally {
                setLoading(false);
            }
        };
        fetchTest();
    }, [testId, navigate]);

    const handleAnswer = (questionId, answer) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleSubmit = async () => {
        const timeTaken = Math.floor((Date.now() - startTime) / 1000); // seconds

        try {
            const res = await axios.post(`http://localhost:8000/api/tests/${testId}/submit`, {
                answers,
                time_taken: timeTaken
            });
            setResults(res.data);
            setShowResults(true);
        } catch (e) {
            console.error('Failed to submit test:', e);
            alert('Failed to submit test. Please try again.');
        }
    };

    const getAnsweredCount = () => {
        return Object.keys(answers).length;
    };

    const isQuestionAnswered = (questionId) => {
        return answers.hasOwnProperty(questionId);
    };

    if (loading) {
        return (
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <Skeleton width="100%" height="400px" />
            </div>
        );
    }

    if (!test) {
        return null;
    }

    if (showResults && results) {
        const percentage = results.percentage;
        const passed = percentage >= 60;

        return (
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <button
                    onClick={() => navigate('/learning')}
                    className="btn-secondary"
                    style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <ArrowLeft size={18} /> Back to Learning Hub
                </button>

                {/* Results Header */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-panel"
                    style={{
                        padding: '3rem',
                        textAlign: 'center',
                        marginBottom: '2rem',
                        background: passed ?
                            'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)' :
                            'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)'
                    }}
                >
                    {passed ? <CheckCircle2 size={64} style={{ color: '#10b981', margin: '0 auto 1rem' }} /> :
                        <XCircle size={64} style={{ color: '#ef4444', margin: '0 auto 1rem' }} />}

                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                        Test {passed ? 'Passed!' : 'Completed'}
                    </h2>

                    <div style={{ fontSize: '4rem', fontWeight: '800', marginBottom: '1rem' }}>
                        <span style={{
                            background: passed ?
                                'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
                                'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            {percentage}%
                        </span>
                    </div>

                    <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        {results.score} out of {results.total} questions correct
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Clock size={20} className="text-primary" />
                            <span>{results.time_taken_seconds ? Math.floor(results.time_taken_seconds / 60) : 0} min {results.time_taken_seconds ? results.time_taken_seconds % 60 : 0} sec</span>
                        </div>
                        <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Award size={20} style={{ color: '#f59e0b' }} />
                            <span>Score: {results.score}/{results.total}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Detailed Feedback */}
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: '700' }}>
                    Detailed Feedback
                </h3>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {results.feedback.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-panel"
                            style={{
                                padding: '2rem',
                                borderLeft: `4px solid ${item.is_correct ? '#10b981' : '#ef4444'}`
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                                {item.is_correct ?
                                    <CheckCircle2 size={24} style={{ color: '#10b981', flexShrink: 0 }} /> :
                                    <XCircle size={24} style={{ color: '#ef4444', flexShrink: 0 }} />
                                }
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '600', marginBottom: '0.5rem', fontSize: '1.05rem' }}>
                                        Question {i + 1}
                                    </div>
                                    <div style={{ color: 'var(--text)', marginBottom: '1rem' }}>
                                        {item.question}
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginLeft: '2.5rem' }}>
                                <div style={{ marginBottom: '0.75rem' }}>
                                    <span style={{ fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        Your Answer:
                                    </span>
                                    <span style={{
                                        marginLeft: '0.5rem',
                                        color: item.is_correct ? '#10b981' : '#ef4444',
                                        fontWeight: '600'
                                    }}>
                                        {item.user_answer || 'Not answered'}
                                    </span>
                                </div>

                                {!item.is_correct && (
                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <span style={{ fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            Correct Answer:
                                        </span>
                                        <span style={{ marginLeft: '0.5rem', color: '#10b981', fontWeight: '600' }}>
                                            {item.correct_answer}
                                        </span>
                                    </div>
                                )}

                                {item.explanation && (
                                    <div style={{
                                        marginTop: '1rem',
                                        padding: '1rem',
                                        background: 'var(--surface)',
                                        borderRadius: '8px',
                                        fontSize: '0.95rem',
                                        color: 'var(--text-muted)',
                                        lineHeight: '1.6'
                                    }}>
                                        <strong style={{ color: 'var(--text)' }}>Explanation:</strong> {item.explanation}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn-secondary"
                        style={{ padding: '1rem 2rem' }}
                    >
                        Retake Test
                    </button>
                    <button
                        onClick={() => navigate('/learning')}
                        className="btn-primary"
                        style={{ padding: '1rem 2rem' }}
                    >
                        Back to Learning Hub
                    </button>
                </div>
            </div>
        );
    }

    const questions = test.questions || [];
    const currentQ = questions[currentQuestion];

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <button
                onClick={() => navigate('/learning')}
                className="btn-secondary"
                style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
                <ArrowLeft size={18} /> Back to Learning Hub
            </button>

            {/* Progress Header */}
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>
                        {test.skill_name} Assessment
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: '600' }}>
                        <Clock className="text-primary" size={20} />
                        {Math.floor((Date.now() - startTime) / 60000)} min
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    {questions.map((q, i) => (
                        <div
                            key={i}
                            style={{
                                flex: 1,
                                height: '6px',
                                borderRadius: '3px',
                                background: isQuestionAnswered(q.id) ? 'var(--primary)' :
                                    i === currentQuestion ? 'rgba(124, 58, 237, 0.3)' : 'var(--surface)',
                                transition: 'all 0.3s'
                            }}
                        />
                    ))}
                </div>

                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Question {currentQuestion + 1} of {questions.length} • {getAnsweredCount()} answered
                </div>
            </div>

            {/* Question Card */}
            <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-panel"
                style={{ padding: '3rem', marginBottom: '2rem' }}
            >
                <div style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '2rem', lineHeight: '1.6' }}>
                    {currentQ.question}
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    {currentQ.options.map((option, i) => {
                        const questionId = currentQ.id;
                        const isSelected = answers[questionId] === option;

                        return (
                            <label
                                key={i}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1.25rem',
                                    borderRadius: '12px',
                                    border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                                    background: isSelected ? 'rgba(124, 58, 237, 0.1)' : 'var(--surface)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontSize: '1.05rem'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.borderColor = 'var(--primary)';
                                        e.currentTarget.style.background = 'rgba(124, 58, 237, 0.05)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.borderColor = 'var(--border)';
                                        e.currentTarget.style.background = 'var(--surface)';
                                    }
                                }}
                            >
                                <input
                                    type="radio"
                                    name={`q-${questionId}`}
                                    value={option}
                                    checked={isSelected}
                                    onChange={() => handleAnswer(questionId, option)}
                                    style={{ accentColor: 'var(--primary)', width: '20px', height: '20px' }}
                                />
                                <span>{option}</span>
                            </label>
                        );
                    })}
                </div>
            </motion.div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <button
                    onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestion === 0}
                    className="btn-secondary"
                    style={{ padding: '1rem 2rem', opacity: currentQuestion === 0 ? 0.5 : 1 }}
                >
                    Previous
                </button>

                {currentQuestion < questions.length - 1 ? (
                    <button
                        onClick={() => setCurrentQuestion(prev => prev + 1)}
                        className="btn-primary"
                        style={{ padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        Next <ChevronRight size={18} />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={getAnsweredCount() < questions.length}
                        className="btn-primary"
                        style={{
                            padding: '1rem 2rem',
                            opacity: getAnsweredCount() < questions.length ? 0.5 : 1,
                            cursor: getAnsweredCount() < questions.length ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Submit Test
                    </button>
                )}
            </div>

            {getAnsweredCount() < questions.length && currentQuestion === questions.length - 1 && (
                <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: 'rgba(251, 146, 60, 0.1)',
                    border: '1px solid rgba(251, 146, 60, 0.3)',
                    borderRadius: '8px',
                    color: '#f59e0b',
                    fontSize: '0.95rem',
                    textAlign: 'center'
                }}>
                    Please answer all questions before submitting
                </div>
            )}
        </div>
    );
};

export default TestPage;
