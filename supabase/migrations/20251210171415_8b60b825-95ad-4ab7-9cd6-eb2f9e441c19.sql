-- Add policy for admins to delete their own assigned roles (for removing roles from users)
-- The existing delete policy only allows admins who already have the role, 
-- but we need to ensure admins can manage all user roles

-- Drop the existing restrictive policy and recreate with proper access
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));