import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '../../../../lib/mongodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db('intuitv')
    const users = db.collection('users')

    // Find user
    const user = await users.findOne({ email: email.toLowerCase() })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Subscription guard (aligned with schema)
    if (
      user.subscription_status === 'canceled' ||
      user.subscription_status === 'expired'
    ) {
      return NextResponse.json(
        { error: 'Subscription expired. Please renew.' },
        { status: 403 }
      )
    }

    // Update last login
    await users.updateOne(
      { _id: user._id },
      { $set: { lastLoginAt: new Date() } }
    )

    // Create JWT (schema-consistent)
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        subscription_status: user.subscription_status,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    )

    // Return normalized user payload
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name || '',
        company: user.company || '',
        subscription_status: user.subscription_status,
        isPaid: user.isPaid || false,
        trial_end: user.trial_end || null,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Server error. Please try again.' },
      { status: 500 }
    )
  }
}
