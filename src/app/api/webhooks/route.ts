import { NextResponse } from "next/server";
import { Stripe } from "stripe";
import { client } from "@/lib/sanityClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;//stripe

interface Session {
  id?: string;
  description?: string;
  status?: string;
  confirmation_method?: string;
  amount?: number;
}

const fullfillOrder = async (session: Session) => {
  // Default values if certain session fields are missing
  const defaultDescription = "Test message from orders";
  const defaultTitle = "Orders";
  const defaultMethod = "Not provided";
  const defaultAmount = 0;

  try {
    await client.create({
      _type: "order",
      title: session.id || defaultTitle,
      description: session.description || defaultDescription,
      message: "Uplata izvršena",
      status: session.status || "unknown", // Default to 'unknown' if status is missing
      method: session.confirmation_method || defaultMethod,
      amount: typeof session.amount === 'number' ? session.amount / 100 : defaultAmount,
    });
  } catch (error: any) {
    console.error("Error creating order in Sanity:", error.message);
  }

  console.log("session", session);
  return NextResponse.json({
    message: "Uplata izvršena",
    status: true,
    method: session.status,
    data: session,
  });
};

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event | null = null;

  try {
    event = stripe.webhooks.constructEvent(payload, signature!, webhookSecret);

    if (event?.type === "payment_intent.succeeded") {
      const session = event.data.object as Session;
      return fullfillOrder(session)
        .then(() => NextResponse.json({ status: 200 }))
        .catch((err: any) =>
          NextResponse.json({ error: err?.message }, { status: 500 })
        );
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return NextResponse.json({ message: err.message }, { status: 400 });
    }
  }

  return NextResponse.json({ received: true });
}
