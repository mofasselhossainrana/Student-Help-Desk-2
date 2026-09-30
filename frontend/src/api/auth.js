import { apiFetch, parseJsonResponse } from './client';

export async function login(credentials) {
  const response = await apiFetch('/login/', {
    method: 'POST',
    auth: false,
    body: JSON.stringify(credentials),
  });

  return parseJsonResponse(response);
}

export async function register(payload) {
  const response = await apiFetch('/register/', {
    method: 'POST',
    auth: false,
    body: JSON.stringify(payload),
  });

  return parseJsonResponse(response);
}

export async function validateSession() {
  const response = await apiFetch('/tickets/');
  return parseJsonResponse(response);
}

export async function logout() {
  const response = await apiFetch('/logout/', {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Unable to end session on the server.');
  }
}
