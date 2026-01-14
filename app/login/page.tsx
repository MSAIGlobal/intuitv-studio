
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
      // Login with MongoDB backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Store JWT token
      if (data.token) {
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      // Success! Redirect to playout.intuitv.com
      console.log('Login successful! Redirecting to playout...')
      
      // Redirect to playout with token in URL
      window.location.href = `https://playout.intuitv.com?token=${data.token}`

    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-space-blue via-deep-blue to-space-dark"></div>
      <div className="absolute inset-0 bg-grid opacity-10"></div>

      {/* Content */}
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

        {/* Form Card */}
        <div className="glass-dark rounded-2xl p-8 border border-cyber-cyan/30 glow-cyan">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-orbitron font-bold mb-2">
              Welcome <span className="gradient-text">Back</span>
            </h1>
            <p className="text-gray-400">
              Sign in to continue creating
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-space-dark/50 border border-cyber-cyan/20 rounded-lg focus:border-cyber-cyan focus:outline-none text-white"
                  placeholder="you@company.com"
                  required
                  disabled={loading}
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-space-dark/50 border border-cyber-cyan/20 rounded-lg focus:border-cyber-cyan focus:outline-none text-white"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-cyber-cyan hover:text-neon-purple transition">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
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

          {/* Signup Link */}
          <div className="text-center mt-6 pt-6 border-t border-cyber-cyan/20">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link href="/signup" className="text-cyber-cyan hover:text-neon-purple transition font-semibold">
                Start Free Trial
              </Link>
            </p>
          </div>
        </div>

        {/* Security Badge */}
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
