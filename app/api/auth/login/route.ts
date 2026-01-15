import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '../../../../lib/mongodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    /* ======================================================
       🚨 EMERGENCY OWNER ACCESS (SAFE, ENV-CONTROLLED)
    ====================================================== */
    if (
      process.env.EMERGENCY_LOGIN_ENABLED === 'true' &&
      email.toLowerCase() === process.env.EMERGENCY_LOGIN_EMAIL
    ) {
      const token = jwt.sign(
        {
          userId: 'EMERGENCY_OWNER',
          email,
          role: 'owner',
          subscriptionStatus: 'active',
        },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      )

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: 'EMERGENCY_OWNER',
          email,
          name: process.env.EMERGENCY_LOGIN_NAME || 'Owner',
          subscriptionStatus: 'active',
          isPaid: true,
          emergency: true,
        },
      })
    }

    /* ======================================================
       NORMAL LOGIN FLOW
    ====================================================== */

    const client = await clientPromise
    const db = client.db('intuitv')
    const users = db.collection('users')

    const user = await users.findOne({ email: email.toLowerCase() })

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    if (['canceled', 'expired'].includes(user.subscriptionStatus)) {
      return NextResponse.json({ error: 'Subscription expired' }, { status: 403 })
    }

    await users.updateOne(
      { _id: user._id },
      { $set: { lastLoginAt: new Date() } }
    )

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        subscriptionStatus: user.subscriptionStatus,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    )

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        subscriptionStatus: user.subscriptionStatus,
        isPaid: user.isPaid,
        trialEnd: user.trialEnd,
      },
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
