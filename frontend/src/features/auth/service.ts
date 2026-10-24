import type { LoginInput, Owner, RegisterInput } from "@/features/auth/types";

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
    typeof payload.updated_at === "string"
  );
}

export class AuthApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "AuthApiError";
  }
}

function errorMessage(payload: unknown, status: number): string {
  if (typeof payload === "object" && payload !== null && "detail" in payload) {
    const detail = payload.detail;
    if (typeof detail === "string") {
      return detail;
    }
    if (Array.isArray(detail)) {
      const messages = detail
        .map((item: unknown) => {
          if (
            typeof item === "object" &&
            item !== null &&
            "msg" in item &&
            typeof item.msg === "string"
          ) {
            return item.msg;
          }
          return null;
        })
        .filter((message): message is string => message !== null);
      if (messages.length > 0) {
        return messages.join(" ");
      }
    }
  }
  if (status === 401) {
    return "That email and password combination was not recognized.";
  }
  return "We couldn’t complete your request. Please try again.";
}

async function requestOwner(
  path: string,
  input?: LoginInput | RegisterInput,
): Promise<Owner> {
  let response: Response;
  try {
    response = await fetch(path, {
      method: input ? "POST" : "GET",
      ...(input
        ? {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
          }
        : {}),
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    throw new AuthApiError(
      "Unable to reach ClientPilot. Check your connection and try again.",
      0,
    );
  }

  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    throw new AuthApiError(errorMessage(payload, response.status), response.status);
  }

  if (!isOwner(payload)) {
    throw new AuthApiError("The server returned an invalid response.", response.status);
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
  let response: Response;
  try {
    response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    throw new AuthApiError(
      "Unable to reach ClientPilot. Check your connection and try again.",
      0,
    );
  }
  if (!response.ok) {
    throw new AuthApiError(
      errorMessage(await response.json().catch(() => null), response.status),
      response.status,
    );
  }
}
