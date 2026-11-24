import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

/**
 * Inlines an official SVG from /public/brand exactly as delivered in anafor-branding,
 * only stripping the fixed width/height so it can scale. Inline (instead of <img>)
 * lets the lifted quarter animate without recreating the mark.
 */
const read = cache((file: string) => {
  const raw = fs.readFileSync(path.join(process.cwd(), "public", "brand", file), "utf8");
  return raw.replace(/\s(width|height)="[^"]*"/g, "").replace("<svg ", '<svg focusable="false" ');
});

export type BrandFile =
  | "anafor-lockup-horizontal-ink.svg"
  | "anafor-lockup-horizontal-white.svg"
  | "anafor-lockup-institutional-white.svg"
  | "anafor-symbol-ink.svg"
  | "anafor-symbol-teal.svg"
  | "anafor-symbol-white.svg";

export function BrandSvg({
  file,
  className,
  decorative = false,
}: {
  file: BrandFile;
  className?: string;
  decorative?: boolean;
}) {
  let svg = read(file);
  if (decorative) {
    svg = svg.replace(/role="img"/, 'aria-hidden="true"').replace(/<title>.*?<\/title>/, "");
  }
  return <span className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}
