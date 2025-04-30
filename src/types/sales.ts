
export type Sale = {
  id: string;
  vehicle_id: string;
  customer_id: string;
  final_price: number;
  payment_method: string;
  seller_id: string;
  commission_amount: number;
  sale_date: string;
  vehicle?: {
    brand: string;
    model: string;
    version?: string;
    year: number;
    color: string;
    transmission: string;
    fuel: string;
  };
  customer?: {
    name: string;
    document: string;
  };
  seller?: {
    id: string;
    first_name?: string;
    last_name?: string;
  };
};
