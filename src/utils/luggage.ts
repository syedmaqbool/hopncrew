import type { LuggageItem, OversizedKind } from '../navigation/types';

export type OversizedItemCounts = Partial<Record<OversizedKind, number>>;

export const OVERSIZED_TITLES: Record<OversizedKind, string> = {
  bicycles: 'Bicycles',
  golf: 'Golf Bags',
  snowboard: 'Snowboard Bags',
  ski: 'Ski Bags',
  surfboard: 'Surfboards',
  sports: 'Sports equipment',
  hockey: 'Hockey bags',
  music: 'Musical instruments',
};

/** Build counts object from a luggage array (for prefill). */
export function countsFromLuggage(arr: LuggageItem[]): OversizedItemCounts {
  const out: OversizedItemCounts = {};
  for (const it of arr) if (it.size === 'Oversized' && it.subtype) {
    out[it.subtype] = (out[it.subtype] ?? 0) + (it.count || 0);
  }
  return out;
}
/** Merge Oversized counts into an existing luggage array. Zero = remove. */
export function mergeOversized(base: LuggageItem[], counts: OversizedItemCounts): LuggageItem[] {
  const next = [...base];
  const idx = new Map<string, number>();
  next.forEach((it, i) => { if (it.size === 'Oversized' && it.subtype) idx.set(it.subtype, i); });

  (Object.keys(counts) as (keyof OversizedItemCounts)[]).forEach((k) => {
    const qty = counts[k] ?? 0;
    const i = idx.get(k as string);
    if (qty && qty > 0) {
      const item: LuggageItem = { size: 'Oversized', subtype: k as any, title: String(k), count: qty };
      if (i != null) next[i] = { ...next[i], ...item };
      else next.push(item);
    } else if (i != null) {
      next.splice(i, 1);
    }
  });

  return next;
}

/** Optional: make a short summary like "L 1 · Carry-on 2 · Golf 1". */
export function summarizeLuggage(arr: LuggageItem[]): string {
  return arr
    .map((it) => {
      const label = it.size === 'Oversized' ? (it.title ?? 'Oversized') : it.size;
      const n = it.count ?? 0;
      return `${label} ${n}`;
    })
    .join(' · ');
}
