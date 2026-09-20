import { SubmissionFormData } from './schema';

const LAST_PLAYER_ID_KEY = 'football7_last_player_id';
const DRAFT_PREFIX = 'football7_submission_draft_';
const SUBMITTED_PREFIX = 'football7_submission_done_';

export function saveLastPlayerId(id: number): void {
  try {
    localStorage.setItem(LAST_PLAYER_ID_KEY, id.toString());
  } catch {
    // Ignore storage quota errors
  }
}

export function getLastPlayerId(): number | null {
  try {
    const raw = localStorage.getItem(LAST_PLAYER_ID_KEY);
    return raw ? parseInt(raw, 10) : null;
  } catch {
    return null;
  }
}

export function saveSubmissionDraft(data: Partial<SubmissionFormData>): void {
  if (!data.playerId) return;
  try {
    localStorage.setItem(`${DRAFT_PREFIX}${data.playerId}`, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors
  }
}

export function getSubmissionDraft(playerId: number): Partial<SubmissionFormData> | null {
  try {
    const raw = localStorage.getItem(`${DRAFT_PREFIX}${playerId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSubmittedRecord(data: SubmissionFormData): void {
  try {
    localStorage.setItem(`${SUBMITTED_PREFIX}${data.playerId}`, JSON.stringify(data));
    saveLastPlayerId(data.playerId);
  } catch {
    // Ignore
  }
}

export function getSubmittedRecord(playerId: number): SubmissionFormData | null {
  try {
    const raw = localStorage.getItem(`${SUBMITTED_PREFIX}${playerId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
