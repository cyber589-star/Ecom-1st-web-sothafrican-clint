-- Add DELETE policy for orders table so admin can delete orders
CREATE POLICY "Orders are deletable by authenticated users" ON public.orders
  FOR DELETE USING (auth.role() = 'authenticated');
