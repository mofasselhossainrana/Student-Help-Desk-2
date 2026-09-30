export function prettyLabel(value) {
  return String(value || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function priorityClass(value) {
  return `priority-${String(value || '').toLowerCase()}`;
}

export function statusClass(value) {
  return `status-${String(value || '').toLowerCase().replace(' ', '-')}`;
}

export function formatDate(value) {
  return value ? new Date(value).toLocaleString() : 'Not available';
}
