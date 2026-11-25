"use server";

import { validateRequestAccess, type FieldErrors, type RequestAccessInput } from "@/lib/validation";

export type RequestAccessState =
  | { status: "idle" }
  | { status: "error"; errors: FieldErrors; generic?: boolean; values: RequestAccessInput }
  | { status: "success" };

/**
 * Sends the request to the configurable endpoint in FORM_ENDPOINT ([FORM_ENDPOINT]),
 * e.g. a CRM webhook, Formspree, or an internal API. JSON POST.
 * Without FORM_ENDPOINT the request is logged on the server (development only).
 */
export async function requestAccess(
  _prev: RequestAccessState,
  formData: FormData,
): Promise<RequestAccessState> {
  // Honeypot: bots fill hidden fields.
  if (String(formData.get("website") ?? "")) return { status: "success" };

  const values: RequestAccessInput = {
    name: String(formData.get("name") ?? "").slice(0, 200),
    email: String(formData.get("email") ?? "").slice(0, 254),
    company: String(formData.get("company") ?? "").slice(0, 200),
    role: String(formData.get("role") ?? "").slice(0, 200),
  };

  const errors = validateRequestAccess(values);
  if (Object.keys(errors).length) return { status: "error", errors, values };

  const endpoint = process.env.FORM_ENDPOINT;
  if (!endpoint) {
    if (process.env.NODE_ENV === "production") {
      console.error("[request-access] FORM_ENDPOINT is not configured; request was not delivered.");
      return { status: "error", errors: {}, generic: true, values };
    }
    console.info("[request-access] (dev) FORM_ENDPOINT not set. Payload:", values);
    return { status: "success" };
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.FORM_ENDPOINT_TOKEN
          ? { Authorization: `Bearer ${process.env.FORM_ENDPOINT_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({ ...values, source: "anafor.tech", submittedAt: new Date().toISOString() }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { status: "success" };
  } catch (err) {
    console.error("[request-access] delivery failed:", err);
    return { status: "error", errors: {}, generic: true, values };
  }
}
