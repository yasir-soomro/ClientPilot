import assert from "node:assert/strict";
import test from "node:test";
import {
  clientFieldsFromForm,
  validateClientForm,
} from "../src/features/clients/schema.ts";

test("client form trims fields and maps optional blanks to null", () => {
  const values = {
    name: "  Ali Khan  ",
    email: "  ALI@example.com ",
    company: "   ",
  };

  assert.deepEqual(validateClientForm(values), {});
  assert.deepEqual(clientFieldsFromForm(values), {
    name: "Ali Khan",
    email: "ali@example.com",
    company: null,
  });
});

test("client form accepts omitted optional contact fields", () => {
  const values = { name: "Client", email: "", company: "" };

  assert.deepEqual(validateClientForm(values), {});
  assert.deepEqual(clientFieldsFromForm(values), {
    name: "Client",
    email: null,
    company: null,
  });
});

test("client form rejects missing, blank, and overlong names", () => {
  assert.equal(validateClientForm({ name: " ", email: "", company: "" }).name,
    "Enter a client name.");
  assert.equal(validateClientForm({ name: "x".repeat(256), email: "", company: "" }).name,
    "Client name must be 255 characters or fewer.");
  assert.deepEqual(validateClientForm({ name: "x".repeat(255), email: "", company: "" }), {});
});

test("client form rejects invalid supplied email and overlong company", () => {
  assert.equal(
    validateClientForm({
      name: "Client",
      email: "not-an-email",
      company: "",
    }).email,
    "Enter a valid email address or leave it blank.",
  );
  assert.equal(
    validateClientForm({
      name: "Client",
      email: "",
      company: "x".repeat(256),
    }).company,
    "Company must be 255 characters or fewer.",
  );
});

test("client limits count Unicode code points like the backend", () => {
  const emojiName = "😀".repeat(128);
  const emojiCompany = "🏢".repeat(128);

  assert.deepEqual(
    validateClientForm({
      name: emojiName,
      email: "",
      company: emojiCompany,
    }),
    {},
  );
});

test("client email validation rejects malformed addresses rejected by the backend", () => {
  for (const email of ["a..b@example.com", "person@-example.com", "person@example..com"]) {
    assert.equal(
      validateClientForm({ name: "Client", email, company: "" }).email,
      "Enter a valid email address or leave it blank.",
      email,
    );
  }

  assert.deepEqual(
    validateClientForm({
      name: "Client",
      email: "person+tag@example.com",
      company: "",
    }),
    {},
  );
});
