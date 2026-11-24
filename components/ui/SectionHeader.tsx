import { RevealHeading } from "@/components/motion/RevealHeading";
import { Reveal } from "@/components/motion/Reveal";

export function SectionHeader({
  id,
  eyebrow,
  title,
  body,
  align = "left",
  className = "",
  titleClassName = "",
}: {
  id: string;
  eyebrow?: string;
  title: string;
  body?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
}) {
  const center = align === "center";
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-[880px] ${className}`}>
      {eyebrow && (
        <Reveal y={0}>
          <p className="eyebrow mb-6">{eyebrow}</p>
        </Reveal>
      )}
      <RevealHeading id={id} source={title} className={`display h-section ${titleClassName}`} />
      {body && (
        <Reveal delay={0.15}>
          <p className={`lead mt-8 max-w-[640px] ${center ? "mx-auto" : ""}`}>{body}</p>
        </Reveal>
      )}
    </div>
  );
}
