import React, { useState, useEffect, useCallback } from 'react';
import BotList from '../components/BotList';
import BotForm from '../components/BotForm';
import { fetchBots, deleteBot } from '../api'; // Import the deleteBot function

const BotsPage = () => {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getBots = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchBots();
      setBots(response.data);
    } catch (err) {
      setError('Failed to fetch bots. Is the server running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getBots();
  }, [getBots]);

  // --- NEW FUNCTION TO HANDLE DELETION ---
  const handleDeleteBot = async (id) => {
    try {
      await deleteBot(id);
      getBots(); // Refresh the list after deleting
    } catch (err) {
      console.error('Failed to delete bot:', err);
      // You could set an error state here to show a message to the user
    }
  };
  // --- END OF NEW FUNCTION ---

  return (
    <div>
      <h1>Bot Management</h1>
      <p>Here you can see and manage your bots.</p>
      
      <BotForm onBotCreated={getBots} />
      
      <hr style={{ margin: '2rem 0' }} />

      {/* Pass the new delete function down to the list */}
      <BotList bots={bots} loading={loading} error={error} onDelete={handleDeleteBot} />
    </div>
  );
};

export default BotsPage;