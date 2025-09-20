// client/src/api/index.js
import axios from 'axios';

// The base URL of your backend server
const API = axios.create({ baseURL: 'https://attack-capital-openmic-server.onrender.com/api' });

// Bot API calls
export const fetchBots = () => API.get('/bots');
export const createBot = (newBot) => API.post('/bots', newBot);
export const deleteBot = (id) => API.delete(`/bots/${id}`);

// Call Log API calls
export const fetchCallLogs = () => API.get('/call-logs');
export const fetchCallLogById = (id) => API.get(`/call-logs/${id}`);