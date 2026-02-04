-- Enable realtime for user_roles table to allow instant admin access updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_roles;