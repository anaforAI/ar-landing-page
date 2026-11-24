"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RequestAccessButton } from "@/components/ui/RequestAccess";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { EASE } from "@/components/motion/MotionProvider";

type Props = {
  links: { href: string; label: string }[];
  appUrl: string;
  labels: { nav: string; home: string; open: string; close: string; signIn: string; request: string };
  logo: ReactNode;
  logoDark: ReactNode;
};

export function HeaderClient({ links, appUrl, labels, logo, logoDark }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const darks = Array.from(document.querySelectorAll<HTMLElement>("main .on-dark, footer.on-dark"));
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      // The header switches to ink when it sits over a dark section.
      setOverDark(darks.some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= 36 && r.bottom >= 36;
      }));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
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
      <div className="container-wide flex h-full items-center justify-between gap-6">
        <a href="#top" aria-label={labels.home} className="logo-lift -m-2 rounded-[4px] p-2">
          {dark ? logoDark : logo}
        </a>

        <nav aria-label={labels.nav} className="hidden lg:block">
          <ul className={`flex items-center gap-8 text-[15px] ${dark ? "text-paper/80" : "text-ink/80"}`}>
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={`link-underline transition-colors ${dark ? "hover:text-paper" : "hover:text-ink"}`}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <a href={appUrl} className={`link-underline text-[15px] ${dark ? "text-paper/80 hover:text-paper" : "text-ink/80 hover:text-ink"}`}>
            {labels.signIn}
          </a>
          <RequestAccessButton className={`btn btn-sm ${dark ? "btn-light" : "btn-primary"}`} arrow={false}>
            {labels.request}
          </RequestAccessButton>
        </div>

        <button
          type="button"
          className="-mr-2 grid h-11 w-11 place-items-center rounded-full lg:hidden"
          aria-expanded={menu}
          aria-controls="mobile-menu"
          aria-label={menu ? labels.close : labels.open}
          onClick={() => setMenu((m) => !m)}
        >
          {menu ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

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
                    transition={{ delay: 0.04 * i + 0.05, duration: 0.5, ease: EASE }}
                    className="border-b border-sand"
                  >
                    <a
                      href={l.href}
                      onClick={() => setMenu(false)}
                      className="display flex min-h-[64px] items-center text-[34px]"
                    >
                      {l.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="container-wide flex flex-col gap-3 pb-10">
              <RequestAccessButton className="btn btn-primary w-full" onClick={() => setMenu(false)}>{labels.request}</RequestAccessButton>
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
