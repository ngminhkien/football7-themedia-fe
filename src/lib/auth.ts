const TOKEN_KEY = 'football7_admin_token';
const EXPIRES_AT_KEY = 'football7_admin_token_expires';

export function getAdminToken(): string | null {
  const token = sessionStorage.getItem(TOKEN_KEY);
  const expiresAt = sessionStorage.getItem(EXPIRES_AT_KEY);

  if (!token || !expiresAt) {
    return null;
  }

  const expireTime = new Date(expiresAt).getTime();
  if (Date.now() >= expireTime) {
    clearAdminToken();
    return null;
  }

  return token;
}

export function setAdminToken(token: string, expiresAt: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(EXPIRES_AT_KEY, expiresAt);
}

export function clearAdminToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(EXPIRES_AT_KEY);
}

export function isAdminLoggedIn(): boolean {
  return getAdminToken() !== null;
}

export const isAuthenticated = isAdminLoggedIn;
