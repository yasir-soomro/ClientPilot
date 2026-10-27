export class ApiError extends Error {
  readonly status: number;

  constructor(
    message: string,
    status: number,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
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
    return "Authentication is required. Sign in again.";
  }
  if (status >= 500) {
    return "ClientPilot is temporarily unavailable. Please try again in a moment.";
  }
  return "We couldn't complete your request. Please try again.";
}

async function request(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  let response: Response;
  try {
    const headers = new Headers(options.headers);
    if (options.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    response = await fetch(path, {
      ...options,
      ...(options.body ? { headers } : {}),
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      "Unable to reach ClientPilot. Check your connection and try again.",
      0,
    );
  }

  if (!response.ok) {
    const payload: unknown = await response.json().catch(() => null);
    throw new ApiError(errorMessage(payload, response.status), response.status);
  }
  return response;
}

export async function requestJson(
  path: string,
  options: RequestInit = {},
): Promise<unknown> {
  const response = await request(path, options);
  return response.json().catch(() => null);
}

export async function requestNoContent(
  path: string,
  options: RequestInit = {},
): Promise<void> {
  await request(path, options);
}
