import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      )
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    )

    const client = await clientPromise
    const db = client.db('creator-studio')
    const users = db.collection('users')

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId

        if (userId) {
          await users.updateOne(
            { _id: new ObjectId(userId) },
            {
              $set: {
                isPaid: true,
                subscriptionStatus: 'active',
                stripeSubscriptionId: session.subscription,
                updatedAt: new Date(),
              },
            }
          )
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        await users.updateOne(
          { stripeCustomerId: customerId },
          {
            $set: {
              subscriptionStatus: subscription.status,
              updatedAt: new Date(),
            },
          }
        )
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        await users.updateOne(
          { stripeCustomerId: customerId },
          {
            $set: {
              isPaid: false,
              subscriptionStatus: 'canceled',
              updatedAt: new Date(),
            },
          }
        )
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        await users.updateOne(
          { stripeCustomerId: customerId },
          {
            $set: {
              subscriptionStatus: 'past_due',
              updatedAt: new Date(),
            },
          }
        )
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
