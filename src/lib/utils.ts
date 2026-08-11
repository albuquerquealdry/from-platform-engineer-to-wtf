/** Aug 10, 2026 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** 2026-08-10 — for <time datetime> */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** 001, 042 */
export function pad(n: number): string {
  return String(n).padStart(3, '0');
}

/** Rough, and honest about it. */
export function readingTime(body: string | undefined): number {
  const words = (body ?? '').trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export function slugifyCategory(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
