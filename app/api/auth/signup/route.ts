import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '../../../../lib/mongodb'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, company } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('intuitv')
    const users = db.collection('users')

    const existingUser = await users.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const now = new Date()
    const trialEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)

    const userData = {
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      company: company || null,
      role: 'user',

      // ✅ FIX — make user immediately usable
      subscriptionStatus: 'trialing',
      isPaid: false,
      isTrialActive: true,
      trialEnd,
      currentPeriodEnd: trialEnd,

      stripeCustomerId: null,
      stripeSubscriptionId: null,
      lastPaymentDate: null,

      createdAt: now,
      updatedAt: now,
      lastLoginAt: null,
    }

    const result = await users.insertOne(userData)

    return NextResponse.json(
      {
        success: true,
        userId: result.insertedId.toString(),
        email: userData.email,
        name: userData.name,
      },
      { status: 201 }
    )

  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
