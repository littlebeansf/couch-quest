import { useState } from "react";
import { useLocation } from "wouter";
import { useSession } from "@/state/sessionStore";
import { characters } from "@/data/characters";
import { CharacterId } from "@/types/game";

export default function CharacterSelectScreen() {
  const [, navigate] = useLocation();
  const { session, dispatch } = useSession();
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [selections, setSelections] = useState<Record<number, CharacterId>>({});

  if (!session) { navigate("/"); return null; }
  const players = session.players;
  const currentPlayer = players[currentPlayerIdx];

  function selectCharacter(charId: CharacterId) {
    setSelections((prev) => ({ ...prev, [currentPlayerIdx]: charId }));
  }

  function handleNext() {
    if (selections[currentPlayerIdx] === undefined) return;
    if (currentPlayerIdx < players.length - 1) {
      setCurrentPlayerIdx((i) => i + 1);
    } else {
      // All players done — update session
      const updatedPlayers = players.map((p, i) => ({
        ...p,
        characterId: selections[i] ?? "snack_goblin" as CharacterId,
      }));
      dispatch({
        type: "SET_SESSION",
        session: { ...session, players: updatedPlayers },
      });
      navigate("/materials");
    }
  }

  const selected = selections[currentPlayerIdx];
  const selectedChar = characters.find((c) => c.id === selected);

  return (
    <div className="min-h-dvh pixel-bg flex flex-col px-4 py-8">
      <div className="w-full max-w-sm mx-auto">
        <button
          onClick={() => currentPlayerIdx === 0 ? navigate("/players") : setCurrentPlayerIdx(i => i - 1)}
          className="text-sm mb-4 opacity-60 hover:opacity-100"
          style={{ color: "hsl(270,20%,66%)" }}
        >
          ← Back
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{currentPlayer?.avatarEmoji ?? "🦊"}</span>
          <h1 className="text-xl font-black" style={{ color: "hsl(270,40%,96%)" }}>
            {currentPlayer?.name || `Player ${currentPlayerIdx + 1}`}'s Character
          </h1>
        </div>
        <p className="text-sm mb-2" style={{ color: "hsl(270,20%,66%)" }}>
          Player {currentPlayerIdx + 1} of {players.length} — pick your archetype
        </p>

        {/* Progress */}
        <div className="flex gap-1 mb-5">
          {players.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full flex-1 transition-all"
              style={{
                background: i < currentPlayerIdx
                  ? "hsl(96,63%,64%)"
                  : i === currentPlayerIdx
                  ? "hsl(280,75%,70%)"
                  : "hsl(265,22%,24%)",
              }}
            />
          ))}
        </div>

        {/* Character grid */}
        <div className="grid grid-cols-1 gap-2 mb-4">
          {characters.map((char) => {
            const isSelected = selected === char.id;
            const takenBy = Object.entries(selections).find(([i, id]) => id === char.id && Number(i) !== currentPlayerIdx);
            return (
              <button
                key={char.id}
                data-testid={`button-char-${char.id}`}
                onClick={() => !takenBy && selectCharacter(char.id)}
                disabled={!!takenBy}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200"
                style={{
                  background: isSelected ? "hsl(265,28%,24%)" : "hsl(265,28%,14%)",
                  border: `2px solid ${isSelected ? char.color : "hsl(265,22%,24%)"}`,
                  opacity: takenBy ? 0.4 : 1,
                }}
              >
                <span className="text-2xl">{char.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm" style={{ color: isSelected ? char.color : "hsl(270,40%,96%)" }}>
                    {char.name}
                  </p>
                  <p className="text-xs truncate" style={{ color: "hsl(270,20%,55%)" }}>
                    {char.tagline}
                  </p>
                </div>
                {isSelected && <span className="text-sm" style={{ color: char.color }}>✓</span>}
                {takenBy && <span className="text-xs" style={{ color: "hsl(270,20%,50%)" }}>taken</span>}
              </button>
            );
          })}
        </div>

        {/* Selected character detail */}
        {selectedChar && (
          <div
            className="rounded-xl p-4 mb-4 card-appear"
            style={{
              background: "hsl(265,28%,18%)",
              border: `2px solid ${selectedChar.color}40`,
            }}
          >
            <p className="text-sm" style={{ color: "hsl(270,20%,72%)" }}>
              {selectedChar.description}
            </p>
          </div>
        )}

        <button
          data-testid="button-confirm-character"
          onClick={handleNext}
          disabled={selected === undefined}
          className="w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-200"
          style={{
            background: selected !== undefined ? "hsl(96,63%,64%)" : "hsl(265,28%,20%)",
            color: selected !== undefined ? "hsl(265,25%,8%)" : "hsl(270,20%,50%)",
          }}
        >
          {currentPlayerIdx < players.length - 1 ? "Next Player →" : "Select Materials →"}
        </button>
      </div>
    </div>
  );
}
