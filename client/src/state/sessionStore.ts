import { createContext, useContext } from "react";
import { GameSession, Player, MaterialId, SessionSettings, ActiveRule } from "@/types/game";

export type SessionAction =
  | { type: "SET_SESSION"; session: GameSession }
  | { type: "CLEAR_SESSION" }
  | { type: "NEXT_CARD"; cardId: string; wasChillCheck: boolean }
  | { type: "SKIP_CARD" }
  | { type: "GIVE_VIBE_TOKEN"; fromPlayerId: string; toPlayerId: string }
  | { type: "ADD_TITLE"; playerId: string; title: string }
  | { type: "ADD_ACTIVE_RULE"; rule: ActiveRule }
  | { type: "REMOVE_EXPIRED_RULES" }
  | { type: "UPDATE_SETTINGS"; settings: Partial<SessionSettings> }
  | { type: "SET_FAVORITE_CARD"; cardId: string }
  | { type: "END_SESSION" };

export interface SessionState {
  session: GameSession | null;
  dispatch: (action: SessionAction) => void;
}

export const SessionContext = createContext<SessionState>({
  session: null,
  dispatch: () => {},
});

export const useSession = () => useContext(SessionContext);

export function sessionReducer(state: GameSession | null, action: SessionAction): GameSession | null {
  if (action.type === "SET_SESSION") return action.session;
  if (action.type === "CLEAR_SESSION") return null;
  if (!state) return null;

  switch (action.type) {
    case "NEXT_CARD": {
      const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
      const newPlayedIds = [...state.playedCardIds, action.cardId];
      return {
        ...state,
        playedCardIds: newPlayedIds,
        currentPlayerIndex: nextPlayerIndex,
        roundNumber: nextPlayerIndex === 0 ? state.roundNumber + 1 : state.roundNumber,
        cardsSinceChillCheck: action.wasChillCheck ? 0 : state.cardsSinceChillCheck + 1,
        activeRules: state.activeRules.filter(
          (r) =>
            r.expiresAtRound === undefined || r.expiresAtRound > state.roundNumber
        ),
      };
    }
    case "SKIP_CARD": {
      const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
      return {
        ...state,
        currentPlayerIndex: nextPlayerIndex,
        roundNumber: nextPlayerIndex === 0 ? state.roundNumber + 1 : state.roundNumber,
      };
    }
    case "GIVE_VIBE_TOKEN": {
      return {
        ...state,
        players: state.players.map((p) =>
          p.id === action.toPlayerId ? { ...p, vibeTokens: p.vibeTokens + 1 } : p
        ),
      };
    }
    case "ADD_TITLE": {
      return {
        ...state,
        players: state.players.map((p) =>
          p.id === action.playerId
            ? { ...p, titles: [...new Set([...p.titles, action.title])] }
            : p
        ),
      };
    }
    case "ADD_ACTIVE_RULE": {
      return {
        ...state,
        activeRules: [...state.activeRules, action.rule],
      };
    }
    case "UPDATE_SETTINGS": {
      return {
        ...state,
        settings: { ...state.settings, ...action.settings },
      };
    }
    case "SET_FAVORITE_CARD": {
      return { ...state, favoriteCardId: action.cardId };
    }
    case "END_SESSION": {
      return { ...state, endedAt: new Date().toISOString() };
    }
    default:
      return state;
  }
}
