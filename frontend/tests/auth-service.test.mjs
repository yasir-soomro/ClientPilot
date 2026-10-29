import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import {
  getCurrentOwner,
  loginOwner,
  logoutOwner,
  registerOwner,
} from "../src/features/auth/service.ts";

const originalFetch = globalThis.fetch;
const owner = {
  id: "a2d032d1-9b19-4fd6-a6c5-668f4564d443",
  email: "owner@example.com",
  full_name: "Test Owner",
  phone_number: "+14155552671",
  email_verified: false,
  created_at: "2026-10-25T12:00:00Z",
  updated_at: "2026-10-25T12:00:00Z",
};

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("auth service uses only the supported register, login, me, and logout routes", async () => {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(
      url === "/api/auth/logout" ? null : JSON.stringify(owner),
      { status: url === "/api/auth/register" ? 201 : url === "/api/auth/logout" ? 204 : 200 },
    );
  };

  await registerOwner({
    full_name: " Test Owner ",
    email: " OWNER@EXAMPLE.COM ",
    password: "correct horse battery staple",
    phone_number: " +14155552671 ",
  });
  await loginOwner({
    email: " OWNER@EXAMPLE.COM ",
    password: "correct horse battery staple",
  });
  await getCurrentOwner();
  await logoutOwner();

  assert.deepEqual(
    calls.map(({ url, options }) => [
      url,
      options.method ?? "GET",
      options.credentials,
    ]),
    [
      ["/api/auth/register", "POST", "include"],
      ["/api/auth/login", "POST", "include"],
      ["/api/auth/me", "GET", "include"],
      ["/api/auth/logout", "POST", "include"],
    ],
  );
  assert.deepEqual(JSON.parse(calls[0].options.body), {
    full_name: "Test Owner",
    email: "owner@example.com",
    password: "correct horse battery staple",
    phone_number: "+14155552671",
  });
});

test("auth service presents a consistent login error for invalid credentials", async () => {
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ detail: "Invalid email or password" }), {
      status: 401,
    });

  await assert.rejects(
    loginOwner({ email: "owner@example.com", password: "incorrect" }),
    {
      name: "ApiError",
      status: 401,
      message: "That email and password combination was not recognized.",
    },
  );
});
