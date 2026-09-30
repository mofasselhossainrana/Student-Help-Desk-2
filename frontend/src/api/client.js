export const API_URL =
  import.meta.env.VITE_API_URL || 'https://student-help-desk-2.onrender.com/api';

let onUnauthorized = () => {};

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

export async function apiFetch(path, options = {}) {
  const { auth = true, ...fetchOptions } = options;
  const token = auth ? localStorage.getItem('token') : null;
  const headers = { ...(fetchOptions.headers || {}) };

  if (token) {
    headers.Authorization = `Token ${token}`;
  }

  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (response.status === 401 && token) {
    onUnauthorized();
    throw new Error('Session expired. Please sign in again.');
  }

  return response;
}

export async function parseJsonResponse(response) {
  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null
        ? Object.values(data).flat().join(' ')
        : data || response.statusText;

    throw new Error(message || 'Request failed.');
  }

  return data;
}
