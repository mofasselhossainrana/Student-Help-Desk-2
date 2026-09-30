import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiFetch, parseJsonResponse, setUnauthorizedHandler } from './client';

describe('api client', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('parseJsonResponse throws formatted validation errors', async () => {
    const response = new Response(JSON.stringify({ priority: ['Invalid priority'] }), {
      status: 400,
    });

    await expect(parseJsonResponse(response)).rejects.toThrow('Invalid priority');
  });

  it('calls unauthorized handler when authenticated request returns 401', async () => {
    const handler = vi.fn();
    setUnauthorizedHandler(handler);
    localStorage.setItem('token', 'expired-token');

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('', { status: 401 })
    );

    await expect(apiFetch('/tickets/')).rejects.toThrow('Session expired');
    expect(handler).toHaveBeenCalledOnce();
  });
});
