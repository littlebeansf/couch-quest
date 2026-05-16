import { useSession } from "@/state/sessionStore";
import { Intensity } from "@/types/game";
import { getCharacter } from "@/data/characters";
import { getMaterial } from "@/data/materials";

interface Props {
  onClose: () => void;
  onEnd: () => void;
}

export default function PauseModal({ onClose, onEnd }: Props) {
  const { session, dispatch } = useSession();
  if (!session) return null;

  function setIntensity(intensity: Intensity) {
    dispatch({ type: "UPDATE_SETTINGS", settings: { intensity } });
  }

  function toggleSober() {
    dispatch({ type: "UPDATE_SETTINGS", settings: { soberFriendly: !session!.settings.soberFriendly } });
  }

  function toggleNoConsumption() {
    dispatch({ type: "UPDATE_SETTINGS", settings: { noConsumption: !session!.settings.noConsumption } });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-t-2xl p-6 pb-8"
        style={{ background: "hsl(265,28%,14%)", border: "2px solid hsl(265,22%,24%)", borderBottom: "none" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-black" style={{ color: "hsl(270,40%,96%)" }}>
            ⏸ Paused
          </h2>
          <button
            data-testid="button-resume"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg font-semibold text-sm transition-all"
            style={{ background: "hsl(96,63%,64%)", color: "hsl(265,25%,8%)" }}
          >
            Resume →
          </button>
        </div>

        {/* Intensity control */}
        <div className="mb-4">
          <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "hsl(270,20%,55%)" }}>
            Intensity
          </p>
          <div className="grid grid-cols-3 gap-2">
            {(["low", "medium", "high"] as Intensity[]).map((i) => (
              <button
                key={i}
                data-testid={`pause-intensity-${i}`}
                onClick={() => setIntensity(i)}
                className="py-2 rounded-lg text-sm font-semibold capitalize transition-all"
                style={{
                  background: session.settings.intensity === i ? "hsl(96,63%,64%)" : "hsl(265,28%,22%)",
                  color: session.settings.intensity === i ? "hsl(265,25%,8%)" : "hsl(270,20%,75%)",
                }}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3 mb-5">
          {[
            { label: "Sober-Friendly Mode", value: session.settings.soberFriendly, toggle: toggleSober, emoji: "✌️" },
            { label: "No-Consumption Mode", value: session.settings.noConsumption, toggle: toggleNoConsumption, emoji: "🚫" },
          ].map((t) => (
            <div key={t.label} className="flex items-center justify-between">
              <span className="text-sm" style={{ color: "hsl(270,20%,80%)" }}>
                {t.emoji} {t.label}
              </span>
              <button
                onClick={t.toggle}
                className="relative w-11 h-6 rounded-full transition-all duration-300"
                style={{ background: t.value ? "hsl(96,63%,64%)" : "hsl(265,22%,30%)" }}
              >
                <div
                  className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300"
                  style={{ background: "white", left: t.value ? "calc(100% - 22px)" : "2px" }}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Players overview */}
        <div className="mb-5">
          <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "hsl(270,20%,55%)" }}>
            Players
          </p>
          <div className="grid grid-cols-2 gap-2">
            {session.players.map((p, i) => {
              const char = getCharacter(p.characterId);
              return (
                <div key={p.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg" style={{ background: "hsl(265,28%,20%)" }}>
                  <span>{p.avatarEmoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: "hsl(270,40%,96%)" }}>
                      {p.name || `P${i + 1}`}
                    </p>
                    <p className="text-xs truncate" style={{ color: char?.color }}>
                      {char?.emoji} {char?.name}
                    </p>
                  </div>
                  <span className="text-xs" style={{ color: "hsl(38,100%,64%)" }}>⚡{p.vibeTokens}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Materials */}
        <div className="mb-5">
          <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "hsl(270,20%,55%)" }}>
            Materials
          </p>
          <div className="flex flex-wrap gap-1">
            {session.selectedMaterials.map((id) => {
              const mat = getMaterial(id);
              return mat ? (
                <span key={id} className="text-sm px-2 py-0.5 rounded-full" style={{ background: "hsl(265,28%,22%)", color: "hsl(270,20%,75%)" }}>
                  {mat.emoji} {mat.name}
                </span>
              ) : null;
            })}
          </div>
        </div>

        <button
          data-testid="button-end-from-pause"
          onClick={onEnd}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
          style={{
            background: "hsl(350,40%,20%)",
            color: "hsl(350,80%,60%)",
            border: "1px solid hsl(350,60%,30%)",
          }}
        >
          🏁 End Session
        </button>
      </div>
    </div>
  );
}
