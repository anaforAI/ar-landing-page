import type { SVGProps } from "react";
import { siGithub, siJira, siGooglemeet, siMiro } from "simple-icons";

/** Geometric stroke icons, 1.5px, 24 grid. */
function Base(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={24}
      height={24}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    />
  );
}

export const ArrowRight = (p: SVGProps<SVGSVGElement>) => (
  <Base width={16} height={16} {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </Base>
);
export const MenuIcon = (p: SVGProps<SVGSVGElement>) => (
  <Base {...p}>
    <path d="M4 8h16M4 16h16" />
  </Base>
);
export const CloseIcon = (p: SVGProps<SVGSVGElement>) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Base>
);
export const NoScoreIcon = (p: SVGProps<SVGSVGElement>) => (
  <Base {...p}>
    <path d="M5 19V13M10 19V9M15 19v-4M20 19V7" />
    <path d="M3 3l18 18" />
  </Base>
);
export const FilterIcon = (p: SVGProps<SVGSVGElement>) => (
  <Base {...p}>
    <path d="M4 5h16l-6 7.5V19l-4-2v-4.5L4 5z" />
  </Base>
);
export const HiddenIcon = (p: SVGProps<SVGSVGElement>) => (
  <Base {...p}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M4 12h16" strokeDasharray="2 3" />
  </Base>
);
export const RolesIcon = (p: SVGProps<SVGSVGElement>) => (
  <Base {...p}>
    <rect x="3" y="4" width="7" height="7" rx="1.5" />
    <rect x="14" y="4" width="7" height="7" rx="1.5" />
    <rect x="8.5" y="13" width="7" height="7" rx="1.5" />
  </Base>
);
export const DocIcon = (p: SVGProps<SVGSVGElement>) => (
  <Base {...p}>
    <path d="M6 3h8l4 4v14H6z" />
    <path d="M14 3v4h4M9 12h6M9 16h4" />
  </Base>
);
export const CheckIcon = (p: SVGProps<SVGSVGElement>) => (
  <Base {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Base>
);

/** Integration marks (Simple Icons, CC0), rendered monochrome. */
function Brand({ path, title, ...p }: SVGProps<SVGSVGElement> & { path: string; title: string }) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor" role="img" aria-label={title} {...p}>
      <path d={path} />
    </svg>
  );
}
export const GithubMark = (p: SVGProps<SVGSVGElement>) => <Brand path={siGithub.path} title="GitHub" {...p} />;
export const JiraMark = (p: SVGProps<SVGSVGElement>) => <Brand path={siJira.path} title="Jira" {...p} />;
export const MeetMark = (p: SVGProps<SVGSVGElement>) => <Brand path={siGooglemeet.path} title="Google Meet" {...p} />;
export const MiroMark = (p: SVGProps<SVGSVGElement>) => <Brand path={siMiro.path} title="Miro" {...p} />;
