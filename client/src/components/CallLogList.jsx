import React, { useState, useEffect } from 'react';
import { fetchCallLogs } from '../api';
import { useNavigate } from 'react-router-dom';

const CallLogList = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getLogs = async () => {
            try {
                const response = await fetchCallLogs();
                setLogs(response.data);
            } catch (err) {
                setError('Failed to fetch call logs.');
            } finally {
                setLoading(false);
            }
        };
        getLogs();
    }, []);

    const handleRowClick = (id) => {
        navigate(`/call-logs/${id}`);
    };

    if (loading) return <p>Loading logs...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Call History</h2>
            {logs.length === 0 ? (
                <p>No call logs found. Run a manual simulation to see data here.</p>
            ) : (
                <table className="call-log-table">
                    <thead>
                        <tr>
                            <th>Call ID</th>
                            <th>Status</th>
                            <th>Timestamp</th>
                            <th>Summary</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log._id} onClick={() => handleRowClick(log._id)} style={{ cursor: 'pointer' }}>
                                <td>{log.call_id}</td>
                                <td>{log.status}</td>
                                <td>{new Date(log.createdAt).toLocaleString()}</td>
                                <td>{log.summary || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CallLogList;