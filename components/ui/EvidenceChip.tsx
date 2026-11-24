export type EvidenceState = "verified" | "inferred" | "hypothesis";

const glyph: Record<EvidenceState, string> = {
  verified: "marker-verified",
  inferred: "marker-inferred",
  hypothesis: "marker-hypothesis",
};

export function EvidenceChip({
  state,
  label,
  size = "md",
}: {
  state: EvidenceState;
  label: string;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={`ui-label inline-flex w-fit items-center gap-2 rounded-[4px] border border-sand bg-paper text-teal ${
        size === "sm" ? "px-2 py-1 text-[10px]" : "px-2.5 py-1.5"
      }`}
    >
      <span className={`marker ${glyph[state]}`} aria-hidden="true" />
      {label}
    </span>
  );
}
