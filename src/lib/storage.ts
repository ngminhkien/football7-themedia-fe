import { SubmissionRequest } from '@/api/types';

const SELECTED_PLAYER_ID_KEY = 'football7_selected_player_id';
const SUBMISSION_DRAFT_PREFIX = 'football7_draft_';
const SEEN_MATCH_PREFIX = 'football7_seen_match_';

export function getStoredPlayerId(): number | null {
  const val = localStorage.getItem(SELECTED_PLAYER_ID_KEY);
  return val ? parseInt(val, 10) : null;
}

export function setStoredPlayerId(id: number): void {
  localStorage.setItem(SELECTED_PLAYER_ID_KEY, id.toString());
}

export function getPlayerDraft(playerId: number): Partial<SubmissionRequest> | null {
  const val = localStorage.getItem(`${SUBMISSION_DRAFT_PREFIX}${playerId}`);
  if (!val) return null;
  try {
    return JSON.parse(val);
  } catch {
    return null;
  }
}

export function setPlayerDraft(playerId: number, draft: Partial<SubmissionRequest>): void {
  localStorage.setItem(`${SUBMISSION_DRAFT_PREFIX}${playerId}`, JSON.stringify(draft));
}

export function hasSeenMatchReveal(matchId: number): boolean {
  return localStorage.getItem(`${SEEN_MATCH_PREFIX}${matchId}`) === 'true';
}

export function markMatchRevealSeen(matchId: number): void {
  localStorage.setItem(`${SEEN_MATCH_PREFIX}${matchId}`, 'true');
}
