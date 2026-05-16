import { MaterialDef } from "@/types/game";

export const materials: MaterialDef[] = [
  { id: "papers", name: "Papers / Papes", emoji: "📄", tags: ["rolling", "ritual", "naming", "craft"] },
  { id: "filters", name: "Filters", emoji: "🔩", tags: ["rolling", "craft", "debate"] },
  { id: "grinder", name: "Grinder", emoji: "⚙️", tags: ["prep", "object", "ritual"] },
  { id: "lighter", name: "Lighter", emoji: "🔥", tags: ["suspicion", "object", "social-deduction"] },
  { id: "ashtray", name: "Ashtray", emoji: "🫙", tags: ["object", "cleanup", "ritual"] },
  { id: "bong", name: "Bong", emoji: "🏺", tags: ["oracle", "wisdom", "ritual", "dramatic"] },
  { id: "pipe", name: "Pipe", emoji: "🪄", tags: ["wizard", "fantasy", "object"] },
  { id: "vaporizer", name: "Vaporizer", emoji: "💨", tags: ["tech", "robot", "temperature", "snobbery"] },
  { id: "edibles", name: "Edibles", emoji: "🍪", tags: ["time", "patience", "delayed-effect", "caution"] },
  { id: "snacks", name: "Snacks", emoji: "🍕", tags: ["munchies", "food", "sidequest"] },
  { id: "water", name: "Drinks / Water", emoji: "💧", tags: ["safety", "pause", "chill-check"] },
  { id: "speaker", name: "Music Speaker", emoji: "🔊", tags: ["music", "dance", "aux"] },
  { id: "tv_console", name: "TV / Console", emoji: "📺", tags: ["media", "gaming", "couch"] },
  { id: "balcony", name: "Balcony / Outdoor", emoji: "🌙", tags: ["nature", "fresh-air", "observation"] },
  { id: "blanket_couch", name: "Blanket / Couch Setup", emoji: "🛋️", tags: ["cozy", "comfort", "chill"] },
  { id: "board_games", name: "Board Games", emoji: "🎲", tags: ["meta-game", "competition"] },
  { id: "cards", name: "Playing Cards", emoji: "🃏", tags: ["card-trick", "luck", "mini-game"] },
  { id: "no_gear", name: "Just Vibes", emoji: "✌️", tags: ["sober-friendly", "conversation", "imagination"] },
];

export const getMaterial = (id: string) => materials.find((m) => m.id === id);
