import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// IMPORTANT:
// Do NOT set apiVersion here — it causes TypeScript build failures on Netlify
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { userId, email, successUrl, cancelUrl } = await request.json()

    if (!userId || !email || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1QkaBERubwCQmDCmEAZLWGSr', // 14-day trial price ID
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        userId,
      },
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          userId,
        },
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: unknown) {
    console.error('Stripe error:', error)

    return NextResponse.json(
      { error: 'Failed to create Stripe session' },
      { status: 500 }
    )
  }
}
