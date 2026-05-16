import { useLocation } from "wouter";
import { useSession } from "@/state/sessionStore";
import { apiRequest } from "@/lib/queryClient";
import { useEffect, useState } from "react";

// Smoke particles component
function SmokeParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="smoke-particle bg-purple-500/10"
          style={{
            width: 60 + i * 20,
            height: 60 + i * 20,
            left: `${10 + i * 15}%`,
            bottom: `${10 + (i % 3) * 12}%`,
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${4 + i * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
}

// Couch scene SVG
function CouchScene() {
  return (
    <div className="w-full flex justify-center mb-4">
      <svg
        viewBox="0 0 280 120"
        className="w-64 h-28"
        aria-label="Cozy couch scene"
        role="img"
      >
        {/* Floor */}
        <rect x="0" y="100" width="280" height="20" fill="hsl(265,22%,16%)" rx="0" />
        {/* Couch body */}
        <rect x="30" y="64" width="220" height="40" fill="hsl(280,30%,26%)" rx="10" />
        {/* Couch back */}
        <rect x="30" y="40" width="220" height="28" fill="hsl(280,30%,32%)" rx="8" />
        {/* Armrests */}
        <rect x="24" y="52" width="22" height="52" fill="hsl(280,30%,28%)" rx="6" />
        <rect x="234" y="52" width="22" height="52" fill="hsl(280,30%,28%)" rx="6" />
        {/* Cushion lines */}
        <line x1="140" y1="64" x2="140" y2="104" stroke="hsl(265,22%,22%)" strokeWidth="2" />
        <line x1="96" y1="64" x2="96" y2="104" stroke="hsl(265,22%,22%)" strokeWidth="1.5" opacity="0.5" />
        <line x1="184" y1="64" x2="184" y2="104" stroke="hsl(265,22%,22%)" strokeWidth="1.5" opacity="0.5" />
        {/* Pillows */}
        <rect x="38" y="44" width="34" height="20" fill="hsl(96,50%,50%)" rx="5" opacity="0.8" />
        <rect x="208" y="44" width="34" height="20" fill="hsl(280,60%,60%)" rx="5" opacity="0.8" />
        {/* Person silhouette */}
        <ellipse cx="140" cy="58" rx="20" ry="16" fill="hsl(265,20%,35%)" />
        <circle cx="140" cy="40" r="10" fill="hsl(265,20%,35%)" />
        {/* Smoke wisps */}
        <path d="M200 50 Q205 40 200 30 Q195 20 200 10" stroke="hsl(270,30%,80%)" strokeWidth="1.5" fill="none" opacity="0.3" />
        <path d="M210 55 Q215 44 210 34 Q205 24 210 14" stroke="hsl(270,30%,80%)" strokeWidth="1" fill="none" opacity="0.2" />
        {/* Stars */}
        <circle cx="30" cy="15" r="1.5" fill="hsl(96,63%,64%)" />
        <circle cx="60" cy="8" r="1" fill="hsl(280,75%,70%)" />
        <circle cx="220" cy="12" r="1.5" fill="hsl(38,100%,64%)" />
        <circle cx="250" cy="20" r="1" fill="hsl(96,63%,64%)" />
        <circle cx="15" cy="30" r="1" fill="hsl(280,75%,70%)" />
      </svg>
    </div>
  );
}

// Logo SVG
function CouchQuestLogo() {
  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 48 48" width="48" height="48" aria-label="Couch Quest logo" role="img">
        <rect x="4" y="18" width="40" height="22" rx="5" fill="hsl(280,30%,26%)" />
        <rect x="4" y="12" width="40" height="10" rx="4" fill="hsl(280,30%,32%)" />
        <rect x="2" y="16" width="10" height="24" rx="4" fill="hsl(280,30%,28%)" />
        <rect x="36" y="16" width="10" height="24" rx="4" fill="hsl(280,30%,28%)" />
        <circle cx="24" cy="26" r="6" fill="hsl(96,63%,64%)" />
        <path d="M21 26 L24 29 L28 23" stroke="hsl(265,25%,8%)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <h1 className="text-4xl font-black tracking-tight text-white neon-text" style={{ fontFamily: "var(--font-sans)" }}>
        <span style={{ color: "hsl(96,63%,64%)" }}>Couch</span>{" "}
        <span style={{ color: "hsl(280,75%,70%)" }}>Quest</span>
      </h1>
      <p className="text-xs font-medium tracking-widest uppercase text-center" style={{ color: "hsl(270,20%,66%)", letterSpacing: "0.08em" }}>
        The party game for when the couch becomes a quest
      </p>
    </div>
  );
}

export default function HomeScreen() {
  const [, navigate] = useLocation();
  const { session } = useSession();
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    if (session && !session.endedAt) {
      setHasSession(true);
    }
  }, [session]);

  function handleStart() {
    navigate("/safety");
  }

  function handleContinue() {
    navigate("/game");
  }

  return (
    <div className="min-h-dvh pixel-bg flex flex-col items-center justify-center px-4 py-8 relative">
      <SmokeParticles />

      <div className="w-full max-w-sm flex flex-col items-center gap-6 relative z-10">
        <CouchQuestLogo />
        <CouchScene />

        {/* Main CTA */}
        <button
          data-testid="button-start-quest"
          onClick={handleStart}
          className="w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-200 glow-primary"
          style={{
            background: "hsl(96,63%,64%)",
            color: "hsl(265,25%,8%)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(96,63%,72%)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(96,63%,64%)")}
        >
          🛋️ Start Quest
        </button>

        {hasSession && (
          <button
            data-testid="button-continue-session"
            onClick={handleContinue}
            className="w-full py-3 rounded-xl font-semibold text-base transition-all duration-200"
            style={{
              background: "hsl(265,28%,20%)",
              color: "hsl(280,75%,70%)",
              border: "2px solid hsl(280,75%,70%)",
            }}
          >
            ⚡ Continue Session
          </button>
        )}

        <div className="w-full grid grid-cols-2 gap-3">
          <button
            data-testid="button-settings"
            className="py-3 rounded-xl font-medium text-sm transition-all duration-200"
            style={{
              background: "hsl(265,28%,16%)",
              color: "hsl(270,20%,66%)",
              border: "1px solid hsl(265,22%,24%)",
            }}
          >
            ⚙️ Settings
          </button>
          <button
            data-testid="button-safety-info"
            onClick={() => navigate("/safety")}
            className="py-3 rounded-xl font-medium text-sm transition-all duration-200"
            style={{
              background: "hsl(265,28%,16%)",
              color: "hsl(270,20%,66%)",
              border: "1px solid hsl(265,22%,24%)",
            }}
          >
            🛡️ Safety Info
          </button>
        </div>

        <p className="text-xs text-center" style={{ color: "hsl(270,20%,46%)" }}>
          For adults in places where cannabis is legal. All prompts optional.
        </p>
      </div>
    </div>
  );
}
