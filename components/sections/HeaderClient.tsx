"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RequestAccessButton } from "@/components/ui/RequestAccess";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { EASE } from "@/components/motion/MotionProvider";

type Props = {
  links: { href: string; label: string }[];
  appUrl: string;
  labels: {
    nav: string;
    home: string;
    open: string;
    close: string;
    signIn: string;
    request: string;
    language: string;
  };
  logo: ReactNode;
  logoDark: ReactNode;
};

export function HeaderClient({ links, appUrl, labels, logo, logoDark }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  // On load the logo plays the brand signature once (the quarter lifts into place); then hover.
  const [intro, setIntro] = useState(true);

  useEffect(() => {
    const darks = Array.from(
      document.querySelectorAll<HTMLElement>("main .on-dark, footer.on-dark"),
    );
    const targets = links
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter((el): el is HTMLElement => !!el);
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      // Scrollspy: the section crossing a line just under the header, if it is in the menu.
      const line = window.innerHeight * 0.35;
      const hit = targets.find((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= line && r.bottom > line;
      });
      setActive(hit ? `#${hit.id}` : null);
      // The header switches to ink when it sits over a dark section.
      setOverDark(
        darks.some((el) => {
          const r = el.getBoundingClientRect();
          return r.top <= 36 && r.bottom >= 36;
        }),
      );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [links]);

  useEffect(() => {
    const lenis = (
      window as unknown as { __lenis?: { stop: () => void; start: () => void } }
    ).__lenis;
    document.documentElement.style.overflow = menu ? "hidden" : "";
    if (menu) lenis?.stop();
    else lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const dark = overDark && !menu;
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-[72px] border-b transition-[border-color,background-color,color] duration-300 ${
        dark
          ? "on-dark border-paper/10 bg-ink/90 text-paper backdrop-blur-md"
          : scrolled || menu
            ? "border-sand bg-paper/90 text-ink backdrop-blur-md"
            : "border-transparent bg-paper/0 text-ink"
      }`}
    >
      <div className="container-wide grid h-full grid-cols-[1fr_auto] items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
        <a
          href="#top"
          aria-label={labels.home}
          onAnimationEnd={(e) => {
            if (e.animationName === "anafor-lift") setIntro(false);
          }}
          className={`-m-2 grid justify-self-start rounded-[4px] p-2 ${intro ? "logo-intro" : "logo-lift"}`}
        >
          {/* Both lockups stay mounted and crossfade, so the intro never replays on theme change. */}
          <span className={`[grid-area:1/1] transition-opacity duration-300 ${dark ? "opacity-0" : "opacity-100"}`}>
            {logo}
          </span>
          <span
            className={`[grid-area:1/1] transition-opacity duration-300 ${dark ? "opacity-100" : "opacity-0"}`}
          >
            {logoDark}
          </span>
        </a>

        <nav aria-label={labels.nav} className="hidden lg:block">
          <ul
            className={`flex items-center gap-0.5 rounded-full border p-1 text-[15px] transition-colors duration-300 ${
              dark ? "border-paper/12 bg-paper/[0.04]" : "border-sand bg-white/60"
            }`}
          >
            {links.map((l) => {
              const on = active === l.href;
              return (
                <li key={l.href} className="relative">
                  {on && (
                    <motion.span
                      layoutId="nav-active"
                      aria-hidden="true"
                      className={`absolute inset-0 rounded-full ${dark ? "bg-paper/12" : "bg-ink/[0.07]"}`}
                      transition={{ duration: 0.4, ease: EASE }}
                    />
                  )}
                  <a
                    href={l.href}
                    aria-current={on ? "location" : undefined}
                    className={`relative flex h-9 items-center rounded-full px-4 transition-colors duration-200 ${
                      dark
                        ? on
                          ? "text-paper"
                          : "text-paper/70 hover:text-paper"
                        : on
                          ? "text-ink"
                          : "text-ink/65 hover:text-ink"
                    }`}
                  >
                    {l.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-5 justify-self-end lg:flex">
          <LanguageSwitch label={labels.language} dark={dark} />
          <a
            href={appUrl}
            className={`link-underline text-[15px] ${dark ? "text-paper/80 hover:text-paper" : "text-ink/80 hover:text-ink"}`}
          >
            {labels.signIn}
          </a>
          <RequestAccessButton
            className={`btn btn-sm ${dark ? "btn-light" : "btn-primary"}`}
            arrow={false}
          >
            {labels.request}
          </RequestAccessButton>
        </div>

        <div className="flex items-center gap-1 justify-self-end lg:hidden">
          <LanguageSwitch label={labels.language} dark={dark} />
          <button
            type="button"
            className="-mr-2 grid h-11 w-11 place-items-center rounded-full"
            aria-expanded={menu}
            aria-controls="mobile-menu"
            aria-label={menu ? labels.close : labels.open}
            onClick={() => setMenu((m) => !m)}
          >
            {menu ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Reading progress: a teal hairline along the bottom edge. */}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 -bottom-px h-px origin-left transition-opacity duration-300 ${
          dark ? "bg-teal-light" : "bg-teal"
        } ${scrolled && !menu ? "opacity-100" : "opacity-0"}`}
        style={{ transform: `scaleX(${progress})` }}
      />

      <AnimatePresence>
        {menu && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-x-0 bottom-0 top-[72px] z-40 flex flex-col bg-paper lg:hidden"
          >
            <nav aria-label={labels.nav} className="container-wide flex-1 pt-8">
              <ul className="flex flex-col">
                {links.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.04 * i + 0.05,
                      duration: 0.5,
                      ease: EASE,
                    }}
                    className="border-b border-sand"
                  >
                    <a
                      href={l.href}
                      onClick={() => setMenu(false)}
                      aria-current={active === l.href ? "location" : undefined}
                      className={`display flex min-h-[64px] items-center justify-between text-[34px] ${
                        active === l.href ? "text-teal" : ""
                      }`}
                    >
                      {l.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="container-wide flex flex-col gap-3 pb-10">
              <RequestAccessButton
                className="btn btn-primary w-full"
                onClick={() => setMenu(false)}
              >
                {labels.request}
              </RequestAccessButton>
              <a href={appUrl} className="btn btn-outline w-full">
                {labels.signIn}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
