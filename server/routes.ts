import type { Express } from "express";
import { Server } from "http";
import { storage } from "./storage";

export function registerRoutes(httpServer: Server, app: Express) {
  // Save session
  app.post("/api/sessions/:id", (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    if (!data) return res.status(400).json({ error: "data required" });
    storage.saveSession(id, JSON.stringify(data));
    res.json({ ok: true });
  });

  // Get session
  app.get("/api/sessions/:id", (req, res) => {
    const { id } = req.params;
    const session = storage.getSession(id);
    if (!session) return res.status(404).json({ error: "not found" });
    res.json({ data: JSON.parse(session.data) });
  });

  // Delete session
  app.delete("/api/sessions/:id", (req, res) => {
    const { id } = req.params;
    storage.deleteSession(id);
    res.json({ ok: true });
  });

  return httpServer;
}
