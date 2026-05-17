/**
 * AvatarImg — renders a cartoon avatar image if the value is a known avatar ID,
 * otherwise falls back to rendering it as text (emoji or string).
 */

import { AVATAR_CHARACTERS } from "@/pages/PlayerSetupScreen";

interface AvatarImgProps {
  value: string;          // avatarEmoji field — may be an ID like "snack-goblin" or legacy emoji
  size?: number;          // px, default 40
  className?: string;
  style?: React.CSSProperties;
}

export function AvatarImg({ value, size = 40, className = "", style }: AvatarImgProps) {
  const avatarDef = AVATAR_CHARACTERS.find((a) => a.id === value);

  if (avatarDef) {
    return (
      <img
        src={avatarDef.src}
        alt={avatarDef.name}
        width={size}
        height={size}
        className={`object-cover rounded-xl flex-shrink-0 ${className}`}
        style={style}
        draggable={false}
      />
    );
  }

  // Legacy emoji / unknown
  return (
    <span
      className={className}
      style={{ fontSize: size * 0.55, lineHeight: 1, ...style }}
    >
      {value}
    </span>
  );
}
