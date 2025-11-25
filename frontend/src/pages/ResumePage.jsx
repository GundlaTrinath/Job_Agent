import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, AlertCircle, Upload, X, File } from 'lucide-react';

const ResumePage = () => {
    const [data, setData] = useState(null);
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/resume');
                setData(res.data);
            } catch (e) {
                console.error(e);
                // Mock data if backend fails
                setData({
                    score: 0,
                    feedback: []
                });
            }
        };
        fetchData();
    }, []);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
            setFile(droppedFile);
            handleUpload(droppedFile);
        } else {
            alert('Please upload a PDF or DOCX file.');
        }
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            handleUpload(selectedFile);
        }
    };

    const handleUpload = async (uploadedFile) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', uploadedFile);

        try {
            const res = await axios.post('http://localhost:8000/api/resume/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setData(res.data);
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to analyze resume. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const removeFile = () => {
        setFile(null);
        setData({ score: 0, feedback: [] });
    };

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '2.5rem' }}
            >
                <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                    Resume Studio
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                    Upload your resume to get AI-powered insights and improvements
                </p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>

                {/* Upload Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-panel"
                    style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                >
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Upload className="text-primary" size={24} />
                        Upload Resume
                    </h2>

                    {!file ? (
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            style={{
                                border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border)'}`,
                                borderRadius: '16px',
                                padding: '3rem 2rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                backgroundColor: isDragging ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1rem'
                            }}
                            onClick={() => document.getElementById('fileInput').click()}
                        >
                            <input
                                type="file"
                                id="fileInput"
                                style={{ display: 'none' }}
                                accept=".pdf,.docx"
                                onChange={handleFileSelect}
                            />
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                background: 'var(--surface-strong)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--primary)'
                            }}>
                                <Upload size={32} />
                            </div>
                            <div>
                                <p style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                    Click to upload or drag and drop
                                </p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    PDF or DOCX (max. 5MB)
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            padding: '1.5rem',
                            borderRadius: '12px',
                            background: 'var(--surface-strong)',
                            border: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '10px',
                                    background: 'rgba(239, 68, 68, 0.1)', // Red tint for PDF icon feel
                                    color: '#ef4444',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{file.name}</p>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={removeFile}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    padding: '0.5rem',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                className="hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    )}

                    {uploading && (
                        <div style={{ textAlign: 'center', padding: '1rem' }}>
                            <div className="pulse" style={{ color: 'var(--primary)', fontWeight: '600' }}>
                                Analyzing resume...
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Results Section */}
                {data && data.score > 0 && !uploading && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
                    >
                        {/* Score Card */}
                        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>ATS Score</h2>
                            <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 1.5rem' }}>
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
                                        stroke={data.score > 70 ? '#10b981' : '#ef4444'}
                                        strokeWidth="3"
                                        strokeDasharray={`${data.score}, 100`}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                }}>
                                    <span style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: '1' }}>{data.score}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>/ 100</span>
                                </div>
                            </div>
                            <p style={{ color: 'var(--text-muted)' }}>
                                {data.score > 70 ? 'Your resume is optimized!' : 'Needs some improvements.'}
                            </p>
                        </div>

                        {/* Feedback List */}
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.5rem' }}>AI Feedback</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {data.feedback.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        <div style={{ color: 'var(--primary)', marginTop: '2px' }}>
                                            <AlertCircle size={20} />
                                        </div>
                                        <p style={{ margin: 0, lineHeight: '1.6', fontSize: '0.95rem' }}>{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ResumePage;
