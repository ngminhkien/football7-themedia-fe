import { describe, it, expect } from 'vitest';
import { stepAvoidSchema, stepPositionsSchema, submissionFormSchema } from '../src/features/submission/schema';

describe('Submission Schemas', () => {
  it('should validate stepPositionsSchema correctly', () => {
    const valid = stepPositionsSchema.safeParse({
      positions: ['FW', 'MF'],
      preferredPosition: 'FW',
    });
    expect(valid.success).toBe(true);

    const invalid = stepPositionsSchema.safeParse({
      positions: ['DF'],
      preferredPosition: 'FW', // not in positions
    });
    expect(invalid.success).toBe(false);
  });

  it('should validate stepAvoidSchema correctly', () => {
    const valid = stepAvoidSchema.safeParse({
      playerId: 1,
      avoidIds: [2, 3],
    });
    expect(valid.success).toBe(true);

    const invalidMax = stepAvoidSchema.safeParse({
      playerId: 1,
      avoidIds: [2, 3, 4], // more than 2
    });
    expect(invalidMax.success).toBe(false);

    const invalidSelf = stepAvoidSchema.safeParse({
      playerId: 1,
      avoidIds: [1, 2], // self avoid
    });
    expect(invalidSelf.success).toBe(false);
  });

  it('should validate full submission form', () => {
    const valid = submissionFormSchema.safeParse({
      playerId: 1,
      positions: ['GK'],
      preferredPosition: 'GK',
      avoidIds: [],
      selfScore: 8,
    });
    expect(valid.success).toBe(true);
  });
});
