import { apiFetch, parseJsonResponse } from './client';

export async function fetchTickets(search = '', status = '', priority = '') {
  const params = new URLSearchParams();

  if (search) params.set('search', search);
  if (status) params.set('status', status);
  if (priority) params.set('priority', priority);

  const query = params.toString();
  const response = await apiFetch(`/tickets/${query ? `?${query}` : ''}`);
  const data = await parseJsonResponse(response);
  return Array.isArray(data) ? data : data.results;
}

export async function fetchTicket(id) {
  const response = await apiFetch(`/tickets/${id}/`);
  return parseJsonResponse(response);
}

export async function createTicket(ticketData) {
  const response = await apiFetch('/tickets/', {
    method: 'POST',
    body: JSON.stringify(ticketData),
  });

  return parseJsonResponse(response);
}
