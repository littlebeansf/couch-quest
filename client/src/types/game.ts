export type GameMode =
  | "chill"
  | "chaos"
  | "deep"
  | "munchie"
  | "sidequest"
  | "couple"
  | "party";

export type Intensity = "low" | "medium" | "high";

export type CharacterId =
  | "snack_goblin"
  | "couch_shaman"
  | "rolling_apprentice"
  | "space_cadet"
  | "weed_sommelier"
  | "lighter_thief"
  | "dj_gremlin"
  | "conspiracy_uncle"
  | "nature_wizard";

export type MaterialId =
  | "papers"
  | "filters"
  | "grinder"
  | "lighter"
  | "ashtray"
  | "bong"
  | "pipe"
  | "vaporizer"
  | "edibles"
  | "snacks"
  | "water"
  | "speaker"
  | "tv_console"
  | "balcony"
  | "blanket_couch"
  | "board_games"
  | "cards"
  | "no_gear";

export type CardType =
  | "sidequest"
  | "debate"
  | "vote"
  | "character"
  | "ritual"
  | "rule"
  | "memory"
  | "creative"
  | "chill_check";

export interface Player {
  id: string;
  name: string;
  characterId: CharacterId;
  avatarEmoji: string;
  vibeTokens: number;
  relationshipTags: string[];
  titles: string[];
}

export interface SessionSettings {
  mode: GameMode;
  intensity: Intensity;
  soberFriendly: boolean;
  noConsumption: boolean;
  ediblesCaution: boolean;
  stashContext?: "unknown" | "tiny" | "personal" | "group" | "legendary" | "officer";
}

export interface ActiveRule {
  id: string;
  title: string;
  description: string;
  expiresAtRound?: number;
}

export interface GameSession {
  id: string;
  players: Player[];
  currentPlayerIndex: number;
  selectedMaterials: MaterialId[];
  settings: SessionSettings;
  playedCardIds: string[];
  roundNumber: number;
  activeRules: ActiveRule[];
  startedAt: string;
  endedAt?: string;
  favoriteCardId?: string;
  cardsSinceChillCheck: number;
  votedFunniestId?: string;
}

export interface Card {
  id: string;
  title: string;
  type: CardType;
  prompt: string;
  soberPrompt?: string;
  requiredMaterials?: MaterialId[];
  excludedMaterials?: MaterialId[];
  tags: string[];
  modeWeights?: Partial<Record<GameMode, number>>;
  characterWeights?: Partial<Record<CharacterId, number>>;
  materialWeights?: Partial<Record<MaterialId, number>>;
  minPlayers?: number;
  maxPlayers?: number;
  intensity: Intensity[];
  allowsConsumptionReference: boolean;
  requiresConsumption: false;
  safetyLevel: "safe" | "optional_cannabis_reference" | "chill_check";
}

export interface CharacterDef {
  id: CharacterId;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  color: string;
}

export interface MaterialDef {
  id: MaterialId;
  name: string;
  emoji: string;
  tags: string[];
}
