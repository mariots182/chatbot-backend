import { UserSession } from "../types";
import { SESSION_TTL } from "./constants";

const sessions = new Map<string, UserSession>();

export function getSession(userId: string): UserSession {
  const now = Date.now();
  let session = sessions.get(userId);
  if (!session || now - session.lastActivity > SESSION_TTL) {
    session = { userId, state: 'WELCOME', lastActivity: now };
    sessions.set(userId, session);
  } else {
    session.lastActivity = now;
  }
  return session;
}

export function updateSession(userId: string, session: UserSession): void {
  sessions.set(userId, session);
}

export function clearSession(userId: string): void {
  sessions.delete(userId);
}