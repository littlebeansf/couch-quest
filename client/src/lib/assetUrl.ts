/**
 * Resolves a public asset path against Vite's BASE_URL.
 * Vite replaces import.meta.env.BASE_URL at build time with the configured base:
 *   - Local / Perplexity:  "/"
 *   - GitHub Pages:        "/couch-quest/"
 *
 * Usage:  assetUrl("/avatars/avatar-snack-goblin.png")
 * Local:  "/avatars/avatar-snack-goblin.png"
 * Pages:  "/couch-quest/avatars/avatar-snack-goblin.png"
 */
export function assetUrl(path: string): string {
  // import.meta.env.BASE_URL is replaced by Vite at build time.
  // It always ends with "/", e.g. "/" or "/couch-quest/".
  const base = import.meta.env.BASE_URL;
  // Remove leading slash from path so we don't double up
  const p = path.startsWith("/") ? path.slice(1) : path;
  return `${base}${p}`;
}
