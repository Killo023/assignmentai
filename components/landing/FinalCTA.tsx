'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowRight, CheckCircle, Mail } from 'lucide-react';
import Link from 'next/link';

export default function FinalCTA() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally send the email to your backend
    console.log('Email submitted:', email);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail('');
    }, 3000);
  };

  return (
    <section className="py-20 gradient-bg relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Transform Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Academic Success?
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join 10,000+ students who have already revolutionized their assignment workflow. 
              Start your free trial today and experience the future of academic assistance.
            </p>

            {/* Features highlight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                'University-level quality guaranteed',
                '7-day free trial, no credit card',
                'Chat with AI for perfect results'
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-lg p-4"
                >
                  <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0" />
                  <span className="text-white font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Main CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Link href="/signup">
                <Button 
                  size="lg" 
                  className="bg-white text-primary-600 hover:bg-gray-100 font-bold px-10 py-5 text-xl h-16 animate-pulse-slow"
                >
                  Start Your Free Trial
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </Link>
              
              <Link href="/login">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 font-medium px-10 py-5 text-xl h-16"
                >
                  Already have an account?
                </Button>
              </Link>
            </motion.div>

            {/* Email capture for updates */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-2xl mx-auto"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Mail className="w-6 h-6 text-white" />
                <h3 className="text-xl font-semibold text-white">
                  Get Updates & Tips
                </h3>
              </div>
              
              <p className="text-white/80 mb-6">
                Join our newsletter for academic success tips, new features, and exclusive offers
              </p>

              {!isSubmitted ? (
                <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30"
                  />
                  <Button 
                    type="submit"
                    variant="secondary"
                    size="lg"
                    className="whitespace-nowrap"
                  >
                    Subscribe
                  </Button>
                </form>
              ) : (
                <div className="flex items-center justify-center gap-2 text-green-300 font-medium">
                  <CheckCircle className="w-5 h-5" />
                  Thanks! You'll receive updates soon.
                </div>
              )}
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mt-12 text-white/70"
            >
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>30-day Money Back</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>24/7 Support</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 