-- Create service_prices table to manage dynamic pricing
CREATE TABLE public.service_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_type TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  base_price NUMERIC NOT NULL DEFAULT 0,
  price_unit TEXT NOT NULL DEFAULT 'per item',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.service_prices ENABLE ROW LEVEL SECURITY;

-- Public read access for all users (even anonymous)
CREATE POLICY "Anyone can view active service prices"
  ON public.service_prices
  FOR SELECT
  USING (is_active = true);

-- Admins can do everything
CREATE POLICY "Admins can manage service prices"
  ON public.service_prices
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert default pricing
INSERT INTO public.service_prices (service_type, name, description, base_price, price_unit) VALUES
  ('wash_fold', 'Wash & Fold', 'Professional washing, drying, and folding. Fresh and ready to wear.', 200, 'per kg'),
  ('dry_cleaning', 'Dry Cleaning', 'Expert care for delicate fabrics, Arewa wear, and special garments.', 500, 'per item'),
  ('ironing', 'Ironing', 'Crisp, wrinkle-free clothes and traditional wear with precision pressing.', 150, 'per item'),
  ('premium', 'Premium', 'Luxury treatment for your finest traditional clothing and embroidery.', 800, 'per item');

-- Trigger for updated_at
CREATE TRIGGER update_service_prices_updated_at
  BEFORE UPDATE ON public.service_prices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();