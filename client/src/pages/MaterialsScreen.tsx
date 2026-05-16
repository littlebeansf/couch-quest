import { useState } from "react";
import { useLocation } from "wouter";
import { useSession } from "@/state/sessionStore";
import { materials } from "@/data/materials";
import { MaterialId } from "@/types/game";
import { apiRequest } from "@/lib/queryClient";

export default function MaterialsScreen() {
  const [, navigate] = useLocation();
  const { session, dispatch } = useSession();
  const [selected, setSelected] = useState<MaterialId[]>(["snacks", "water", "lighter"]);

  function toggleMaterial(id: MaterialId) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  }

  async function handleStart() {
    if (!session) return;
    const finalSession = {
      ...session,
      selectedMaterials: selected,
      startedAt: new Date().toISOString(),
    };
    dispatch({ type: "SET_SESSION", session: finalSession });

    // Persist to backend
    try {
      await apiRequest("POST", `/api/sessions/${finalSession.id}`, { data: finalSession });
    } catch (e) {
      console.warn("Could not persist session", e);
    }

    navigate("/game");
  }

  if (!session) { navigate("/"); return null; }

  return (
    <div className="min-h-dvh pixel-bg flex flex-col px-4 py-8">
      <div className="w-full max-w-sm mx-auto">
        <button
          onClick={() => navigate("/characters")}
          className="text-sm mb-4 opacity-60 hover:opacity-100"
          style={{ color: "hsl(270,20%,66%)" }}
        >
          ← Back
        </button>

        <h1 className="text-2xl font-black mb-1" style={{ color: "hsl(270,40%,96%)" }}>
          What's Available?
        </h1>
        <p className="text-sm mb-5" style={{ color: "hsl(270,20%,66%)" }}>
          Select what you have. Materials shape the card pool.
        </p>

        <div className="grid grid-cols-2 gap-2 mb-6">
          {materials.map((mat) => {
            const isSelected = selected.includes(mat.id);
            return (
              <button
                key={mat.id}
                data-testid={`button-material-${mat.id}`}
                onClick={() => toggleMaterial(mat.id)}
                className="flex items-center gap-2 px-3 py-3 rounded-xl text-left transition-all duration-200"
                style={{
                  background: isSelected ? "hsl(265,28%,22%)" : "hsl(265,28%,14%)",
                  border: `2px solid ${isSelected ? "hsl(96,63%,64%)" : "hsl(265,22%,24%)"}`,
                }}
              >
                <span className="text-xl">{mat.emoji}</span>
                <span
                  className="text-xs font-medium leading-tight"
                  style={{ color: isSelected ? "hsl(270,40%,96%)" : "hsl(270,20%,66%)" }}
                >
                  {mat.name}
                </span>
                {isSelected && (
                  <span className="ml-auto text-xs" style={{ color: "hsl(96,63%,64%)" }}>✓</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected count */}
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-sm" style={{ color: "hsl(270,20%,66%)" }}>
            {selected.length} material{selected.length !== 1 ? "s" : ""} selected
          </span>
          <button
            onClick={() => setSelected([])}
            className="text-xs"
            style={{ color: "hsl(270,20%,50%)" }}
          >
            Clear all
          </button>
        </div>

        <button
          data-testid="button-start-game"
          onClick={handleStart}
          className="w-full py-4 rounded-xl font-bold text-xl tracking-wide transition-all duration-200 glow-primary"
          style={{
            background: "hsl(96,63%,64%)",
            color: "hsl(265,25%,8%)",
          }}
        >
          🛋️ Begin the Quest
        </button>
      </div>
    </div>
  );
}
