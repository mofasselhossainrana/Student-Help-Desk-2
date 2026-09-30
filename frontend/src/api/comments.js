import { apiFetch, parseJsonResponse } from './client';

export async function fetchTicketComments(ticketId) {
  const response = await apiFetch(`/tickets/${ticketId}/comments/`);
  const data = await parseJsonResponse(response);
  return Array.isArray(data) ? data : data.results;
}

export async function createTicketComment(ticketId, content) {
  const response = await apiFetch(`/tickets/${ticketId}/comments/`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });

  return parseJsonResponse(response);
}
