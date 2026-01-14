'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Zap, Tv, Brain, Globe, Shield, TrendingUp, 
  Play, Users, Award, Check, ArrowRight 
} from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleGetStarted = () => {
    setIsLoading(true)
    router.push('/signup')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
                <Play className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">IntuiTV</span>
            </div>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-2 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
              AI-Powered Television
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                Production Platform
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Create, manage, and broadcast professional content with sovereign AI infrastructure. 
              Built for the future of UK broadcasting.
            </p>
            <button
              onClick={handleGetStarted}
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg text-lg font-semibold hover:shadow-2xl hover:shadow-cyan-500/50 transition-all disabled:opacity-50 flex items-center gap-2 mx-auto"
            >
              {isLoading ? 'Loading...' : (
                <>
                  Start Free 14-Day Trial
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="text-sm text-slate-400 mt-4">
              No credit card required • Full access • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'AI Content Creation',
                description: 'MOTHER LLM generates scripts, videos, and audio automatically'
              },
              {
                icon: Tv,
                title: 'Live Broadcasting',
                description: 'Professional playout and scheduling with HLS streaming'
              },
              {
                icon: Shield,
                title: 'UK Sovereign AI',
                description: 'Data stays in UK data centers. GDPR compliant.'
              },
              {
                icon: TrendingUp,
                title: 'Real-time Analytics',
                description: 'Track viewers, engagement, and performance metrics'
              },
              {
                icon: Globe,
                title: 'Multi-Platform',
                description: 'Deploy to social media, OTT, and linear channels'
              },
              {
                icon: Zap,
                title: 'GPU Acceleration',
                description: '304 GPUs across 5 data centers for instant processing'
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-xl bg-slate-900/50 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors"
              >
                <feature.icon className="w-12 h-12 text-cyan-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-slate-400">14-day free trial, then £49/month</p>
          </div>
          
          <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-cyan-500/30">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">Professional</h3>
                <p className="text-slate-400">Everything you need to create amazing content</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-white">£49</div>
                <div className="text-slate-400">per month</div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {[
                'Unlimited AI Content Generation',
                'Live Broadcasting & Playout',
                'Real-time Analytics Dashboard',
                'Video Editor Suite',
                'Multi-Channel Management',
                'UK Data Sovereignty',
                'Priority Support',
                'API Access'
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-cyan-400" />
                  <span className="text-slate-300">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleGetStarted}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg text-lg font-semibold hover:shadow-2xl hover:shadow-cyan-500/50 transition-all"
            >
              Start Free Trial
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          <p>© 2026 Media Stream AI Ltd. UK Sovereign AI Infrastructure.</p>
          <p className="mt-2">Manchester • Liverpool • Durham • Düsseldorf • Marseille</p>
        </div>
      </footer>
    </div>
  )
}
