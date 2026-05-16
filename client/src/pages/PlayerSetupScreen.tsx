import { useState } from "react";
import { useLocation } from "wouter";
import { useSession } from "@/state/sessionStore";
import { Player } from "@/types/game";

const AVATARS = ["🦊", "🐻", "🐸", "🐱", "🦋", "🐙", "🦄", "🐺", "🐼", "🦁", "🐯", "🐨"];
const RELATIONSHIP_TAGS = ["Friends", "Couple", "Roommates", "Best Friends", "Strangers", "Siblings", "Coworkers"];

export default function PlayerSetupScreen() {
  const [, navigate] = useLocation();
  const { session, dispatch } = useSession();
  const targetCount = (session as any)?._playerCount ?? 3;
  
  const [players, setPlayers] = useState<Omit<Player, "characterId">[]>(
    Array.from({ length: targetCount }, (_, i) => ({
      id: crypto.randomUUID(),
      name: "",
      avatarEmoji: AVATARS[i % AVATARS.length],
      vibeTokens: 0,
      relationshipTags: [],
      titles: [],
    }))
  );

  function updatePlayer(idx: number, update: Partial<typeof players[0]>) {
    setPlayers((prev) => prev.map((p, i) => (i === idx ? { ...p, ...update } : p)));
  }

  function toggleTag(idx: number, tag: string) {
    const p = players[idx];
    const tags = p.relationshipTags.includes(tag)
      ? p.relationshipTags.filter((t) => t !== tag)
      : [...p.relationshipTags, tag];
    updatePlayer(idx, { relationshipTags: tags });
  }

  function handleNext() {
    const withDefaults = players.map((p) => ({
      ...p,
      name: p.name.trim() || `Player ${players.indexOf(p) + 1}`,
      characterId: "snack_goblin" as const, // placeholder, overridden in char select
    }));
    if (!session) return;
    dispatch({
      type: "SET_SESSION",
      session: {
        ...session,
        players: withDefaults,
      },
    });
    navigate("/characters");
  }

  const canProceed = players.every((p) => true); // name not required

  return (
    <div className="min-h-dvh pixel-bg flex flex-col px-4 py-8">
      <div className="w-full max-w-sm mx-auto">
        <button
          onClick={() => navigate("/create")}
          className="text-sm mb-4 opacity-60 hover:opacity-100"
          style={{ color: "hsl(270,20%,66%)" }}
        >
          ← Back
        </button>

        <h1 className="text-2xl font-black mb-1" style={{ color: "hsl(270,40%,96%)" }}>
          Who's Questing?
        </h1>
        <p className="text-sm mb-6" style={{ color: "hsl(270,20%,66%)" }}>
          Add your crew. Names optional — we can be mysterious.
        </p>

        <div className="space-y-4 mb-6">
          {players.map((player, idx) => (
            <div
              key={player.id}
              data-testid={`player-card-${idx}`}
              className="rounded-xl p-4"
              style={{ background: "hsl(265,28%,14%)", border: "1px solid hsl(265,22%,24%)" }}
            >
              <div className="flex items-center gap-3 mb-3">
                {/* Avatar picker */}
                <div className="relative group">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl cursor-pointer transition-all"
                    style={{ background: "hsl(265,28%,22%)" }}
                  >
                    {player.avatarEmoji}
                  </div>
                  {/* Avatar options */}
                  <div className="absolute top-14 left-0 z-10 hidden group-hover:grid grid-cols-4 gap-1 p-2 rounded-xl"
                    style={{ background: "hsl(265,28%,20%)", border: "1px solid hsl(265,22%,28%)" }}>
                    {AVATARS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => updatePlayer(idx, { avatarEmoji: emoji })}
                        className="text-xl p-1 rounded hover:bg-white/10"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  data-testid={`input-player-name-${idx}`}
                  type="text"
                  placeholder={`Player ${idx + 1}`}
                  value={player.name}
                  onChange={(e) => updatePlayer(idx, { name: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-lg text-sm font-medium outline-none focus:ring-2"
                  style={{
                    background: "hsl(265,22%,22%)",
                    color: "hsl(270,40%,96%)",
                    border: "1px solid hsl(265,22%,28%)",
                    "--tw-ring-color": "hsl(96,63%,64%)",
                  } as any}
                  maxLength={20}
                />
              </div>

              <div className="flex flex-wrap gap-1">
                {RELATIONSHIP_TAGS.slice(0, 5).map((tag) => (
                  <button
                    key={tag}
                    data-testid={`tag-${idx}-${tag}`}
                    onClick={() => toggleTag(idx, tag)}
                    className="px-2 py-1 rounded-full text-xs font-medium transition-all"
                    style={{
                      background: player.relationshipTags.includes(tag)
                        ? "hsl(280,75%,70%)"
                        : "hsl(265,22%,22%)",
                      color: player.relationshipTags.includes(tag)
                        ? "hsl(265,25%,8%)"
                        : "hsl(270,20%,66%)",
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          data-testid="button-next-characters"
          onClick={handleNext}
          className="w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-200 glow-primary"
          style={{
            background: "hsl(96,63%,64%)",
            color: "hsl(265,25%,8%)",
          }}
        >
          Pick Characters →
        </button>
      </div>
    </div>
  );
}
