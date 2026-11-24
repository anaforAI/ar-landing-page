export type Token = { text: string; em: boolean };

/** Parses "Making engineering impact <em>visible.</em>" into word tokens, keeping the italic keyword. */
export function parseEm(source: string): Token[] {
  const out: Token[] = [];
  const parts = source.split(/(<em>.*?<\/em>)/g).filter(Boolean);
  for (const part of parts) {
    const em = part.startsWith("<em>");
    const text = em ? part.slice(4, -5) : part;
    // keep punctuation attached; split on spaces
    const words = text.split(/(\s+)/);
    for (const w of words) {
      if (!w) continue;
      out.push({ text: w, em });
    }
  }
  return out;
}

export function stripEm(source: string) {
  return source.replace(/<\/?em>/g, "");
}
