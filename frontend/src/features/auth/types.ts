export type Owner = {
  id: string;
  email: string;
  full_name: string | null;
  phone_number: string | null;
  created_at: string;
  updated_at: string;
  email_verified: boolean;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = LoginInput & {
  full_name: string;
  phone_number: string;
};

export type FieldErrors<T extends string> = Partial<Record<T, string>>;
