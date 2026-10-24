import type {
  FieldErrors,
  LoginInput,
  RegisterInput,
} from "@/features/auth/types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+[1-9]\d{6,14}$/;

export function validateLoginInput(
  input: LoginInput,
): FieldErrors<keyof LoginInput> {
  const errors: FieldErrors<keyof LoginInput> = {};
  if (!EMAIL_PATTERN.test(input.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!input.password) {
    errors.password = "Enter your password.";
  }
  return errors;
}

export function validateRegisterInput(
  input: RegisterInput,
): FieldErrors<keyof RegisterInput> {
  const errors: FieldErrors<keyof RegisterInput> = {};
  if (!input.full_name.trim()) {
    errors.full_name = "Enter your full name.";
  } else if (input.full_name.trim().length > 50) {
    errors.full_name = "Your name must be 50 characters or fewer.";
  }
  if (!EMAIL_PATTERN.test(input.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (input.password.length < 12 || input.password.length > 128) {
    errors.password = "Use a password between 12 and 128 characters.";
  }
  if (!PHONE_PATTERN.test(input.phone_number.trim())) {
    errors.phone_number = "Use international format, for example +14155552671.";
  }
  return errors;
}
