import axios from 'axios';

// Set base URL from environment variable or default to localhost for development
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default axios;
