import Stripe from 'stripe';


export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';


export async function POST(req: Request) {
const sig = req.headers.get('stripe-signature') || '';
const raw = await req.text();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' });
try {
const event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
if (event.type === 'checkout.session.completed') {
// TODO: handle fulfillment here
}
return new Response('ok', { status: 200 });
} catch (err: any) {
return new Response(`Webhook Error: ${err.message}`, { status: 400 });
}
}
