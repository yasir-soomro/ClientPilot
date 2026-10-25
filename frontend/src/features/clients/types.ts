export type Client = {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  created_at: string;
  updated_at: string;
};

export type ClientFields = {
  name: string;
  email: string | null;
  company: string | null;
};

export type ClientFormValues = {
  name: string;
  email: string;
  company: string;
};

export type ClientFieldErrors = Partial<
  Record<keyof ClientFormValues, string>
>;
