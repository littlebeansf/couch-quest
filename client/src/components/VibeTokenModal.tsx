import { AvatarImg } from "@/components/AvatarImg";
import { useState } from "react";
import { useSession } from "@/state/sessionStore";
import { getCharacter } from "@/data/characters";

interface Props {
  onClose: () => void;
}

export default function VibeTokenModal({ onClose }: Props) {
  const { session, dispatch } = useSession();
  const [given, setGiven] = useState<string | null>(null);

  if (!session) return null;

  function giveToken(toId: string) {
    const currentPlayer = session!.players[session!.currentPlayerIndex];
    dispatch({
      type: "GIVE_VIBE_TOKEN",
      fromPlayerId: currentPlayer.id,
      toPlayerId: toId,
    });
    setGiven(toId);
    setTimeout(onClose, 1000);
  }

  const currentPlayer = session.players[session.currentPlayerIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-5"
        style={{ background: "hsl(265,28%,16%)", border: "2px solid hsl(38,100%,64%)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-black text-center mb-1" style={{ color: "hsl(38,100%,64%)" }}>
          ⚡ Give a Vibe Token
        </h2>
        <p className="text-xs text-center mb-4" style={{ color: "hsl(270,20%,66%)" }}>
          Award to whoever brought the most energy to this card
        </p>

        <div className="space-y-2">
          {session.players
            .filter((p) => p.id !== currentPlayer.id)
            .map((p) => {
              const char = getCharacter(p.characterId);
              const wasGiven = given === p.id;
              return (
                <button
                  key={p.id}
                  data-testid={`give-token-${p.id}`}
                  onClick={() => giveToken(p.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                  style={{
                    background: wasGiven ? "hsl(38,50%,20%)" : "hsl(265,28%,22%)",
                    border: `2px solid ${wasGiven ? "hsl(38,100%,64%)" : "hsl(265,22%,28%)"}`,
                  }}
                >
                  <AvatarImg value={p.avatarEmoji} size={36} />
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-sm" style={{ color: "hsl(270,40%,96%)" }}>
                      {p.name || `Player`}
                    </p>
                    <p className="text-xs" style={{ color: char?.color }}>
                      {char?.emoji} {char?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: "hsl(38,100%,64%)" }}>
                      ⚡ {p.vibeTokens}{wasGiven ? " +1" : ""}
                    </p>
                  </div>
                </button>
              );
            })}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-3 py-2 rounded-lg text-sm transition-all"
          style={{ color: "hsl(270,20%,55%)" }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
