import React, { useState } from 'react';
import { createBot } from '../api';

const BotForm = ({ onBotCreated }) => {
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !prompt) {
      setError('Name and prompt are required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await createBot({ name, prompt, uid: `bot_${Date.now()}` });
      setName('');
      setPrompt('');
      onBotCreated(); // This function will tell the parent page to refresh the list
    } catch (err) {
      setError('Failed to create bot.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <h2>Create a New Bot</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="name">Bot Name</label>
        <br />
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '300px', padding: '0.5rem' }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="prompt">System Prompt</label>
        <br />
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows="4"
          style={{ width: '300px', padding: '0.5rem' }}
        />
      </div>
      <button type="submit" disabled={submitting} style={{ padding: '0.5rem 1rem' }}>
        {submitting ? 'Creating...' : 'Create Bot'}
      </button>
    </form>
  );
};

export default BotForm;