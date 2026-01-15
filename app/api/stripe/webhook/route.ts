import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import clientPromise from '../../../../lib/mongodb'
import { ObjectId } from 'mongodb'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  let event: Stripe.Event

  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 })
    }

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('❌ Stripe signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const db = client.db('intuitv')
    const users = db.collection('users')

    switch (event.type) {
      /**
       * ==============================
       * Checkout completed (trial start)
       * ==============================
       */
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const customerId = session.customer as string
        const subscriptionId = session.subscription as string

        if (!userId || !subscriptionId) break

        const subscription = await stripe.subscriptions.retrieve(subscriptionId)

        await users.updateOne(
          { _id: new ObjectId(userId) },
          {
            $set: {
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              subscription_status: 'trial',
              isPaid: false,
              trial_end: subscription.trial_end
                ? new Date(subscription.trial_end * 1000)
                : null,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              updated_at: new Date(),
            },
          }
        )
        break
      }

      /**
       * ==============================
       * Subscription updated
       * ==============================
       */
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const isPaid =
          subscription.status === 'active' && subscription.trial_end === null

        await users.updateOne(
          { stripeCustomerId: customerId },
          {
            $set: {
              subscription_status: subscription.status,
              isPaid,
              trial_end: subscription.trial_end
                ? new Date(subscription.trial_end * 1000)
                : null,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              updated_at: new Date(),
            },
          }
        )
        break
      }

      /**
       * ==============================
       * Subscription cancelled
       * ==============================
       */
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        await users.updateOne(
          { stripeCustomerId: customerId },
          {
            $set: {
              subscription_status: 'canceled',
              isPaid: false,
              updated_at: new Date(),
            },
          }
        )
        break
      }

      /**
       * ==============================
       * Payment succeeded
       * ==============================
       */
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        await users.updateOne(
          { stripeCustomerId: customerId },
          {
            $set: {
              subscription_status: 'active',
              isPaid: true,
              lastPaymentDate: new Date(),
              updated_at: new Date(),
            },
          }
        )
        break
      }

      /**
       * ==============================
       * Payment failed
       * ==============================
       */
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        await users.updateOne(
          { stripeCustomerId: customerId },
          {
            $set: {
              subscription_status: 'past_due',
              updated_at: new Date(),
            },
          }
        )

        console.warn('⚠️ Payment failed for customer:', customerId)
        break
      }

      default:
        // Ignore unneeded events
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('❌ Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
