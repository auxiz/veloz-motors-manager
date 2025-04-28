
export type Customer = {
  id: string;
  name: string;
  document: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  internal_notes: string | null;
  birth_date: string | null;  // Using string for ISO date format from database
  tags: string[] | null;
  status: string;
  created_at: string | null;
  updated_at: string | null;
};
