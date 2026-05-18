/** Display order for seller accounts (names unchanged — sort only). */
const ACCOUNT_ORDER = ['ena', 'lyric craft', 'sam', 'lyric studio'];

function normalizeAccountName(name: string) {
  return name.toLowerCase().trim();
}

function getAccountSortIndex(name: string): number {
  const n = normalizeAccountName(name);
  if (n === 'ana' || n.includes('ena')) return 0;
  if (n.includes('lyric craft')) return 1;
  if (n === 'saim' || n.includes('sam')) return 2;
  if (n.includes('lyric studio')) return 3;
  const exact = ACCOUNT_ORDER.indexOf(n);
  return exact >= 0 ? exact : 99;
}

export function sortAccounts<T extends { name: string }>(accounts: T[]): T[] {
  return [...accounts].sort((a, b) => {
    const diff = getAccountSortIndex(a.name) - getAccountSortIndex(b.name);
    if (diff !== 0) return diff;
    return a.name.localeCompare(b.name);
  });
}
