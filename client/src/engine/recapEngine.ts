import { GameSession, Player } from "@/types/game";

const sessionTitles = [
  "The Council of the Missing Lighter",
  "The Great Snack Negotiation",
  "The Night the Couch Became Sacred",
  "The Incident That Cannot Be Named",
  "A Quiet Evening That Was Neither",
  "The Mystery of the Third Chip",
  "The Bong Oracle Was Right",
  "Operation: No One Knows",
  "The Prophecy That Came True Somehow",
  "The Hour the Group Lost Its Mind",
  "The Forbidden Snack Trials",
  "The Legend of the Warm Blanket",
  "When the Vibes Were Immaculate",
  "The Couch Diplomacy Summit",
  "A Meeting of the High Council",
];

export function generateSessionTitle(session: GameSession): string {
  const seed = session.players.length + session.roundNumber;
  return sessionTitles[seed % sessionTitles.length];
}

export function getMVP(session: GameSession): Player | null {
  if (session.players.length === 0) return null;
  return session.players.reduce((max, p) => (p.vibeTokens > max.vibeTokens ? p : max));
}

export function getMostSuspicious(session: GameSession): Player | null {
  const lighterThiefs = session.players.filter((p) => p.characterId === "lighter_thief");
  if (lighterThiefs.length > 0) return lighterThiefs[0];
  return session.players[session.players.length - 1] || null;
}

export function getSnackEnergy(session: GameSession): string {
  const hasMunchieMode = session.settings.mode === "munchie";
  const hasSnacks = session.selectedMaterials.includes("snacks");
  if (hasMunchieMode && hasSnacks) return "Dangerous";
  if (hasSnacks) return "Elevated";
  if (hasMunchieMode) return "Spiritual";
  return "Theoretical";
}

export function getEarnedTitles(session: GameSession): Array<{ player: Player; title: string }> {
  return session.players
    .filter((p) => p.titles.length > 0)
    .flatMap((p) => p.titles.map((t) => ({ player: p, title: t })));
}
