

'use client'

import { motion } from 'framer-motion'
import { Sparkles, Zap, Video, Wand2, Play, ArrowRight, Check, Globe, Shield, Cpu, Users, TrendingUp, Heart } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-dark border-b border-cyber-cyan/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan to-neon-purple rounded-lg rotate-45 opacity-80"></div>
                <Play className="absolute inset-2 text-white z-10" />
              </div>
              <div>
                <div className="font-orbitron font-bold text-xl">IntuiTV</div>
                <div className="text-xs text-cyber-cyan">Creator Studio</div>
              </div>
            </Link>
            
            {/* ✅ REMOVED Dashboard LINK */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-300 hover:text-cyber-cyan transition">Features</Link>
              <Link href="#workflow" className="text-gray-300 hover:text-cyber-cyan transition">Workflow</Link>
              <Link href="#pricing" className="text-gray-300 hover:text-cyber-cyan transition">Pricing</Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-300 hover:text-cyber-cyan transition">
                Sign In
              </Link>
              <Link href="/signup" className="btn-primary">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Sparkles className="w-4 h-4 text-cyber-cyan" />
              <span className="text-sm text-gray-300">Powered by MOTHER AI • UK Sovereign Infrastructure</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-orbitron font-bold mb-6">
              Create Like a <span className="gradient-text">Professional</span>
              <br />Work at the Speed of <span className="gradient-text">AI</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Transform your ideas into stunning content with MOTHER AI-powered tools. 
              Professional video creation, animation, and editing - no experience needed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/signup" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Start Creating Free
              </Link>
              <Link href="#demo" className="btn-outline text-lg px-8 py-4 inline-flex items-center gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </Link>
            </div>

            {/* ✅ CHANGED to 14 Days */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyber-cyan" />
                14 Days Free Access
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyber-cyan" />
                No Credit Card Required
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyber-cyan" />
                Cancel Anytime
              </div>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative max-w-6xl mx-auto"
          >
            <div className="glass-dark rounded-2xl p-8 glow-cyan">
              <div className="aspect-video bg-gradient-to-br from-space-blue via-deep-blue to-space-dark rounded-xl flex items-center justify-center border border-cyber-cyan/30">
                <Play className="w-20 h-20 text-cyber-cyan opacity-50" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4">
              Everything You Need to <span className="gradient-text">Create</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Professional-grade tools powered by UK sovereign AI infrastructure
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Video className="w-8 h-8" />,
                title: 'AI Video Generation',
                description: 'Transform text into stunning videos with MOTHER AI. Multiple styles, instant results.'
              },
              {
                icon: <Wand2 className="w-8 h-8" />,
                title: 'Smart Editing',
                description: 'Professional editing tools with AI assistance. No experience needed.'
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Lightning Fast',
                description: 'Generate content in seconds, not hours. Powered by H200 GPUs.'
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: 'Multi-Platform',
                description: 'Export for YouTube, TikTok, Instagram, and more with one click.'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'UK Data Sovereignty',
                description: 'Your data stays in the UK. GDPR compliant, enterprise-grade security.'
              },
              {
                icon: <Cpu className="w-8 h-8" />,
                title: 'Advanced AI Models',
                description: 'Access to LLaMA, Stable Diffusion, and custom MOTHER models.'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-dark p-6 rounded-xl border border-cyber-cyan/20 hover:border-cyber-cyan/50 transition group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-cyber-cyan to-neon-purple rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4">
              Simple <span className="gradient-text">Workflow</span>
            </h2>
            <p className="text-xl text-gray-400">
              From idea to published content in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: '01',
                title: 'Describe Your Vision',
                description: 'Tell MOTHER AI what you want to create. Simple text prompts, powerful results.'
              },
              {
                number: '02',
                title: 'AI Creates',
                description: 'Watch as your content is generated in real-time. Edit, refine, perfect.'
              },
              {
                number: '03',
                title: 'Publish Everywhere',
                description: 'Export to all platforms with optimized formats. Schedule posts, track performance.'
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="glass-dark p-8 rounded-xl border border-neon-purple/30 hover:border-neon-purple/60 transition">
                  <div className="text-6xl font-orbitron font-bold text-neon-purple/20 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
                {i < 2 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-8 text-cyber-cyan" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4">
              Simple <span className="gradient-text">Pricing</span>
            </h2>
            <p className="text-xl text-gray-400">
              Start free, scale as you grow
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Trial */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="glass-dark p-8 rounded-2xl border border-cyber-cyan/30"
            >
              <h3 className="text-2xl font-bold mb-2">Free Trial</h3>
              <div className="text-4xl font-orbitron font-bold mb-4">
                £0 <span className="text-base text-gray-400 font-normal">for 14 days</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Full access to all features',
                  '10 video generations',
                  '5GB storage',
                  'Community support',
                  'No credit card required'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-cyber-cyan" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="btn-outline w-full block text-center">
                Start Free Trial
              </Link>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="glass-dark p-8 rounded-2xl border border-neon-purple/50 glow-purple relative"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyber-cyan to-neon-purple rounded-full text-sm font-bold">
                POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-orbitron font-bold mb-4">
                £49 <span className="text-base text-gray-400 font-normal">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited video generations',
                  '100GB storage',
                  'Priority GPU access',
                  'Advanced AI models',
                  'Priority support',
                  'Custom branding',
                  'Team collaboration'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-neon-purple" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="btn-primary w-full block text-center">
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass-dark p-12 rounded-2xl border border-cyber-cyan/30 glow-cyan"
          >
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4">
              Ready to Create?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join creators using MOTHER AI to transform their content
            </p>
            <Link href="/signup" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Start Your 14-Day Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyber-cyan/20 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-cyber-cyan to-neon-purple rounded-lg"></div>
                <span className="font-orbitron font-bold">IntuiTV</span>
              </div>
              <p className="text-gray-400 text-sm">
                UK sovereign AI-powered content creation platform
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-cyber-cyan transition">Features</Link></li>
                <li><Link href="#workflow" className="hover:text-cyber-cyan transition">Workflow</Link></li>
                <li><Link href="#pricing" className="hover:text-cyber-cyan transition">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-cyber-cyan transition">About</Link></li>
                <li><Link href="/contact" className="hover:text-cyber-cyan transition">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-cyber-cyan transition">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-cyber-cyan transition">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-cyber-cyan transition">Terms</Link></li>
                <li><Link href="/gdpr" className="hover:text-cyber-cyan transition">GDPR</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-cyber-cyan/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2026 Media Stream AI Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <span>🇬🇧 UK Sovereign Infrastructure</span>
              <span>•</span>
              <span>GDPR Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
