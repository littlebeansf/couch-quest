import { Card, GameSession, Intensity } from "@/types/game";
import { cards as allCards } from "@/data/cards";

const CHILL_CHECK_INTERVAL = 6; // inject after this many non-chill-check cards

export function shouldInjectChillCheck(session: GameSession): boolean {
  return session.cardsSinceChillCheck >= CHILL_CHECK_INTERVAL;
}

function intensityAllows(cardIntensity: Intensity[], sessionIntensity: Intensity): boolean {
  const order: Intensity[] = ["low", "medium", "high"];
  const sessionIdx = order.indexOf(sessionIntensity);
  return cardIntensity.some((ci) => order.indexOf(ci) <= sessionIdx);
}

function respectsSafetySettings(card: Card, session: GameSession): boolean {
  if (card.requiresConsumption) return false;
  if (session.settings.noConsumption && card.allowsConsumptionReference) {
    return Boolean(card.soberPrompt);
  }
  if (session.settings.soberFriendly && card.safetyLevel === "optional_cannabis_reference") {
    return Boolean(card.soberPrompt);
  }
  return true;
}

function hasRequiredMaterials(card: Card, selectedMaterials: string[]): boolean {
  if (!card.requiredMaterials || card.requiredMaterials.length === 0) return true;
  return card.requiredMaterials.every((m) => selectedMaterials.includes(m));
}

function hasNoExcludedMaterials(card: Card, selectedMaterials: string[]): boolean {
  if (!card.excludedMaterials || card.excludedMaterials.length === 0) return true;
  return !card.excludedMaterials.some((m) => selectedMaterials.includes(m));
}

function respectsPlayerCount(card: Card, playerCount: number): boolean {
  if (card.minPlayers && playerCount < card.minPlayers) return false;
  if (card.maxPlayers && playerCount > card.maxPlayers) return false;
  return true;
}

function calculateWeight(card: Card, session: GameSession): number {
  let weight = 10; // base

  // Mode weight
  const mw = card.modeWeights?.[session.settings.mode] ?? 0;
  weight += mw * 3;

  // Character weight
  const currentPlayer = session.players[session.currentPlayerIndex];
  if (currentPlayer) {
    const cw = card.characterWeights?.[currentPlayer.characterId] ?? 0;
    weight += cw * 4;
  }

  // Material weight
  for (const material of session.selectedMaterials) {
    weight += (card.materialWeights?.[material] ?? 0) * 2;
  }

  // Reduce weight for recently played cards
  const recentlyPlayed = session.playedCardIds.slice(-12);
  if (recentlyPlayed.includes(card.id)) {
    weight -= 50;
  }

  return Math.max(weight, 0);
}

function weightedRandom<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

export function getNextCard(session: GameSession): Card | null {
  const eligible = allCards.filter((card) => {
    if (!respectsSafetySettings(card, session)) return false;
    if (!hasRequiredMaterials(card, session.selectedMaterials)) return false;
    if (!hasNoExcludedMaterials(card, session.selectedMaterials)) return false;
    if (!respectsPlayerCount(card, session.players.length)) return false;
    if (!intensityAllows(card.intensity, session.settings.intensity)) return false;
    return true;
  });

  if (eligible.length === 0) return null;

  // Inject chill check
  if (shouldInjectChillCheck(session)) {
    const chillCards = eligible.filter((c) => c.type === "chill_check");
    const unplayedChillCards = chillCards.filter(
      (c) => !session.playedCardIds.slice(-20).includes(c.id)
    );
    const pool = unplayedChillCards.length > 0 ? unplayedChillCards : chillCards;
    if (pool.length > 0) {
      const weights = pool.map((c) => calculateWeight(c, session));
      return weightedRandom(pool, weights);
    }
  }

  // Normal card — exclude chill checks
  const normalCards = eligible.filter((c) => c.type !== "chill_check");
  if (normalCards.length === 0) return eligible[0];

  const weights = normalCards.map((c) => calculateWeight(c, session));
  return weightedRandom(normalCards, weights);
}

export function getDisplayPrompt(card: Card, session: GameSession): string {
  if (
    (session.settings.noConsumption || session.settings.soberFriendly) &&
    card.allowsConsumptionReference &&
    card.soberPrompt
  ) {
    return card.soberPrompt;
  }
  return card.prompt;
}
