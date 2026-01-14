'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Building2, Users, Shield } from 'lucide-react'
import Link from 'next/link'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    teamSize: '',
    message: '',
  })
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    setTimeout(() => {
      setSuccess(true)
      setLoading(false)
      setFormData({
        name: '',
        email: '',
        company: '',
        teamSize: '',
        message: '',
      })
    }, 1500)
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-orbitron font-bold mb-6">
              Let's Build <span className="gradient-text">Together</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Enterprise solutions, custom integrations, and dedicated support for teams.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-dark rounded-2xl p-8 border border-cyber-cyan/30"
            >
              <h2 className="text-3xl font-orbitron font-bold mb-6">Get in Touch</h2>
              
              {success ? (
                <div className="bg-cyber-cyan/10 border border-cyber-cyan/50 rounded-lg p-6 text-center">
                  <div className="w-16 h-16 bg-cyber-cyan/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-cyber-cyan" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-gray-300">We'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="btn-outline mt-6"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Company</label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Your company"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Team Size</label>
                    <select
                      required
                      value={formData.teamSize}
                      onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                      className="bg-space-blue/50"
                    >
                      <option value="">Select team size</option>
                      <option value="1-10">1-10 people</option>
                      <option value="11-50">11-50 people</option>
                      <option value="51-200">51-200 people</option>
                      <option value="201+">201+ people</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your project..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="spinner"></div>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="glass-dark rounded-2xl p-8 border border-cyber-cyan/30">
                <h3 className="text-2xl font-orbitron font-bold mb-6">Enterprise Features</h3>
                <ul className="space-y-4">
                  {[
                    'Custom branding and white-label options',
                    'Dedicated account manager',
                    'Priority 24/7 support',
                    'Custom integrations and API access',
                    'Team collaboration tools',
                    'Advanced analytics and reporting',
                    'SLA guarantees',
                    'On-premise deployment options',
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-cyber-cyan/20 flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-cyber-cyan"></div>
                      </div>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-dark rounded-2xl p-8 border border-cyber-cyan/30">
                <h3 className="text-2xl font-orbitron font-bold mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-cyber-cyan mt-1" />
                    <div>
                      <div className="font-semibold mb-1">Email</div>
                      <a href="mailto:enterprise@intuitv.app" className="text-gray-400 hover:text-cyber-cyan">
                        enterprise@intuitv.app
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-cyber-cyan mt-1" />
                    <div>
                      <div className="font-semibold mb-1">Phone</div>
                      <a href="tel:+442071234567" className="text-gray-400 hover:text-cyber-cyan">
                        +44 20 7123 4567
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-cyber-cyan mt-1" />
                    <div>
                      <div className="font-semibold mb-1">UK Headquarters</div>
                      <p className="text-gray-400">
                        Media Stream AI Limited<br />
                        Manchester, United Kingdom
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Shield className="w-6 h-6 text-cyber-cyan mt-1" />
                    <div>
                      <div className="font-semibold mb-1">Data Sovereignty</div>
                      <p className="text-gray-400">
                        All data stored on UK infrastructure
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Link href="/" className="text-gray-400 hover:text-cyber-cyan transition">
            ← Back to home
          </Link>
        </div>
      </section>
    </div>
  )
}
