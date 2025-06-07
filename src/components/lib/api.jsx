import axios from 'axios';

// Create an axios instance with retry logic
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add retry logic for rate limiting
api.interceptors.response.use(undefined, async (error) => {
  const { config, response } = error;
  
  // If the error is due to rate limiting (429)
  if (response && response.status === 429) {
    // Get retry-after header or use a default backoff
    const retryAfter = response.headers['retry-after'] 
      ? parseInt(response.headers['retry-after']) * 1000 
      : 2000;
    
    // Wait for the specified time
    await new Promise(resolve => setTimeout(resolve, retryAfter));
    
    // Retry the request
    return api(config);
  }
  
  return Promise.reject(error);
});

export default api;