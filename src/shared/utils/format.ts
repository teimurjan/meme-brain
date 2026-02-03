export function formatKarma(karma: number): string {
  if (karma >= 1_000_000) return `${(karma / 1_000_000).toFixed(1)}M`;
  if (karma >= 1_000) return `${(karma / 1_000).toFixed(1)}k`;
  return String(karma);
}
