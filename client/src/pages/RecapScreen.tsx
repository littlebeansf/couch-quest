import { AvatarImg } from "@/components/AvatarImg";
import { useLocation } from "wouter";
import { useSession } from "@/state/sessionStore";
import { getCharacter } from "@/data/characters";
import { getCard } from "@/data/cards";
import { generateSessionTitle, getMVP, getMostSuspicious, getSnackEnergy } from "@/engine/recapEngine";
import { apiRequest } from "@/lib/queryClient";

export default function RecapScreen() {
  const [, navigate] = useLocation();
  const { session, dispatch } = useSession();

  if (!session) {
    navigate("/");
    return null;
  }

  const title = generateSessionTitle(session);
  const mvp = getMVP(session);
  const suspicious = getMostSuspicious(session);
  const snackEnergy = getSnackEnergy(session);
  const favoriteCard = session.favoriteCardId ? getCard(session.favoriteCardId) : null;
  const totalCards = session.playedCardIds.length;

  const sortedPlayers = [...session.players].sort((a, b) => b.vibeTokens - a.vibeTokens);

  async function handleNewGame() {
    try {
      await apiRequest("DELETE", `/api/sessions/${session!.id}`);
    } catch {}
    dispatch({ type: "CLEAR_SESSION" });
    navigate("/");
  }

  return (
    <div className="min-h-dvh pixel-bg flex flex-col px-4 py-8">
      <div className="w-full max-w-sm mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="text-2xl font-black mb-1 leading-tight" style={{ color: "hsl(270,40%,96%)" }}>
            Session Complete
          </h1>
          <div
            className="inline-block px-4 py-2 rounded-full mt-2"
            style={{ background: "hsl(265,28%,20%)", border: "1px solid hsl(265,22%,28%)" }}
          >
            <p className="text-sm font-semibold italic" style={{ color: "hsl(280,75%,70%)" }}>
              "{title}"
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { label: "Cards Played", value: totalCards, emoji: "🃏" },
            { label: "Rounds", value: session.roundNumber, emoji: "🔄" },
            { label: "Players", value: session.players.length, emoji: "👥" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-3 text-center"
              style={{ background: "hsl(265,28%,16%)", border: "1px solid hsl(265,22%,24%)" }}
            >
              <p className="text-2xl mb-1">{s.emoji}</p>
              <p className="text-xl font-black" style={{ color: "hsl(270,40%,96%)" }}>{s.value}</p>
              <p className="text-xs" style={{ color: "hsl(270,20%,55%)" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* MVP */}
        {mvp && (
          <div
            className="rounded-xl p-4 mb-3"
            style={{ background: "hsl(265,28%,16%)", border: "2px solid hsl(96,63%,50%)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "hsl(96,63%,64%)" }}>
              ⭐ MVP — Most Vibe Tokens
            </p>
            <div className="flex items-center gap-3">
              <AvatarImg value={mvp.avatarEmoji} size={48} />
              <div>
                <p className="font-bold" style={{ color: "hsl(270,40%,96%)" }}>
                  {mvp.name || "The Mysterious One"}
                </p>
                <p className="text-sm" style={{ color: "hsl(96,63%,64%)" }}>
                  ⚡ {mvp.vibeTokens} vibe tokens
                </p>
                {getCharacter(mvp.characterId) && (
                  <p className="text-xs" style={{ color: "hsl(270,20%,66%)" }}>
                    {getCharacter(mvp.characterId)!.emoji} {getCharacter(mvp.characterId)!.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Most suspicious */}
        {suspicious && (
          <div
            className="rounded-xl p-4 mb-3"
            style={{ background: "hsl(265,28%,16%)", border: "1px solid hsl(265,22%,24%)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "hsl(350,80%,60%)" }}>
              🔍 Most Suspicious Energy
            </p>
            <div className="flex items-center gap-3">
              <AvatarImg value={suspicious.avatarEmoji} size={40} />
              <div>
                <p className="font-semibold text-sm" style={{ color: "hsl(270,40%,96%)" }}>
                  {suspicious.name || "Someone"}
                </p>
                <p className="text-xs" style={{ color: "hsl(270,20%,55%)" }}>We know what they did.</p>
              </div>
            </div>
          </div>
        )}

        {/* Snack energy */}
        <div
          className="rounded-xl p-4 mb-3"
          style={{ background: "hsl(265,28%,16%)", border: "1px solid hsl(265,22%,24%)" }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "hsl(38,100%,64%)" }}>
            🍕 Snack Energy
          </p>
          <p className="font-black text-xl" style={{ color: "hsl(38,100%,64%)" }}>{snackEnergy}</p>
        </div>

        {/* Leaderboard */}
        <div
          className="rounded-xl p-4 mb-3"
          style={{ background: "hsl(265,28%,16%)", border: "1px solid hsl(265,22%,24%)" }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "hsl(270,20%,55%)" }}>
            Vibe Rankings
          </p>
          {sortedPlayers.map((p, i) => {
            const char = getCharacter(p.characterId);
            return (
              <div key={p.id} className="flex items-center gap-2 py-1.5">
                <span className="text-sm w-5 text-center" style={{ color: "hsl(270,20%,50%)" }}>
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}
                </span>
                <AvatarImg value={p.avatarEmoji} size={30} />
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: "hsl(270,40%,96%)" }}>
                    {p.name || `Player ${i + 1}`}
                  </p>
                  {char && (
                    <p className="text-xs" style={{ color: char.color }}>
                      {char.emoji} {char.name}
                    </p>
                  )}
                  {p.titles.length > 0 && (
                    <p className="text-xs mt-0.5" style={{ color: "hsl(280,60%,70%)" }}>
                      {p.titles.join(" · ")}
                    </p>
                  )}
                </div>
                <span className="font-bold text-sm" style={{ color: "hsl(38,100%,64%)" }}>
                  ⚡ {p.vibeTokens}
                </span>
              </div>
            );
          })}
        </div>

        {/* Favorite card */}
        {favoriteCard && (
          <div
            className="rounded-xl p-4 mb-5"
            style={{ background: "hsl(265,28%,16%)", border: "2px solid hsl(280,75%,50%)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "hsl(280,75%,70%)" }}>
              💜 Saved Card
            </p>
            <p className="font-bold text-sm mb-1" style={{ color: "hsl(270,40%,96%)" }}>
              {favoriteCard.title}
            </p>
            <p className="text-xs" style={{ color: "hsl(270,20%,66%)" }}>
              {favoriteCard.prompt.slice(0, 80)}...
            </p>
          </div>
        )}

        {/* Mode/settings summary */}
        <div
          className="rounded-xl p-3 mb-6 flex flex-wrap gap-2"
          style={{ background: "hsl(265,28%,13%)" }}
        >
          <span className="text-xs px-2 py-1 rounded-full capitalize" style={{ background: "hsl(265,28%,22%)", color: "hsl(270,20%,75%)" }}>
            🎮 {session.settings.mode}
          </span>
          <span className="text-xs px-2 py-1 rounded-full capitalize" style={{ background: "hsl(265,28%,22%)", color: "hsl(270,20%,75%)" }}>
            🔥 {session.settings.intensity}
          </span>
          {session.settings.soberFriendly && (
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: "hsl(188,40%,18%)", color: "hsl(188,63%,70%)" }}>
              ✌️ Sober-friendly
            </span>
          )}
        </div>

        <button
          data-testid="button-new-game"
          onClick={handleNewGame}
          className="w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-200 glow-primary"
          style={{
            background: "hsl(96,63%,64%)",
            color: "hsl(265,25%,8%)",
          }}
        >
          🛋️ New Quest
        </button>
      </div>
    </div>
  );
}
