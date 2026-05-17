import { useState, useCallback, useEffect } from "react";
import { useLocation } from "wouter";
import { useSession } from "@/state/sessionStore";
import { getNextCard, getDisplayPrompt } from "@/engine/cardEngine";
import { getCharacter } from "@/data/characters";
import { Card, Player } from "@/types/game";
import { apiRequest } from "@/lib/queryClient";
import PauseModal from "@/components/PauseModal";
import { AvatarImg } from "@/components/AvatarImg";
import VibeTokenModal from "@/components/VibeTokenModal";

const CARD_TYPE_ICONS: Record<string, string> = {
  sidequest: "🗺️",
  debate: "⚔️",
  vote: "👆",
  character: "🎭",
  ritual: "🌀",
  rule: "📜",
  memory: "🧠",
  creative: "✨",
  chill_check: "💧",
};

const CARD_TYPE_LABELS: Record<string, string> = {
  sidequest: "Sidequest",
  debate: "Debate",
  vote: "Vote",
  character: "Character Card",
  ritual: "Optional Ritual",
  rule: "New Rule",
  memory: "Memory Check",
  creative: "Creative",
  chill_check: "Chill Check",
};

function CardView({ card, session }: { card: Card; session: any }) {
  const prompt = getDisplayPrompt(card, session);
  const isSober = (session.settings.noConsumption || session.settings.soberFriendly) && card.soberPrompt;

  return (
    <div
      className="rounded-2xl p-6 card-appear"
      style={{
        background: card.type === "chill_check"
          ? "hsl(188,40%,14%)"
          : card.type === "ritual"
          ? "hsl(280,30%,16%)"
          : "hsl(265,28%,16%)",
        border: `2px solid ${
          card.type === "chill_check"
            ? "hsl(188,63%,50%)"
            : card.type === "ritual"
            ? "hsl(280,75%,60%)"
            : "hsl(265,22%,28%)"
        }`,
        minHeight: "280px",
      }}
    >
      {/* Card type badge */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className={`badge-${card.type} px-2 py-0.5 rounded-full text-xs font-bold`}
        >
          {CARD_TYPE_ICONS[card.type]} {CARD_TYPE_LABELS[card.type]}
        </span>
        {isSober && (
          <span
            className="px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ background: "hsl(188,50%,20%)", color: "hsl(188,63%,70%)" }}
          >
            ✌️ Sober ver.
          </span>
        )}
      </div>

      {/* Card title */}
      <h2
        className="text-xl font-black mb-3 leading-tight"
        style={{ color: "hsl(270,40%,96%)" }}
      >
        {card.title}
      </h2>

      {/* Card prompt */}
      <p
        className="text-base leading-relaxed"
        style={{ color: "hsl(270,20%,82%)", maxWidth: "none" }}
      >
        {prompt}
      </p>

      {/* Active rules reminder */}
    </div>
  );
}

export default function GameScreen() {
  const [, navigate] = useLocation();
  const { session, dispatch } = useSession();
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [pauseOpen, setPauseOpen] = useState(false);
  const [vibeOpen, setVibeOpen] = useState(false);
  const [favorited, setFavorited] = useState(false);

  // Get first card on mount
  useEffect(() => {
    if (session && !currentCard) {
      const card = getNextCard(session);
      setCurrentCard(card);
    }
  }, []);

  useEffect(() => {
    setFavorited(currentCard ? session?.favoriteCardId === currentCard.id : false);
  }, [currentCard, session?.favoriteCardId]);

  const handleDone = useCallback(async () => {
    if (!session || !currentCard) return;
    const wasChillCheck = currentCard.type === "chill_check";
    dispatch({ type: "NEXT_CARD", cardId: currentCard.id, wasChillCheck });
    const next = getNextCard({ ...session, playedCardIds: [...session.playedCardIds, currentCard.id], currentPlayerIndex: (session.currentPlayerIndex + 1) % session.players.length, cardsSinceChillCheck: wasChillCheck ? 0 : session.cardsSinceChillCheck + 1, roundNumber: ((session.currentPlayerIndex + 1) % session.players.length === 0) ? session.roundNumber + 1 : session.roundNumber } as any);
    setCurrentCard(next);

    // Persist
    try {
      await apiRequest("POST", `/api/sessions/${session.id}`, { data: session });
    } catch {}
  }, [session, currentCard, dispatch]);

  const handleSkip = useCallback(() => {
    if (!session) return;
    dispatch({ type: "SKIP_CARD" });
    const next = getNextCard(session);
    setCurrentCard(next);
  }, [session, dispatch]);

  const handleFavorite = () => {
    if (!session || !currentCard) return;
    dispatch({ type: "SET_FAVORITE_CARD", cardId: currentCard.id });
    setFavorited(true);
  };

  const handleEndGame = async () => {
    if (!session) return;
    dispatch({ type: "END_SESSION" });
    try {
      await apiRequest("POST", `/api/sessions/${session.id}`, { data: { ...session, endedAt: new Date().toISOString() } });
    } catch {}
    navigate("/recap");
  };

  if (!session) { navigate("/"); return null; }
  const currentPlayer = session.players[session.currentPlayerIndex];
  const character = currentPlayer ? getCharacter(currentPlayer.characterId) : null;
  const totalCards = session.playedCardIds.length;

  return (
    <div className="min-h-dvh pixel-bg flex flex-col" style={{ maxWidth: "428px", margin: "0 auto" }}>
      {/* Header */}
      <div
        className="px-4 pt-4 pb-3"
        style={{ background: "hsl(265,25%,10%)", borderBottom: "1px solid hsl(265,22%,18%)" }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "hsl(265,28%,22%)", color: "hsl(270,20%,75%)" }}>
              Round {session.roundNumber}
            </span>
            <span className="text-xs" style={{ color: "hsl(270,20%,55%)" }}>
              {totalCards} cards played
            </span>
          </div>
          <button
            data-testid="button-pause"
            onClick={() => setPauseOpen(true)}
            className="text-sm px-3 py-1.5 rounded-lg transition-all"
            style={{ background: "hsl(265,28%,20%)", color: "hsl(270,20%,66%)" }}
          >
            ⏸ Pause
          </button>
        </div>

        {/* Current player */}
        {currentPlayer && (
          <div className="flex items-center gap-2">
            <AvatarImg value={currentPlayer.avatarEmoji} size={36} />
            <div>
              <p className="font-bold text-sm" style={{ color: "hsl(270,40%,96%)" }}>
                {currentPlayer.name || `Player ${session.currentPlayerIndex + 1}`}'s turn
              </p>
              {character && (
                <p className="text-xs" style={{ color: character.color }}>
                  {character.emoji} {character.name}
                </p>
              )}
            </div>
            <div className="ml-auto flex items-center gap-1">
              <span className="text-xs" style={{ color: "hsl(38,100%,64%)" }}>
                ⚡ {currentPlayer.vibeTokens}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Active rules */}
      {session.activeRules.length > 0 && (
        <div className="px-4 py-2" style={{ background: "hsl(265,25%,12%)" }}>
          {session.activeRules.map((rule) => (
            <div key={rule.id} className="text-xs" style={{ color: "hsl(280,60%,75%)" }}>
              📜 {rule.title}: {rule.description}
            </div>
          ))}
        </div>
      )}

      {/* Card area */}
      <div className="flex-1 px-4 py-4 flex flex-col justify-center">
        {currentCard ? (
          <CardView card={currentCard} session={session} />
        ) : (
          <div className="rounded-2xl p-8 text-center" style={{ background: "hsl(265,28%,16%)", border: "2px solid hsl(265,22%,28%)" }}>
            <p className="text-4xl mb-4">🎉</p>
            <p className="font-bold text-lg" style={{ color: "hsl(270,40%,96%)" }}>All cards played!</p>
            <p className="text-sm mt-1" style={{ color: "hsl(270,20%,66%)" }}>What a quest.</p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="px-4 pb-6 pt-3 space-y-3 safe-bottom" style={{ background: "hsl(265,25%,9%)" }}>
        {/* Primary buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            data-testid="button-skip"
            onClick={handleSkip}
            className="py-3.5 rounded-xl font-semibold text-base transition-all duration-200"
            style={{
              background: "hsl(265,28%,20%)",
              color: "hsl(270,20%,75%)",
              border: "2px solid hsl(265,22%,28%)",
            }}
          >
            ⏭ Skip
          </button>
          <button
            data-testid="button-done"
            onClick={handleDone}
            className="py-3.5 rounded-xl font-bold text-base transition-all duration-200 glow-primary"
            style={{
              background: "hsl(96,63%,64%)",
              color: "hsl(265,25%,8%)",
            }}
          >
            ✓ Done
          </button>
        </div>

        {/* Secondary buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            data-testid="button-vibe-token"
            onClick={() => setVibeOpen(true)}
            className="py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            style={{ background: "hsl(265,28%,18%)", color: "hsl(38,100%,64%)" }}
          >
            ⚡ Vibe
          </button>
          <button
            data-testid="button-favorite"
            onClick={handleFavorite}
            className="py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              background: favorited ? "hsl(280,50%,22%)" : "hsl(265,28%,18%)",
              color: favorited ? "hsl(280,75%,70%)" : "hsl(270,20%,66%)",
            }}
          >
            {favorited ? "💜 Saved" : "🤍 Save"}
          </button>
          <button
            data-testid="button-end-game"
            onClick={handleEndGame}
            className="py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            style={{ background: "hsl(265,28%,18%)", color: "hsl(350,80%,60%)" }}
          >
            🏁 End
          </button>
        </div>

        {/* Players strip */}
        <div className="flex gap-2 overflow-x-auto py-1 px-1">
          {session.players.map((p, i) => {
            const char = getCharacter(p.characterId);
            return (
              <div
                key={p.id}
                data-testid={`player-strip-${i}`}
                className="flex flex-col items-center gap-0.5 flex-shrink-0"
                style={{ opacity: i === session.currentPlayerIndex ? 1 : 0.5 }}
              >
                <AvatarImg value={p.avatarEmoji} size={28} />
                <span className="text-xs font-medium" style={{ color: i === session.currentPlayerIndex ? "hsl(96,63%,64%)" : "hsl(270,20%,66%)" }}>
                  {p.name || `P${i + 1}`}
                </span>
                <span className="text-xs" style={{ color: "hsl(38,100%,64%)" }}>⚡{p.vibeTokens}</span>
              </div>
            );
          })}
        </div>
      </div>

      {pauseOpen && (
        <PauseModal
          onClose={() => setPauseOpen(false)}
          onEnd={handleEndGame}
        />
      )}

      {vibeOpen && (
        <VibeTokenModal
          onClose={() => setVibeOpen(false)}
        />
      )}
    </div>
  );
}
