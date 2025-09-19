import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCallLogById } from '../api';

const CallLogDetailPage = () => {
  const { id } = useParams();
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getLog = async () => {
      try {
        const response = await fetchCallLogById(id);
        setLog(response.data);
      } catch (err) {
        setError('Failed to fetch call log details.');
      } finally {
        setLoading(false);
      }
    };
    getLog();
  }, [id]);

  if (loading) return <p>Loading details...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!log) return <p>No log data found.</p>;

  return (
    <div>
      <h1>Call Details: {log.call_id}</h1>
      <p><strong>Status:</strong> {log.status}</p>
      <p><strong>Timestamp:</strong> {new Date(log.createdAt).toLocaleString()}</p>
      <hr />
      <h2>Webhook Events</h2>
      {log.events.map((event, index) => (
        <div key={index} style={{ marginBottom: '2rem' }}>
          <h3>Event: {event.type}</h3>
          
          {/* --- THIS IS THE NEW, SIMPLE WAY TO DISPLAY THE DATA --- */}
          <pre style={{
            background: '#282c34',
            color: '#ffffff',
            padding: '1rem',
            borderRadius: '5px',
            whiteSpace: 'pre-wrap', // Makes sure text wraps
            wordBreak: 'break-all'
          }}>
            {JSON.stringify(event.payload, null, 2)}
          </pre>
          
        </div>
      ))}
    </div>
  );
};

export default CallLogDetailPage;