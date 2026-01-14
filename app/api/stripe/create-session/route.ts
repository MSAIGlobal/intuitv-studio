import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia'
})

export async function POST(request: NextRequest) {
  try {
    const { userId, email, successUrl, cancelUrl } = await request.json()

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1QkaBERubwCQmDCmEAZLWGSr', // Your Stripe Price ID with 14-day trial
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        userId: userId
      },
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          userId: userId
        }
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Stripe error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
