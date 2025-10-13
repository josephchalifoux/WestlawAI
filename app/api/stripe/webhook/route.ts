import Stripe from 'stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  // Match the version allowed by the installed Stripe typings
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature') || '';
  const raw = await req.text();
  try {
    const event = stripe.webhooks.constructEvent(
      raw,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    if (event.type === 'checkout.session.completed') {
      // TODO: handle fulfillment
    }

    return new Response('ok', { status: 200 });
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
