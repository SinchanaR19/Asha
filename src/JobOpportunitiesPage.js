import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'https://asha-ai-bot-backend.herokuapp.com'; // Adjust if needed

const JobOpportunitiesPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchJobs = async () => {
        setLoading(true);
        setError(null); // Reset error state
        try {
            console.log('Fetching from:', `${API_URL}/knowledgebase/job-opportunities/`);
            const response = await fetch(`${API_URL}/knowledgebase/job-opportunities/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch job opportunities: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Fetched jobs:', data);
            setJobs(data);
            if (data.length === 0) {
                setError('No job opportunities available at the moment.');
            }
        } catch (error) {
            console.error('Error fetching job opportunities:', error);
            setError('Failed to load job opportunities. Please try again or contact support@asha.ai.');
            toast.error('Failed to load job opportunities. Please try again or contact support@asha.ai.');
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    console.log('Current jobs state:', jobs);

    return (
        <div className="job-opportunities-page">
            <ToastContainer />
            <h2>Job Opportunities</h2>
            {loading ? (
                <p style={{ textAlign: 'center', padding: '20px' }}>Loading...</p>
            ) : error ? (
                <p style={{ minHeight: '100px', textAlign: 'center', color: '#666' }}>{error}</p>
            ) : jobs.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {jobs.map((job) => (
                        <li key={job.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
                            <h3>{job.title}</h3>
                            <p><strong>Company:</strong> {job.company}</p>
                            <p><strong>Location:</strong> {job.location}</p>
                            <p><strong>Description:</strong> {job.description}</p>
                            <p><strong>Posted:</strong> {new Date(job.posted_at).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p style={{ minHeight: '100px', textAlign: 'center', color: '#666' }}>
                    No job opportunities found.
                </p>
            )}
        </div>
    );
};

export default JobOpportunitiesPage;