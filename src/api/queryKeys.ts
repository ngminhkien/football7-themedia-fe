export const queryKeys = {
  health: ['health'] as const,
  settings: ['settings'] as const,
  players: ['players'] as const,
  result: ['result'] as const,
  admin: {
    players: ['admin', 'players'] as const,
    warnings: ['admin', 'warnings'] as const,
    settings: ['admin', 'settings'] as const,
  },
  adminPlayers: ['admin', 'players'] as const,
  warnings: ['admin', 'warnings'] as const,
};
