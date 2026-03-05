import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export async function login(credentials) {
  const response = await axios.post(`${API_BASE_URL}/login`, credentials, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
}

export async function healthCheck() {
  const response = await axios.get(`${API_BASE_URL}/api/health`);
  return response.data;
}
