import type {
  ClientFieldErrors,
  ClientFields,
  ClientFormValues,
} from "./types";

const EMAIL_PATTERN =
  /^(?!\.)(?!.*\.\.)[\p{L}\p{N}!#$%&'*+/=?^_`{|}~-]+(?:\.[\p{L}\p{N}!#$%&'*+/=?^_`{|}~-]+)*@[\p{L}\p{N}](?:[\p{L}\p{N}-]{0,61}[\p{L}\p{N}])?(?:\.[\p{L}\p{N}](?:[\p{L}\p{N}-]{0,61}[\p{L}\p{N}])?)*$/u;

function characterCount(value: string): number {
  return Array.from(value).length;
}

export function validateClientForm(
  values: ClientFormValues,
): ClientFieldErrors {
  const errors: ClientFieldErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const company = values.company.trim();

  if (!name) {
    errors.name = "Enter a client name.";
  } else if (characterCount(name) > 255) {
    errors.name = "Client name must be 255 characters or fewer.";
  }
  if (email && !EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address or leave it blank.";
  }
  if (characterCount(company) > 255) {
    errors.company = "Company must be 255 characters or fewer.";
  }
  return errors;
}

export function clientFieldsFromForm(values: ClientFormValues): ClientFields {
  const email = values.email.trim();
  const company = values.company.trim();
  return {
    name: values.name.trim(),
    email: email ? email.toLowerCase() : null,
    company: company || null,
  };
}
