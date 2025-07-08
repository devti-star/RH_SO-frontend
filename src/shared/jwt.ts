export interface JwtPayload {
  sub?: number;
  [key: string]: unknown;
}

export function decodeJwt(token: string | undefined): JwtPayload | null {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}
