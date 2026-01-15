'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Play, Shield } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!formData.email || !formData.password) {
      setError('Email and password are required')
      return
    }

    setLoading(true)
    try {
      // Login via backend API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://api.intuitv.app'}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Store JWT + user info (includes name & company)
      if (data.access_token && data.user) {
        const { access_token, user } = data
        localStorage.setItem('auth_token', access_token)
        localStorage.setItem(
          'user',
          JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.name || '',
            company: user.company || '',
            trial_end: user.trial_end,
            subscription_status: user.subscription_status,
            needs_payment: user.needs_payment || false,
          })
        )
      }

      // Redirect to Playout
      window.location.href = `https://playout.intuitv.com?token=${data.access_token}`
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-space-blue via-deep-blue to-space-dark"></div>
      <div className="absolute inset-0 bg-grid opacity-10"></div>

      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan to-neon-purple rounded-lg rotate-45 opacity-80"></div>
            <Play className="absolute inset-2 text-white z-10" />
          </div>
          <div>
            <div className="font-orbitron font-bold text-2xl">IntuiTV</div>
            <div className="text-xs text-cyber-cyan">Creator Studio</div>
          </div>
        </Link>

        {/* Card */}
        <div className="glass-dark rounded-2xl p-8 border border-cyber-cyan/30 glow-cyan">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-orbitron font-bold mb-2">
              Welcome <span className="gradient-text">Back</span>
            </h1>
            <p className="text-gray-400">Sign in to continue creating</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@company.com"
                  required
                  disabled={loading}
                  autoFocus
                  className="w-full pl-12 pr-4 py-3 bg-space-dark/50 border border-cyber-cyan/20 rounded-lg focus:border-cyber-cyan focus:outline-none text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 bg-space-dark/50 border border-cyber-cyan/20 rounded-lg focus:border-cyber-cyan focus:outline-none text-white"
                />
              </div>
            </div>

            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-cyber-cyan hover:text-neon-purple transition">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-cyber-cyan/20">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link href="/signup" className="text-cyber-cyan hover:text-neon-purple transition font-semibold">
                Start Free Trial
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6 flex items-center justify-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyber-cyan" />
            <span>Secure Login</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyber-cyan" />
            <span>UK Data Protection</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
