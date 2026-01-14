import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('creator-studio')
    const users = db.collection('users')

    // Check if user exists
    const existingUser = await users.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user with 2-day trial
    const trialEnds = new Date()
    trialEnds.setDate(trialEnds.getDate() + 2)

    const user = {
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
      trialEnds,
      isTrialActive: true,
      isPaid: false,
      stripeCustomerId: null,
      subscriptionStatus: 'trial',
      role: 'creator',
    }

    const result = await users.insertOne(user)

    // Create JWT token
    const token = jwt.sign(
      { userId: result.insertedId, email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '30d' }
    )

    // Create user CMS folder
    const cms = db.collection('cms_content')
    await cms.insertOne({
      userId: result.insertedId,
      folders: [],
      assets: [],
      createdAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: result.insertedId,
        email,
        name,
        trialEnds,
        isTrialActive: true,
      },
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
