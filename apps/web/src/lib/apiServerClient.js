const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:3001';

const apiServerClient = {
  fetch: (path, options = {}) => {
    const url = path.startsWith('http') ? path : `${API_SERVER_URL}${path}`;
    return window.fetch(url, options);
  }
};

export default apiServerClient;
