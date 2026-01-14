import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, company } = await request.json()

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db('intuitv')  // CHANGED FROM 'creator-studio'
    const users = db.collection('users')

    // Check if user exists
    const existingUser = await users.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user document
    const now = new Date()
    const userData = {
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      company: company || null,
      role: 'user',
      
      // Subscription fields
      subscriptionStatus: 'pending', // Will change to 'trialing' after Stripe
      isPaid: false,
      isTrialActive: false,
      trialEnd: null,
      currentPeriodEnd: null,
      
      // Stripe fields (filled after checkout)
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      lastPaymentDate: null,
      
      // Timestamps
      createdAt: now,
      updatedAt: now,
      lastLoginAt: null,
    }

    // Insert user
    const result = await users.insertOne(userData)
    const userId = result.insertedId.toString()

    // Return user ID for Stripe checkout
    return NextResponse.json({
      success: true,
      userId: userId,
      email: userData.email,
      name: userData.name
    }, { status: 201 })

  } catch (error: any) {
    console.error('Signup error:', error)
    
    // Better error messages
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Server error. Please try again.' },
      { status: 500 }
    )
  }
}
