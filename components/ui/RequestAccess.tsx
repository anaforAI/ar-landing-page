"use client";

import {
  createContext,
  useActionState,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";
import { requestAccess, type RequestAccessState } from "@/app/actions/request-access";
import { validateRequestAccess, type Field, type FieldErrors } from "@/lib/validation";
import { ArrowRight, CheckIcon, CloseIcon } from "./icons";

const Ctx = createContext<{ open: () => void }>({ open: () => {} });
export const useRequestAccess = () => useContext(Ctx);

export function RequestAccessProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(0);

  const open = useCallback(() => {
    setMounted((n) => n + 1);
    const d = dialogRef.current;
    if (d && !d.open) {
      d.showModal();
      (window as unknown as { __lenis?: { stop: () => void } }).__lenis?.stop();
    }
  }, []);

  // Deep link: /#request-access opens the dialog.
  useEffect(() => {
    const check = () => {
      if (window.location.hash === "#request-access") {
        open();
        history.replaceState(null, "", window.location.pathname);
      }
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, [open]);

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby="request-access-title"
        data-lenis-prevent
        onClose={() =>
          (window as unknown as { __lenis?: { start: () => void } }).__lenis?.start()
        }
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto w-[calc(100%-32px)] max-w-[520px] rounded-[12px] bg-paper p-0 text-ink shadow-card backdrop:bg-ink/50 open:animate-[fade-up_400ms_var(--ease-anafor)_both]"
      >
        {mounted > 0 && <RequestAccessForm key={mounted} onClose={() => dialogRef.current?.close()} />}
      </dialog>
    </Ctx.Provider>
  );
}

function RequestAccessForm({ onClose }: { onClose: () => void }) {
  const t = useTranslations("form");
  const [state, action, pending] = useActionState<RequestAccessState, FormData>(requestAccess, {
    status: "idle",
  });
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const errors: FieldErrors = { ...(state.status === "error" ? state.errors : {}), ...clientErrors };
  const values = state.status === "error" ? state.values : undefined;
  const successRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (state.status === "success") successRef.current?.focus();
  }, [state.status]);

  const fields: { name: Field; type: string; autoComplete: string; placeholder?: string }[] = [
    { name: "name", type: "text", autoComplete: "name" },
    { name: "email", type: "email", autoComplete: "email" },
    { name: "company", type: "text", autoComplete: "organization" },
    { name: "role", type: "text", autoComplete: "organization-title", placeholder: t("rolePlaceholder") },
  ];

  return (
    <div className="relative p-6 sm:p-10">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full text-stone transition-colors hover:text-ink"
        aria-label={t("close")}
      >
        <CloseIcon />
      </button>

      {state.status === "success" ? (
        <div className="py-6" role="status">
          <span className="mb-6 grid h-11 w-11 place-items-center rounded-full bg-teal text-paper">
            <CheckIcon />
          </span>
          <h2
            ref={successRef}
            tabIndex={-1}
            id="request-access-title"
            className="display text-[40px] outline-none"
          >
            {t("successTitle")}
          </h2>
          <p className="mt-4 text-stone">{t("successBody")}</p>
          <button type="button" className="btn btn-primary mt-8" onClick={onClose}>
            {t("close")}
          </button>
        </div>
      ) : (
        <>
          <h2 id="request-access-title" className="display pr-10 text-[40px]">
            {t("title")}
          </h2>
          <p className="mt-3 text-[16px] text-stone">{t("intro")}</p>
          <form
            action={action}
            noValidate
            className="mt-8 grid gap-5"
            onSubmit={(e) => {
              const fd = new FormData(e.currentTarget);
              const errs = validateRequestAccess({
                name: String(fd.get("name") ?? ""),
                email: String(fd.get("email") ?? ""),
                company: String(fd.get("company") ?? ""),
                role: String(fd.get("role") ?? ""),
              });
              setClientErrors(errs);
              if (Object.keys(errs).length) {
                e.preventDefault();
                const first = Object.keys(errs)[0];
                (e.currentTarget.elements.namedItem(first) as HTMLInputElement | null)?.focus();
              }
            }}
          >
            {fields.map((f) => {
              const err = errors[f.name];
              return (
                <div key={f.name}>
                  <label htmlFor={`ra-${f.name}`} className="mb-2 block text-[15px] font-medium">
                    {t(f.name)}
                  </label>
                  <input
                    id={`ra-${f.name}`}
                    name={f.name}
                    type={f.type}
                    autoComplete={f.autoComplete}
                    placeholder={f.placeholder}
                    defaultValue={values?.[f.name]}
                    required
                    aria-invalid={err ? true : undefined}
                    aria-describedby={err ? `ra-${f.name}-err` : undefined}
                    onChange={() => {
                      if (!clientErrors[f.name]) return;
                      setClientErrors((prev) => {
                        const next = { ...prev };
                        delete next[f.name];
                        return next;
                      });
                    }}
                    className="block h-12 w-full rounded-[8px] border border-sand bg-white px-4 text-[16px] text-ink placeholder:text-stone/70 transition-colors focus:border-teal aria-[invalid=true]:border-ink"
                  />
                  {err && (
                    <p id={`ra-${f.name}-err`} className="mt-2 flex items-center gap-2 text-[14px] text-ink">
                      <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-ember" />
                      {t(`errors.${err}`)}
                    </p>
                  )}
                </div>
              );
            })}
            <div aria-hidden="true" className="absolute -left-[9999px]">
              <label>
                Website <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            {state.status === "error" && state.generic && (
              <p role="alert" className="flex items-center gap-2 text-[14px]">
                <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-ember" />
                {t("errors.generic")}
              </p>
            )}
            <button type="submit" className="btn btn-primary mt-2 w-full" disabled={pending}>
              {pending ? t("submitting") : t("submit")}
              {!pending && <ArrowRight className="btn-arrow" />}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export function RequestAccessButton({
  children,
  className = "btn btn-primary",
  arrow = true,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  arrow?: boolean;
  onClick?: () => void;
}) {
  const { open } = useRequestAccess();
  return (
    <a
      href="#request-access"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
        open();
      }}
    >
      {children}
      {arrow && <ArrowRight className="btn-arrow" />}
    </a>
  );
}
