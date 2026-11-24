/** Renders copy that marks its italic keyword with <em>…</em> (no other markup is honored). */
export function Em({ source }: { source: string }) {
  return (
    <>
      {source
        .split(/(<em>.*?<\/em>)/g)
        .filter(Boolean)
        .map((part, i) => (part.startsWith("<em>") ? <em key={i}>{part.slice(4, -5)}</em> : part))}
    </>
  );
}
