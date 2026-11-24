export type Field = "name" | "email" | "company" | "role";
export type FieldErrors = Partial<Record<Field, "name" | "email" | "emailWork" | "company" | "role">>;
export type RequestAccessInput = Record<Field, string>;

const FREE_EMAIL = new Set([
  "gmail.com", "googlemail.com", "hotmail.com", "outlook.com", "live.com", "msn.com",
  "yahoo.com", "yahoo.com.br", "icloud.com", "me.com", "aol.com", "proton.me",
  "protonmail.com", "gmx.com", "mail.com", "bol.com.br", "uol.com.br", "terra.com.br",
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateRequestAccess(input: RequestAccessInput): FieldErrors {
  const errors: FieldErrors = {};
  if (input.name.trim().length < 2) errors.name = "name";
  const email = input.email.trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) errors.email = "email";
  else if (FREE_EMAIL.has(email.split("@")[1])) errors.email = "emailWork";
  if (input.company.trim().length < 2) errors.company = "company";
  if (input.role.trim().length < 2) errors.role = "role";
  return errors;
}
