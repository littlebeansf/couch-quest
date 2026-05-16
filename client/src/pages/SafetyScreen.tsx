import { useLocation } from "wouter";

export default function SafetyScreen() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-dvh pixel-bg flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div
          className="rounded-2xl p-6 mb-6 pixel-border"
          style={{ background: "hsl(265,28%,16%)" }}
        >
          <div className="text-4xl text-center mb-4">🛡️</div>
          <h1 className="text-xl font-bold text-center mb-4" style={{ color: "hsl(270,40%,96%)" }}>
            Before We Begin
          </h1>

          <div className="space-y-3 text-sm" style={{ color: "hsl(270,20%,75%)" }}>
            <p>
              This game is intended for <strong style={{ color: "hsl(96,63%,64%)" }}>adults</strong> in places where cannabis use is legal.
            </p>
            <p>
              All cannabis-related prompts are <strong style={{ color: "hsl(96,63%,64%)" }}>optional</strong>. The game has a sober-friendly mode and a no-consumption mode — both are full experiences.
            </p>
            <p>
              <strong style={{ color: "hsl(280,75%,70%)" }}>Never drive</strong> under the influence. Not as a joke. Not even a little.
            </p>
            <p>
              Do not pressure anyone to consume. Know your limits. Respect the group.
            </p>
            <p>
              The app never recommends quantities or dosage. It never will.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            data-testid="button-understand"
            onClick={() => navigate("/create")}
            className="w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-200 glow-primary"
            style={{
              background: "hsl(96,63%,64%)",
              color: "hsl(265,25%,8%)",
            }}
          >
            I understand — Let's quest
          </button>

          <button
            data-testid="button-sober-mode"
            onClick={() => navigate("/create?soberFriendly=true")}
            className="w-full py-3 rounded-xl font-semibold text-base transition-all duration-200"
            style={{
              background: "hsl(265,28%,16%)",
              color: "hsl(280,75%,70%)",
              border: "2px solid hsl(280,75%,70%)",
            }}
          >
            ✌️ Play in Sober-Friendly Mode
          </button>

          <button
            data-testid="button-back-home"
            onClick={() => navigate("/")}
            className="w-full py-3 rounded-xl font-medium text-sm transition-all duration-200"
            style={{
              background: "transparent",
              color: "hsl(270,20%,66%)",
            }}
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}
