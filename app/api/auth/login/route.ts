import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '../../../../lib/mongodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db('intuitv')  // CHANGED FROM 'creator-studio'
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

    // Check subscription status
    if (user.subscriptionStatus === 'canceled' || user.subscriptionStatus === 'expired') {
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

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user._id.toString(),
        email: user.email,
        subscriptionStatus: user.subscriptionStatus
      },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    )

    // Return token and user data
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        subscriptionStatus: user.subscriptionStatus,
        isPaid: user.isPaid,
        trialEnd: user.trialEnd
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Server error. Please try again.' },
      { status: 500 }
    )
  }
}
