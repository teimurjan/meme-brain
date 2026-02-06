const MUTED_KEY = 'sound-muted';

export function readMuted(): boolean {
  try {
    return localStorage.getItem(MUTED_KEY) === 'true';
  } catch {
    return false;
  }
}

export function writeMuted(value: boolean): void {
  try {
    localStorage.setItem(MUTED_KEY, String(value));
  } catch {
    // localStorage unavailable
  }
}
