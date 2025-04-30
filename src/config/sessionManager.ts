import { promises as fs } from "fs";
import path from "path";
import { UserSession } from "../types";
import { SESSION_TTL } from "./constants";

const sessions = new Map<string, UserSession>();
const BASE_SESSION_PATH = path.resolve(__dirname, "../../sessions");

async function ensureDirectoryExists(dirPath: string) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    console.error("❌ [SessionManager] Error creating directory:", error);
  }
}

async function loadSessionFromDisk(
  companyId: string,
  userId: string
): Promise<UserSession | null> {
  const sessionFile = path.join(
    BASE_SESSION_PATH,
    companyId,
    "users",
    `${userId}.json`
  );
  try {
    const data = await fs.readFile(sessionFile, "utf-8");
    return JSON.parse(data) as UserSession;
  } catch {
    return null;
  }
}

async function saveSessionToDisk(
  companyId: string,
  session: UserSession
): Promise<void> {
  const dir = path.join(BASE_SESSION_PATH, companyId, "users");
  await ensureDirectoryExists(dir);
  const sessionFile = path.join(dir, `${session.userId}.json`);
  try {
    await fs.writeFile(sessionFile, JSON.stringify(session, null, 2), "utf-8");
  } catch (error) {
    console.error("❌ [SessionManager] Error saving session:", error);
  }
}

async function deleteSessionFromDisk(
  companyId: string,
  userId: string
): Promise<void> {
  const sessionFile = path.join(
    BASE_SESSION_PATH,
    companyId,
    "users",
    `${userId}.json`
  );
  try {
    await fs.unlink(sessionFile);
  } catch (error) {
    console.error("⚠️ [SessionManager] Error deleting session file:", error);
  }
}

export async function getSession(
  companyId: string,
  userId: string
): Promise<UserSession> {
  const now = Date.now();
  const key = `${companyId}:${userId}`;
  let session = sessions.get(key);

  session = (await loadSessionFromDisk(companyId, userId)) || session;

  session =
    !session || now - session.lastActivity > SESSION_TTL
      ? {
          userId,
          state: "WELCOME",
          lastActivity: now,
          data: {},
        }
      : { ...session, lastActivity: now };

  sessions.set(key, session);

  await saveSessionToDisk(companyId, session);

  console.log(
    `✅ [SessionManager] Session loaded for ${userId} under company ${companyId}`
  );

  return session;
}

export async function setSession(
  companyId: string,
  session: UserSession
): Promise<void> {
  const key = `${companyId}:${session.userId}`;

  sessions.set(key, {
    ...session,
    lastActivity: Date.now(),
  });

  await saveSessionToDisk(companyId, session);

  console.log(
    `💾 [SessionManager] Session saved for ${session.userId} under company ${companyId}`
  );
}

export async function clearSession(
  companyId: string,
  userId: string
): Promise<void> {
  const key = `${companyId}:${userId}`;
  sessions.delete(key);
  await deleteSessionFromDisk(companyId, userId);

  console.log(
    `🗑️ [SessionManager] Session cleared for ${userId} under company ${companyId}`
  );
}
