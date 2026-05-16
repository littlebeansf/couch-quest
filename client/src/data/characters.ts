import { CharacterDef } from "@/types/game";

export const characters: CharacterDef[] = [
  {
    id: "snack_goblin",
    name: "Snack Goblin",
    emoji: "🫃",
    tagline: "Munchies are a lifestyle",
    description: "Unleashes forbidden snack combos and kitchen raids. Their power grows with every bag of chips opened.",
    color: "#FFB84D",
  },
  {
    id: "couch_shaman",
    name: "Couch Shaman",
    emoji: "🧘",
    tagline: "The couch speaks through me",
    description: "Channels deep couch wisdom and fake prophecies. Has not left the couch in three hours but claims enlightenment.",
    color: "#B46CFF",
  },
  {
    id: "rolling_apprentice",
    name: "Rolling Apprentice",
    emoji: "📜",
    tagline: "Craftsmanship is sacred",
    description: "Takes rolling very seriously. Has strong opinions about filter placement and will explain them at length.",
    color: "#8BE35B",
  },
  {
    id: "space_cadet",
    name: "Space Cadet",
    emoji: "🚀",
    tagline: "Wait, what were we talking about?",
    description: "Experiences mild temporal confusion. Excellent at finding cosmic meaning in ceiling patterns.",
    color: "#5BC8E3",
  },
  {
    id: "weed_sommelier",
    name: "Weed Sommelier",
    emoji: "🍷",
    tagline: "Notes of couch and despair",
    description: "Reviews everything like a luxury strain. Uses words like 'terroir' about snacks. Unbearably pretentious, beloved anyway.",
    color: "#E35B8B",
  },
  {
    id: "lighter_thief",
    name: "Lighter Thief",
    emoji: "🔥",
    tagline: "I found this",
    description: "Has never purchased a lighter in their life. Somehow always has one. Refuses to explain this.",
    color: "#FF5C7A",
  },
  {
    id: "dj_gremlin",
    name: "DJ Gremlin",
    emoji: "🎵",
    tagline: "Trust the vibes",
    description: "Controls the aux with chaotic intensity. Every song choice is 'perfect for this moment.' The group disagrees.",
    color: "#5BE3D4",
  },
  {
    id: "conspiracy_uncle",
    name: "Conspiracy Uncle",
    emoji: "🕵️",
    tagline: "Bro, listen...",
    description: "Connects unrelated things with frightening confidence. Pigeons, microwaves, gas station snacks — all part of the same system.",
    color: "#E3B45B",
  },
  {
    id: "nature_wizard",
    name: "Nature Wizard",
    emoji: "🌿",
    tagline: "Touch grass. Seriously.",
    description: "Advocates for fresh air, appreciates simple things, and may walk barefoot on the balcony. Genuinely content.",
    color: "#5BE378",
  },
];

export const getCharacter = (id: string) => characters.find((c) => c.id === id);
