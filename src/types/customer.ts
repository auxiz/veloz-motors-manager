
export type Customer = {
  id: string;
  name: string;
  document: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  internal_notes: string | null;
  birth_date: Date | null;
  tags: string[] | null;
  status: string;
  created_at: string | null;
  updated_at: string | null;
};
