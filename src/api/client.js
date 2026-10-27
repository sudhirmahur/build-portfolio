// Development: falls back to the local backend. Production: set VITE_API_URL to your deployed backend
// (e.g. https://your-backend.onrender.com/api). Without it the site calls /api on its own domain.
const RAW_API_URL =
  import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');
// accepts both "https://backend.com" and "https://backend.com/api"
const trimmed = RAW_API_URL.replace(/\/+$/, '');
const API_URL = /\/api$/.test(trimmed) ? trimmed : `${trimmed}/api`;
const TOKEN_KEY = 'sm_admin_token';

export const getToken = () => {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};
export const setToken = (token) => {
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* storage unavailable */
  }
};
export const clearToken = () => {
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable */
  }
};

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(method, path, { body, form, signal } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload;
  if (form) {
    payload = form; // browser sets multipart boundary itself
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { method, headers, body: payload, signal });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiError('Cannot reach the server. Check your internet or that the backend is running.', 0);
  }

  let json = null;
  try {
    json = await response.json();
  } catch {
    json = null;
  }

  if (!response.ok) {
    const isAuthPath = path.startsWith('/admin') || path.startsWith('/upload') || path === '/auth/me';
    if (response.status === 401 && isAuthPath) {
      window.dispatchEvent(new Event('sm:unauthorized'));
    }
    throw new ApiError(json?.message || `Request failed (${response.status})`, response.status);
  }
  return json;
}

export const api = {
  get: (path, options) => request('GET', path, options),
  post: (path, body, options) => request('POST', path, { ...options, body }),
  put: (path, body, options) => request('PUT', path, { ...options, body }),
  patch: (path, body, options) => request('PATCH', path, { ...options, body }),
  del: (path, options) => request('DELETE', path, options),
  /** kind: 'image' | 'file'   folder: projects | profile | pages | misc */
  async upload(kind, file, folder = 'misc') {
    const form = new FormData();
    form.append('file', file);
    const res = await request('POST', `/upload/${kind}?folder=${encodeURIComponent(folder)}`, { form });
    return res.data;
  },
};
