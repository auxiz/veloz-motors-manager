
-- Enable realtime for vehicles table
ALTER TABLE vehicles REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE vehicles;

-- Enable realtime for sales table
ALTER TABLE sales REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE sales;

-- Enable realtime for customers table
ALTER TABLE customers REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE customers;

-- Enable realtime for financial_transactions table
ALTER TABLE financial_transactions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE financial_transactions;
