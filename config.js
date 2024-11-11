require('dotenv').config();

const config = {
  backendUrl: process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000',
  // other config variables...
};

export default config;