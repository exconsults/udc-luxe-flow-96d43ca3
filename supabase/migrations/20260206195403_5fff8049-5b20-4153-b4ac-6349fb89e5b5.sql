
-- Create notifications table for order status updates
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'order_update',
  is_read BOOLEAN NOT NULL DEFAULT false,
  order_id UUID REFERENCES public.orders(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view own notifications
CREATE POLICY "Users can view own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

-- Users can update own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can insert notifications for any user
CREATE POLICY "Admins can insert notifications"
ON public.notifications FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- System can insert via service role (for triggers)
CREATE POLICY "Service role can insert notifications"
ON public.notifications FOR INSERT
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(user_id, is_read);

-- Create trigger function to auto-create notification on order status change
CREATE OR REPLACE FUNCTION public.notify_order_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  status_label TEXT;
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    status_label := REPLACE(NEW.status::text, '_', ' ');
    INSERT INTO public.notifications (user_id, title, message, type, order_id)
    VALUES (
      NEW.user_id,
      'Order ' || NEW.order_number || ' Updated',
      'Your order status changed to: ' || INITCAP(status_label),
      'order_update',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Attach trigger to orders table
CREATE TRIGGER on_order_status_change
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_order_status_change();

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
