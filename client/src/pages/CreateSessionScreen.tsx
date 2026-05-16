import { useState } from "react";
import { useLocation } from "wouter";
import { useSession } from "@/state/sessionStore";
import { GameMode, Intensity, SessionSettings } from "@/types/game";

const MODES: { id: GameMode; name: string; emoji: string; desc: string }[] = [
  { id: "chill", name: "Chill Mode", emoji: "🛋️", desc: "Low energy, cozy vibes" },
  { id: "chaos", name: "Chaos Mode", emoji: "🌀", desc: "Unpredictable, loud, chaotic" },
  { id: "deep", name: "Deep Mode", emoji: "🌙", desc: "Philosophical, slow, weird" },
  { id: "munchie", name: "Munchie Mode", emoji: "🍕", desc: "All snacks, all the time" },
  { id: "sidequest", name: "Sidequest Mode", emoji: "🗺️", desc: "Mission-based adventures" },
  { id: "couple", name: "Couple Mode", emoji: "💜", desc: "Intimate, small group" },
  { id: "party", name: "Party Mode", emoji: "🎉", desc: "Big group, high energy" },
];

export default function CreateSessionScreen() {
  const [, navigate] = useLocation();
  const { dispatch } = useSession();
  const [mode, setMode] = useState<GameMode>("chill");
  const [intensity, setIntensity] = useState<Intensity>("medium");
  const [soberFriendly, setSoberFriendly] = useState(false);
  const [noConsumption, setNoConsumption] = useState(false);
  const [ediblesCaution, setEdiblesCaution] = useState(false);
  const [playerCount, setPlayerCount] = useState(3);

  function handleNext() {
    // Store settings in session context temporarily as draft
    // We'll pass via navigation state by using a temp session in context
    const settings: SessionSettings = {
      mode,
      intensity,
      soberFriendly: soberFriendly || noConsumption,
      noConsumption,
      ediblesCaution,
    };
    // Store partial setup in context
    dispatch({
      type: "SET_SESSION",
      session: {
        id: crypto.randomUUID(),
        players: [],
        currentPlayerIndex: 0,
        selectedMaterials: [],
        settings,
        playedCardIds: [],
        roundNumber: 1,
        activeRules: [],
        startedAt: new Date().toISOString(),
        cardsSinceChillCheck: 0,
        _playerCount: playerCount,
      } as any,
    });
    navigate("/players");
  }

  return (
    <div className="min-h-dvh pixel-bg flex flex-col px-4 py-8">
      <div className="w-full max-w-sm mx-auto">
        <button
          onClick={() => navigate("/")}
          className="text-sm mb-4 opacity-60 hover:opacity-100"
          style={{ color: "hsl(270,20%,66%)" }}
        >
          ← Back
        </button>

        <h1 className="text-2xl font-black mb-1" style={{ color: "hsl(270,40%,96%)" }}>
          Create Session
        </h1>
        <p className="text-sm mb-6" style={{ color: "hsl(270,20%,66%)" }}>
          Configure your quest before the vibes begin.
        </p>

        {/* Player count */}
        <div className="mb-5">
          <label className="text-sm font-semibold mb-2 block" style={{ color: "hsl(270,20%,75%)" }}>
            Number of Players
          </label>
          <div className="flex gap-2 flex-wrap">
            {[2, 3, 4, 5, 6, 7, 8].map((n) => (
              <button
                key={n}
                data-testid={`button-players-${n}`}
                onClick={() => setPlayerCount(n)}
                className="w-12 h-12 rounded-xl font-bold text-base transition-all duration-200"
                style={{
                  background: playerCount === n ? "hsl(96,63%,64%)" : "hsl(265,28%,16%)",
                  color: playerCount === n ? "hsl(265,25%,8%)" : "hsl(270,20%,75%)",
                  border: `2px solid ${playerCount === n ? "transparent" : "hsl(265,22%,24%)"}`,
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Session mode */}
        <div className="mb-5">
          <label className="text-sm font-semibold mb-2 block" style={{ color: "hsl(270,20%,75%)" }}>
            Session Mode
          </label>
          <div className="grid grid-cols-1 gap-2">
            {MODES.map((m) => (
              <button
                key={m.id}
                data-testid={`button-mode-${m.id}`}
                onClick={() => setMode(m.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200"
                style={{
                  background: mode === m.id ? "hsl(265,28%,22%)" : "hsl(265,28%,14%)",
                  border: `2px solid ${mode === m.id ? "hsl(96,63%,64%)" : "hsl(265,22%,24%)"}`,
                }}
              >
                <span className="text-xl">{m.emoji}</span>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "hsl(270,40%,96%)" }}>{m.name}</p>
                  <p className="text-xs" style={{ color: "hsl(270,20%,55%)" }}>{m.desc}</p>
                </div>
                {mode === m.id && <span className="ml-auto text-sm" style={{ color: "hsl(96,63%,64%)" }}>✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Intensity */}
        <div className="mb-5">
          <label className="text-sm font-semibold mb-2 block" style={{ color: "hsl(270,20%,75%)" }}>
            Intensity
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["low", "medium", "high"] as Intensity[]).map((i) => (
              <button
                key={i}
                data-testid={`button-intensity-${i}`}
                onClick={() => setIntensity(i)}
                className="py-3 rounded-xl font-semibold text-sm capitalize transition-all duration-200"
                style={{
                  background: intensity === i ? "hsl(96,63%,64%)" : "hsl(265,28%,16%)",
                  color: intensity === i ? "hsl(265,25%,8%)" : "hsl(270,20%,75%)",
                  border: `2px solid ${intensity === i ? "transparent" : "hsl(265,22%,24%)"}`,
                }}
              >
                {i === "low" ? "😌 Low" : i === "medium" ? "🔥 Med" : "🌀 High"}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div
          className="rounded-xl p-4 mb-6 space-y-3"
          style={{ background: "hsl(265,28%,14%)", border: "1px solid hsl(265,22%,24%)" }}
        >
          {[
            { id: "sober", label: "Sober-Friendly Mode", desc: "Replaces consumption prompts", value: soberFriendly, set: setSoberFriendly, emoji: "✌️" },
            { id: "no-consumption", label: "No-Consumption Mode", desc: "Zero cannabis references", value: noConsumption, set: setNoConsumption, emoji: "🚫" },
            { id: "edibles-caution", label: "Edibles Caution", desc: "Extra careful edible cards", value: ediblesCaution, set: setEdiblesCaution, emoji: "⚠️" },
          ].map((t) => (
            <div key={t.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: "hsl(270,40%,90%)" }}>
                  {t.emoji} {t.label}
                </p>
                <p className="text-xs" style={{ color: "hsl(270,20%,55%)" }}>{t.desc}</p>
              </div>
              <button
                data-testid={`toggle-${t.id}`}
                onClick={() => t.set(!t.value)}
                className="relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0"
                style={{
                  background: t.value ? "hsl(96,63%,64%)" : "hsl(265,22%,30%)",
                }}
              >
                <div
                  className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300"
                  style={{
                    background: "white",
                    left: t.value ? "calc(100% - 22px)" : "2px",
                  }}
                />
              </button>
            </div>
          ))}
        </div>

        <button
          data-testid="button-next-players"
          onClick={handleNext}
          className="w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-200 glow-primary"
          style={{
            background: "hsl(96,63%,64%)",
            color: "hsl(265,25%,8%)",
          }}
        >
          Add Players →
        </button>
      </div>
    </div>
  );
}
