import { describe, expect, it } from 'vitest';
import { prettyLabel, priorityClass, statusClass } from './format';

describe('format helpers', () => {
  it('prettyLabel formats snake case values', () => {
    expect(prettyLabel('IN PROGRESS')).toBe('IN PROGRESS');
    expect(prettyLabel('high')).toBe('High');
  });

  it('priorityClass returns lowercase css class suffix', () => {
    expect(priorityClass('HIGH')).toBe('priority-high');
  });

  it('statusClass converts spaces to dashes', () => {
    expect(statusClass('IN PROGRESS')).toBe('status-in-progress');
  });
});
