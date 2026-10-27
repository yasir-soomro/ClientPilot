import type { LoginInput, Owner, RegisterInput } from "@/features/auth/types";
import {
  ApiError,
  requestJson,
  requestNoContent,
} from "@/features/api/client";

export { ApiError as AuthApiError } from "@/features/api/client";

function isOwner(payload: unknown): payload is Owner {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }
  return (
    "id" in payload &&
    typeof payload.id === "string" &&
    "email" in payload &&
    typeof payload.email === "string" &&
    "full_name" in payload &&
    (typeof payload.full_name === "string" || payload.full_name === null) &&
    "phone_number" in payload &&
    (typeof payload.phone_number === "string" || payload.phone_number === null) &&
    "created_at" in payload &&
    typeof payload.created_at === "string" &&
    "updated_at" in payload &&
    typeof payload.updated_at === "string" &&
    "email_verified" in payload &&
    typeof payload.email_verified === "boolean"
  );
}

async function requestOwner(
  path: string,
  input?: LoginInput | RegisterInput,
): Promise<Owner> {
  let payload: unknown;
  try {
    payload = await requestJson(path, {
      method: input ? "POST" : "GET",
      ...(input ? { body: JSON.stringify(input) } : {}),
    });
  } catch (error) {
    if (path === "/api/auth/login" && error instanceof ApiError && error.status === 401) {
      throw new ApiError("That email and password combination was not recognized.", 401);
    }
    throw error;
  }

  if (!isOwner(payload)) {
    throw new Error("The server returned an invalid response.");
  }

  return payload;
}

export function registerOwner(input: RegisterInput): Promise<Owner> {
  return requestOwner("/api/auth/register", {
    ...input,
    full_name: input.full_name.trim(),
    email: input.email.trim().toLowerCase(),
    phone_number: input.phone_number.trim(),
  });
}

export function loginOwner(input: LoginInput): Promise<Owner> {
  return requestOwner("/api/auth/login", {
    ...input,
    email: input.email.trim().toLowerCase(),
  });
}

export function getCurrentOwner(): Promise<Owner> {
  return requestOwner("/api/auth/me");
}

export async function logoutOwner(): Promise<void> {
  await requestNoContent("/api/auth/logout", { method: "POST" });
}

export async function verifyEmail(email: string, code: string): Promise<Owner> {
  const payload = await requestJson("/api/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ email: email.trim().toLowerCase(), code }),
  });
  if (!isOwner(payload)) {
    throw new Error("The server returned an invalid response.");
  }
  return payload;
}

export async function resendVerification(email: string): Promise<void> {
  await requestNoContent("/api/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
  });
}

export async function getDevelopmentVerificationCode(email: string): Promise<string> {
  const payload = await requestJson(`/api/auth/dev/verification-code?email=${encodeURIComponent(email.trim().toLowerCase())}`);
  if (typeof payload !== "object" || payload === null || !("code" in payload) || typeof payload.code !== "string") {
    throw new Error("No active development verification code is available.");
  }
  return payload.code;
}
