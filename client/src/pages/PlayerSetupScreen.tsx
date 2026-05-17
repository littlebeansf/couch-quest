import { useState } from "react";
import { useLocation } from "wouter";
import { useSession } from "@/state/sessionStore";
import { Player } from "@/types/game";

// 12 cartoon character avatars — each has an id, image path, and display name
export const AVATAR_CHARACTERS = [
  { id: "snack-goblin",       src: "/avatars/avatar-snack-goblin.png",       name: "Snack Goblin" },
  { id: "couch-shaman",       src: "/avatars/avatar-couch-shaman.png",       name: "Couch Shaman" },
  { id: "rolling-apprentice", src: "/avatars/avatar-rolling-apprentice.png", name: "Rolling Apprentice" },
  { id: "space-cadet",        src: "/avatars/avatar-space-cadet.png",        name: "Space Cadet" },
  { id: "weed-sommelier",     src: "/avatars/avatar-weed-sommelier.png",     name: "Weed Sommelier" },
  { id: "lighter-thief",      src: "/avatars/avatar-lighter-thief.png",      name: "Lighter Thief" },
  { id: "dj-gremlin",         src: "/avatars/avatar-dj-gremlin.png",         name: "DJ Gremlin" },
  { id: "conspiracy-uncle",   src: "/avatars/avatar-conspiracy-uncle.png",   name: "Conspiracy Uncle" },
  { id: "nature-wizard",      src: "/avatars/avatar-nature-wizard.png",      name: "Nature Wizard" },
  { id: "vibe-oracle",        src: "/avatars/avatar-vibe-oracle.png",        name: "Vibe Oracle" },
  { id: "munchie-knight",     src: "/avatars/avatar-munchie-knight.png",     name: "Munchie Knight" },
  { id: "chill-sloth",        src: "/avatars/avatar-chill-sloth.png",        name: "Chill Sloth" },
];

const RELATIONSHIP_TAGS = ["Friends", "Couple", "Roommates", "Best Friends", "Strangers", "Siblings", "Coworkers"];

type AvatarId = typeof AVATAR_CHARACTERS[number]["id"];

interface PlayerDraft {
  id: string;
  name: string;
  avatarId: AvatarId;
  vibeTokens: number;
  relationshipTags: string[];
  titles: string[];
}

// Full-screen avatar picker modal
function AvatarPicker({
  current,
  onSelect,
  onClose,
}: {
  current: AvatarId;
  onSelect: (id: AvatarId) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-t-3xl p-5 pb-8"
        style={{ background: "hsl(265,28%,12%)", border: "1px solid hsl(265,22%,26%)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base" style={{ color: "hsl(270,40%,94%)" }}>
            Pick your character
          </h3>
          <button
            onClick={onClose}
            className="text-sm px-3 py-1 rounded-full"
            style={{ background: "hsl(265,22%,20%)", color: "hsl(270,20%,60%)" }}
          >
            Done
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {AVATAR_CHARACTERS.map((av) => {
            const selected = av.id === current;
            return (
              <button
                key={av.id}
                onClick={() => { onSelect(av.id as AvatarId); onClose(); }}
                className="flex flex-col items-center gap-1 rounded-xl p-1.5 transition-all"
                style={{
                  background: selected ? "hsl(96,50%,20%)" : "hsl(265,22%,18%)",
                  border: selected ? "2px solid hsl(96,63%,64%)" : "2px solid transparent",
                  outline: "none",
                }}
                title={av.name}
              >
                <img
                  src={av.src}
                  alt={av.name}
                  className="w-14 h-14 rounded-lg object-cover"
                  style={{
                    filter: selected ? "drop-shadow(0 0 6px hsl(96,63%,50%))" : "none",
                  }}
                />
                <span
                  className="text-center leading-tight"
                  style={{
                    fontSize: "9px",
                    fontWeight: 600,
                    color: selected ? "hsl(96,63%,70%)" : "hsl(270,20%,55%)",
                    wordBreak: "break-word",
                    width: "100%",
                  }}
                >
                  {av.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function PlayerSetupScreen() {
  const [, navigate] = useLocation();
  const { session, dispatch } = useSession();
  const targetCount = (session as any)?._playerCount ?? 3;

  const [players, setPlayers] = useState<PlayerDraft[]>(
    Array.from({ length: targetCount }, (_, i) => ({
      id: crypto.randomUUID(),
      name: "",
      avatarId: AVATAR_CHARACTERS[i % AVATAR_CHARACTERS.length].id as AvatarId,
      vibeTokens: 0,
      relationshipTags: [],
      titles: [],
    }))
  );

  const [pickerOpen, setPickerOpen] = useState<number | null>(null);

  function updatePlayer(idx: number, update: Partial<PlayerDraft>) {
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
    const withDefaults = players.map((p, i) => ({
      id: p.id,
      name: p.name.trim() || `Player ${i + 1}`,
      avatarEmoji: p.avatarId, // store avatarId in the avatarEmoji field for compat
      vibeTokens: p.vibeTokens,
      relationshipTags: p.relationshipTags,
      titles: p.titles,
      characterId: "snack_goblin" as const,
    }));
    if (!session) return;
    dispatch({
      type: "SET_SESSION",
      session: { ...session, players: withDefaults },
    });
    navigate("/characters");
  }

  const activePickerPlayer = pickerOpen !== null ? players[pickerOpen] : null;

  return (
    <>
      {/* Avatar picker modal */}
      {pickerOpen !== null && activePickerPlayer && (
        <AvatarPicker
          current={activePickerPlayer.avatarId}
          onSelect={(id) => updatePlayer(pickerOpen, { avatarId: id })}
          onClose={() => setPickerOpen(null)}
        />
      )}

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
            {players.map((player, idx) => {
              const avatarDef = AVATAR_CHARACTERS.find((a) => a.id === player.avatarId)!;
              return (
                <div
                  key={player.id}
                  data-testid={`player-card-${idx}`}
                  className="rounded-xl p-4"
                  style={{ background: "hsl(265,28%,14%)", border: "1px solid hsl(265,22%,24%)" }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    {/* Avatar button — tap to open picker */}
                    <button
                      onClick={() => setPickerOpen(idx)}
                      className="relative flex-shrink-0 rounded-xl overflow-hidden transition-all"
                      style={{
                        width: 52,
                        height: 52,
                        border: "2px solid hsl(265,22%,32%)",
                        background: "hsl(265,28%,18%)",
                      }}
                      title="Change avatar"
                    >
                      <img
                        src={avatarDef.src}
                        alt={avatarDef.name}
                        className="w-full h-full object-cover"
                      />
                      {/* Edit overlay */}
                      <div
                        className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                        style={{ background: "rgba(0,0,0,0.55)" }}
                      >
                        <span style={{ fontSize: 18 }}>✏️</span>
                      </div>
                    </button>

                    <div className="flex-1">
                      <input
                        data-testid={`input-player-name-${idx}`}
                        type="text"
                        placeholder={`Player ${idx + 1}`}
                        value={player.name}
                        onChange={(e) => updatePlayer(idx, { name: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg text-sm font-medium outline-none focus:ring-2"
                        style={{
                          background: "hsl(265,22%,22%)",
                          color: "hsl(270,40%,96%)",
                          border: "1px solid hsl(265,22%,28%)",
                          "--tw-ring-color": "hsl(96,63%,64%)",
                        } as any}
                        maxLength={20}
                      />
                      <p
                        className="text-xs mt-1 truncate"
                        style={{ color: "hsl(270,20%,50%)" }}
                      >
                        {avatarDef.name}
                      </p>
                    </div>
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
              );
            })}
          </div>

          <button
            data-testid="button-next-characters"
            onClick={handleNext}
            className="w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-200 glow-primary"
            style={{ background: "hsl(96,63%,64%)", color: "hsl(265,25%,8%)" }}
          >
            Pick Characters →
          </button>
        </div>
      </div>
    </>
  );
}
