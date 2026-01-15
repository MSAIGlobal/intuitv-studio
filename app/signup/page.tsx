'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Play } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('Submitting signup...', { email: formData.email, name: formData.name })
      
// Create account
const signupRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.intuitv.app'}/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
})


      console.log('Signup response status:', signupRes.status)
      
      if (!signupRes.ok) {
        const data = await signupRes.json()
        throw new Error(data.error || 'Signup failed')
      }

      const { userId } = await signupRes.json()
      console.log('User created:', userId)

      // Create Stripe checkout session
      const stripeRes = await fetch('/api/stripe/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          email: formData.email,
          successUrl: `${process.env.NEXT_PUBLIC_PLAYOUT_URL}?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${process.env.NEXT_PUBLIC_STUDIO_URL}/signup`
        })
      })

      if (!stripeRes.ok) {
        const data = await stripeRes.json()
        throw new Error(data.error || 'Failed to create checkout session')
      }

      const { url } = await stripeRes.json()
      console.log('Redirecting to Stripe:', url)
      
      window.location.href = url

    } catch (err: any) {
      console.error('Signup error:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center mb-4">
            <Play className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Start Your Free Trial</h1>
          <p className="text-slate-400">14 days free, then £49/month</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
              placeholder="Chris Williams"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
              placeholder="Min. 8 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Company (Optional)
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
              placeholder="Media Stream AI"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-2xl hover:shadow-cyan-500/50 transition-all disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Continue to Payment'}
          </button>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-cyan-400 hover:text-cyan-300"
            >
              Sign In
            </button>
          </p>

          <p className="text-xs text-slate-500 text-center">
            By signing up, you'll be redirected to Stripe to set up your 14-day free trial. 
            Your card won't be charged until day 14.
          </p>
        </form>
      </div>
    </div>
  )
}
