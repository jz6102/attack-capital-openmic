import React from 'react';

// The component now accepts an `onDelete` function as a prop
const BotList = ({ bots, loading, error, onDelete }) => {
  if (loading) return <p>Loading bots...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Your Bots</h2>
      {bots.length === 0 ? (
        <p>No bots found. Use the form above to create one.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {bots.map((bot) => (
            <li 
              key={bot._id} 
              style={{ 
                background: '#f4f4f4', 
                margin: '0.5rem 0', 
                padding: '1rem', 
                borderRadius: '5px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <strong>Bot Name:</strong> {bot.name}
                <br />
                <strong>UID:</strong> {bot.uid}
                <br />
                <p style={{ margin: '0.5rem 0 0 0' }}><strong>Prompt:</strong> {bot.prompt}</p>
              </div>

              {/* --- NEW DELETE BUTTON --- */}
              <button 
                onClick={() => onDelete(bot._id)}
                style={{
                  background: '#ff4d4d',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
              {/* --- END OF NEW BUTTON --- */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BotList;