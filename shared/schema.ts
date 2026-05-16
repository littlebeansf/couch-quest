import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  data: text("data").notNull(), // JSON blob of GameSession
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const insertSessionSchema = createInsertSchema(sessions).omit({});
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;
