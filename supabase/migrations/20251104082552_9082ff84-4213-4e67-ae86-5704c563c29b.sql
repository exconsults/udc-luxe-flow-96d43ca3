-- Drop any existing referral code triggers
DROP TRIGGER IF EXISTS set_referral_code_trigger ON public.profiles;
DROP TRIGGER IF EXISTS set_referral_code_on_insert ON public.profiles;

-- Create the trigger for future profile inserts
CREATE TRIGGER set_referral_code_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_referral_code();