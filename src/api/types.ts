export type Position = 'GK' | 'DF' | 'WG' | 'MF' | 'FW';

export interface PublicPlayer {
  id: number;
  name: string;
  submitted: boolean;
}

export interface SubmissionRequest {
  positions: Position[];
  preferredPosition: Position;
  avoidIds: number[];
  selfScore: number;
}

export interface PositionSubmissionDto {
  position: Position;
  isPrimary: boolean;
}

export interface TeamPlayerDto {
  id: number;
  name: string;
  assignedPosition: Position;
  isPrimaryPosition?: boolean;
  isPreferredPosition?: boolean;
  isOutOfPosition?: boolean;
  score?: number;
  jerseyNumber?: number | null;
}

export interface TeamDto {
  teamName: string;
  color?: string;
  scoreSum?: number;
  players: TeamPlayerDto[];
}

export interface PublicSlotPlayer {
  id: number;
  name: string;
  position: Position;
}

export interface PublicTeam {
  name: string;
  color: 'yellow' | 'blue';
  totalScore: number;
  players: PublicSlotPlayer[];
}

export interface PublicResult {
  matchId: number;
  publishedAt: string;
  teamA: PublicTeam;
  teamB: PublicTeam;
}

export interface PublicSettings {
  registrationOpen: boolean;
}

export interface HealthResponse {
  status: string;
  db: 'up' | 'down';
  time: string;
}

// -------------------------------------------------------------
// Admin Types
// -------------------------------------------------------------

export type PlayerTier = 'none' | 'strong' | 'weak';

export interface AdminPlayer {
  id: number;
  name: string;
  isActive: boolean;
  submitted: boolean;
  submittedAt: string | null;
  selfScore: number | null;
  adminScore: number | null;
  preferredPosition: Position | null;
  positions: Position[];
  avoidIds: number[];
  tier: PlayerTier;
}

export interface Warning {
  level: 'error' | 'warn' | 'info';
  code: string;
  message: string;
  playerIds?: number[];
}

export interface SplitWeights {
  adminWeight: number;
  selfWeight: number;
  powerWeight: number;
  conflictWeight: number;
  outOfPositionWeight: number;
  preferredBonus: number;
}

export interface SplitRequest {
  lockedTeamA?: number[];
  lockedTeamB?: number[];
  topN?: number;
  jitter?: number;
  seed?: number;
  allowIncomplete?: boolean;
  weights?: Partial<SplitWeights>;
}

export interface AdminTeamPlayer {
  id: number;
  name: string;
  position: Position;
  score: number;
  isPreferredPosition: boolean;
  isOutOfPosition: boolean;
}

export interface AdminTeam {
  name: string;
  color: 'yellow' | 'blue';
  totalScore: number;
  players: AdminTeamPlayer[];
}

export interface SplitPlan {
  matchId: number;
  rank: number;
  teamA: AdminTeam;
  teamB: AdminTeam;
  powerDiff: number;
  conflictCount: number;
  outOfPositionCount: number;
  cost: number;
  explanation: string;
  tierStrongA: number;
  tierStrongB: number;
  tierWeakA: number;
  tierWeakB: number;
}

export interface AdminLoginResponse {
  token: string;
  expiresAt: string;
}
