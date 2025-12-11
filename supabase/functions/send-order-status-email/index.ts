import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderStatusEmailRequest {
  orderId: string;
  newStatus: string;
  userEmail: string;
  userName?: string;
  orderNumber: string;
}

const getStatusMessage = (status: string): { title: string; message: string; color: string } => {
  const statusMessages: Record<string, { title: string; message: string; color: string }> = {
    scheduled: {
      title: "Order Scheduled",
      message: "Your laundry pickup has been scheduled. Our driver will arrive at the designated time.",
      color: "#3B82F6"
    },
    picked_up: {
      title: "Laundry Picked Up",
      message: "We've picked up your laundry! It's now on its way to our facility.",
      color: "#8B5CF6"
    },
    washing: {
      title: "Washing in Progress",
      message: "Your clothes are being washed with care using premium detergents.",
      color: "#06B6D4"
    },
    drying: {
      title: "Drying in Progress",
      message: "Your laundry is being dried at the optimal temperature.",
      color: "#F59E0B"
    },
    folding: {
      title: "Folding Your Clothes",
      message: "Your clean laundry is being carefully folded and prepared for delivery.",
      color: "#10B981"
    },
    ready: {
      title: "Ready for Delivery",
      message: "Your laundry is clean, fresh, and ready to be delivered!",
      color: "#22C55E"
    },
    out_for_delivery: {
      title: "Out for Delivery",
      message: "Your laundry is on its way! Our driver will arrive shortly.",
      color: "#F97316"
    },
    delivered: {
      title: "Order Delivered",
      message: "Your laundry has been delivered. Thank you for choosing UDC!",
      color: "#22C55E"
    },
    cancelled: {
      title: "Order Cancelled",
      message: "Your order has been cancelled. If you have questions, please contact support.",
      color: "#EF4444"
    }
  };

  return statusMessages[status] || {
    title: "Order Update",
    message: `Your order status has been updated to: ${status}`,
    color: "#6B7280"
  };
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Order status email function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { orderId, newStatus, userEmail, userName, orderNumber }: OrderStatusEmailRequest = await req.json();

    console.log(`Sending status update email for order ${orderNumber} to ${userEmail}`);
    console.log(`New status: ${newStatus}`);

    const { title, message, color } = getStatusMessage(newStatus);
    const displayName = userName || "Valued Customer";

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "UDC Laundry <onboarding@resend.dev>",
        to: [userEmail],
        subject: `${title} - Order #${orderNumber}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">UDC Laundry</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">Clean. Fresh. Delivered.</p>
              </div>
              
              <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                  <div style="background-color: ${color}; color: white; display: inline-block; padding: 12px 24px; border-radius: 50px; font-weight: 600; font-size: 16px;">
                    ${title}
                  </div>
                </div>
                
                <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                  Hello ${displayName},
                </p>
                
                <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                  ${message}
                </p>
                
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
                  <p style="margin: 0; color: #64748b; font-size: 14px;">Order Number</p>
                  <p style="margin: 5px 0 0 0; color: #1e40af; font-size: 20px; font-weight: 700;">#${orderNumber}</p>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                  <a href="https://udc-laundry.lovable.app/dashboard" style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; display: inline-block;">
                    View Order Details
                  </a>
                </div>
              </div>
              
              <div style="text-align: center; padding: 20px; color: #64748b; font-size: 12px;">
                <p style="margin: 0;">© 2024 UDC Laundry. All rights reserved.</p>
                <p style="margin: 10px 0 0 0;">Questions? Contact us at support@udclaundry.com</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    const result = await emailResponse.json();
    console.log("Email sent successfully:", result);

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending order status email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
