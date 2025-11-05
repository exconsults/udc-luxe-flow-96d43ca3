-- Ensure unique referral codes and create RPC to assign if missing
CREATE UNIQUE INDEX IF NOT EXISTS profiles_referral_code_unique
ON public.profiles (referral_code)
WHERE referral_code IS NOT NULL;

CREATE OR REPLACE FUNCTION public.ensure_referral_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  curr text;
BEGIN
  SELECT referral_code INTO curr FROM public.profiles WHERE id = auth.uid();
  IF curr IS NULL THEN
    curr := public.generate_referral_code();
    UPDATE public.profiles SET referral_code = curr WHERE id = auth.uid();
  END IF;
  RETURN curr;
END;
$$;