import axios from 'axios';

const domain =
  process.env.NODE_ENV === 'production'
    ? 'https://raijin.tk'
    : 'http://localhost:3000';

const api = axios.create({
  baseURL: domain,
});

export default api;
