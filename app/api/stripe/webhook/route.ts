import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import clientPromise from '../../../../lib/mongodb'

import { ObjectId } from 'mongodb'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
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
    const db = client.db('intuitv')
    const users = db.collection('users')

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const customerId = session.customer as string
        const subscriptionId = session.subscription as string
        
        if (userId) {
          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          
          await users.updateOne(
            { _id: new ObjectId(userId) },
            {
              $set: {
                isPaid: false, // Still in trial
                subscriptionStatus: 'trialing',
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscriptionId,
                trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
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
        
        // Check if trial just ended and payment succeeded
        const isPaid = subscription.status === 'active' && !subscription.trial_end
        
        await users.updateOne(
          { stripeCustomerId: customerId },
          {
            $set: {
              isPaid: isPaid,
              subscriptionStatus: subscription.status,
              trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
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
        
        // Also notify backend to revoke access
        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/revoke-access`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customerId })
          })
        } catch (err) {
          console.error('Failed to notify backend:', err)
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string
        const subscriptionId = invoice.subscription as string
        
        // Payment succeeded - user now has paid access
        await users.updateOne(
          { stripeCustomerId: customerId },
          {
            $set: {
              isPaid: true,
              subscriptionStatus: 'active',
              lastPaymentDate: new Date(),
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
        
        // Send warning email (optional)
        console.log('Payment failed for customer:', customerId)
        break
      }

      case 'invoice.upcoming': {
        // 7 days before charge - send reminder email
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string
        
        console.log('Upcoming payment for customer:', customerId)
        // TODO: Send email reminder
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
