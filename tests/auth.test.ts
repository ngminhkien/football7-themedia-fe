import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getAdminToken, setAdminToken, clearAdminToken, isAdminLoggedIn } from '../src/lib/auth';

describe('Auth Utilities', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return null when token does not exist', () => {
    expect(getAdminToken()).toBeNull();
    expect(isAdminLoggedIn()).toBe(false);
  });

  it('should set and get token if not expired', () => {
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 1);
    
    setAdminToken('mock-token', futureDate.toISOString());
    
    expect(getAdminToken()).toBe('mock-token');
    expect(isAdminLoggedIn()).toBe(true);
  });

  it('should clear token and return null if expired', () => {
    const pastDate = new Date();
    pastDate.setHours(pastDate.getHours() - 1);
    
    setAdminToken('mock-token', pastDate.toISOString());
    
    // Setting system time to now, which is past the expiration
    expect(getAdminToken()).toBeNull();
    expect(isAdminLoggedIn()).toBe(false);
    expect(sessionStorage.getItem('football7_admin_token')).toBeNull(); // it should have cleared it
  });

  it('should clear token manually', () => {
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 1);
    
    setAdminToken('mock-token', futureDate.toISOString());
    clearAdminToken();
    
    expect(getAdminToken()).toBeNull();
    expect(isAdminLoggedIn()).toBe(false);
  });
});
