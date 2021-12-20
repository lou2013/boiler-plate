export function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function escapeLike(string) {
  if (string.startsWith('%') || string.endsWith('%'))
    return string.split('%').find((item) => item.length > 0);
  else return `\b${string}\b`;
}
