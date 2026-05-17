import { useLocation } from "wouter";
import { useSession } from "@/state/sessionStore";
import { useEffect, useRef, useState } from "react";
import { assetUrl } from "@/lib/assetUrl";

// Audio controller hook – auto-plays on mount (if allowed), survives re-renders
function useAmbientAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = new Audio(assetUrl("/audio/reggae-chill.mp3"));
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    // Try autoplay (may be blocked by browser policy, gracefully falls back)
    const tryPlay = () => {
      audio.play().then(() => setPlaying(true)).catch(() => {
        // Blocked — we'll let the user trigger it via the button
        setPlaying(false);
      });
    };

    tryPlay();

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }

  function toggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !muted;
    audio.muted = next;
    setMuted(next);
    // If muted and not playing, start playing muted so toggling unmute works
    if (!playing) {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }

  return { playing, muted, toggle, toggleMute };
}

// Floating particle dots
function FloatingDots() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {[...Array(14)].map((_, i) => {
        const colors = [
          "hsl(96,63%,64%)",
          "hsl(280,75%,70%)",
          "hsl(38,100%,64%)",
          "hsl(200,80%,70%)",
        ];
        const size = 3 + (i % 4) * 2.5;
        return (
          <div
            key={i}
            className="absolute rounded-full smoke-particle"
            style={{
              width: size,
              height: size,
              background: colors[i % colors.length],
              left: `${5 + i * 7}%`,
              bottom: `${8 + (i % 5) * 14}%`,
              opacity: 0.35 + (i % 3) * 0.12,
              animationDelay: `${i * 0.55}s`,
              animationDuration: `${5 + (i % 3) * 1.5}s`,
            }}
          />
        );
      })}
    </div>
  );
}

// Logo SVG (unchanged)
function CouchQuestLogo() {
  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 48 48" width="44" height="44" aria-label="Couch Quest logo" role="img">
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

// Audio controls floating badge
function AudioBadge({ playing, muted, onToggle, onMute }: {
  playing: boolean;
  muted: boolean;
  onToggle: () => void;
  onMute: () => void;
}) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full"
      style={{
        background: "hsl(265,28%,14%)",
        border: "1px solid hsl(265,22%,26%)",
      }}
    >
      {/* Animated bars when playing */}
      <div className="flex items-end gap-0.5 h-4" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-1 rounded-full"
            style={{
              background: playing && !muted ? "hsl(96,63%,64%)" : "hsl(265,20%,40%)",
              height: playing && !muted ? undefined : "4px",
              animation: playing && !muted ? `audioBar ${0.6 + i * 0.15}s ease-in-out infinite alternate` : "none",
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>

      <span className="text-xs font-medium" style={{ color: "hsl(270,20%,66%)" }}>
        {playing && !muted ? "Vibing" : muted ? "Muted" : "Music"}
      </span>

      <button
        onClick={onMute}
        title={muted ? "Unmute" : "Mute"}
        className="text-sm transition-opacity hover:opacity-80"
        style={{ color: muted ? "hsl(270,20%,46%)" : "hsl(270,20%,66%)" }}
      >
        {muted ? "🔇" : "🔉"}
      </button>

      <button
        onClick={onToggle}
        title={playing ? "Pause music" : "Play music"}
        className="text-sm transition-opacity hover:opacity-80"
        style={{ color: playing ? "hsl(96,63%,64%)" : "hsl(270,20%,50%)" }}
      >
        {playing ? "⏸" : "▶️"}
      </button>
    </div>
  );
}

// Animated home scene illustration
function HomeIllustration() {
  return (
    <div className="w-full relative" style={{ maxWidth: 380 }}>
      {/* Floating glow behind image */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, hsl(280,60%,30%,0.5) 0%, transparent 70%)",
          filter: "blur(20px)",
          transform: "translateY(8px)",
          zIndex: 0,
        }}
      />
      <img
        src={assetUrl("/home-scene.png")}
        alt="Cozy cartoon couch scene with quirky characters"
        className="w-full rounded-2xl relative"
        style={{
          boxShadow: "0 0 32px hsl(280,60%,20%,0.8), 0 0 64px hsl(96,63%,20%,0.3)",
          zIndex: 1,
          // Gentle floating animation
          animation: "floatScene 6s ease-in-out infinite",
        }}
        draggable={false}
      />
    </div>
  );
}

export default function HomeScreen() {
  const [, navigate] = useLocation();
  const { session } = useSession();
  const [hasSession, setHasSession] = useState(false);
  const { playing, muted, toggle, toggleMute } = useAmbientAudio();

  useEffect(() => {
    if (session && !session.endedAt) {
      setHasSession(true);
    }
  }, [session]);

  return (
    <div className="min-h-dvh pixel-bg flex flex-col items-center justify-center px-4 py-8 relative">
      <FloatingDots />

      {/* Audio badge — top right */}
      <div className="fixed top-4 right-4 z-20">
        <AudioBadge playing={playing} muted={muted} onToggle={toggle} onMute={toggleMute} />
      </div>

      <div className="w-full max-w-sm flex flex-col items-center gap-5 relative z-10">
        <CouchQuestLogo />
        <HomeIllustration />

        {/* Main CTA */}
        <button
          data-testid="button-start-quest"
          onClick={() => navigate("/safety")}
          className="w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-200 glow-primary"
          style={{ background: "hsl(96,63%,64%)", color: "hsl(265,25%,8%)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(96,63%,72%)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(96,63%,64%)")}
        >
          🛋️ Start Quest
        </button>

        {hasSession && (
          <button
            data-testid="button-continue-session"
            onClick={() => navigate("/game")}
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
