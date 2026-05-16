import { db } from "./db";
import { sessions, InsertSession, Session } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  saveSession(id: string, data: string): void;
  getSession(id: string): Session | undefined;
  deleteSession(id: string): void;
}

export class Storage implements IStorage {
  saveSession(id: string, data: string): void {
    const now = Date.now();
    const existing = db.select().from(sessions).where(eq(sessions.id, id)).get();
    if (existing) {
      db.update(sessions).set({ data, updatedAt: now }).where(eq(sessions.id, id)).run();
    } else {
      db.insert(sessions).values({ id, data, createdAt: now, updatedAt: now }).run();
    }
  }

  getSession(id: string): Session | undefined {
    return db.select().from(sessions).where(eq(sessions.id, id)).get();
  }

  deleteSession(id: string): void {
    db.delete(sessions).where(eq(sessions.id, id)).run();
  }
}

export const storage = new Storage();
