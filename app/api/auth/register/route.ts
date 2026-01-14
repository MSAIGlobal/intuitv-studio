
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { connectToDatabase } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const { name, email, company, password } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
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
    const { db } = await connectToDatabase()

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Calculate trial dates
    const now = new Date()
    const trialEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000) // 14 days

    // Create user
    const user = {
      name,
      email: email.toLowerCase(),
      company: company || null,
      password: hashedPassword,
      trial_start: now,
      trial_end: trialEnd,
      subscription_status: 'trial',
      stripe_customer_id: null,
      stripe_subscription_id: null,
      created_at: now,
      updated_at: now,
    }

    const result = await db.collection('users').insertOne(user)

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: result.insertedId.toString(),
        email: user.email,
      },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '30d' }
    )

    // Return success with token
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: result.insertedId.toString(),
        name: user.name,
        email: user.email,
        company: user.company,
        trial_end: user.trial_end,
        subscription_status: user.subscription_status,
      },
    })

  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}

