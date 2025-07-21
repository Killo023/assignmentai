'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Check, Star, Zap } from 'lucide-react';
import Link from 'next/link';

export default function PricingCard() {
  const plans = [
    {
      name: 'Free Trial',
      price: 0,
      period: '7 days',
      description: 'Perfect for trying out our AI assistant',
      features: [
        'Up to 5 assignments',
        'Basic AI processing',
        'PDF download only',
        'Email support',
        'No credit card required',
      ],
      buttonText: 'Start Free Trial',
      buttonVariant: 'outline' as const,
      popular: false,
    },
    {
      name: 'Premium',
      price: 49.99,
      period: 'month',
      description: 'Everything you need for academic success',
      features: [
        'Unlimited assignments',
        'Advanced AI processing',
        'All format downloads (PDF, DOCX, XLSX)',
        'Chat with AI for refinements',
        'Assignment history & management',
        'Priority support',
        'Plagiarism-free guarantee',
        '24/7 availability',
      ],
      buttonText: 'Get Premium',
      buttonVariant: 'default' as const,
      popular: true,
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Simple, <span className="text-gradient">Transparent Pricing</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Start with a free trial, then choose the plan that fits your academic needs
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? 'border-primary-500 ring-4 ring-primary-100' 
                  : 'border-gray-200 hover:border-primary-200'
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/signup" className="block">
                <Button
                  variant={plan.buttonVariant}
                  size="lg"
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white' 
                      : ''
                  }`}
                >
                  {plan.buttonText}
                  {plan.popular && <Zap className="ml-2 w-5 h-5" />}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Money-back guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 inline-block">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <span className="font-medium">30-day money-back guarantee</span>
            </div>
          </div>
        </motion.div>

        {/* FAQ Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-gray-600">
            Have questions? Check out our{' '}
            <button 
              onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-primary-500 hover:text-primary-600 font-medium underline"
            >
              frequently asked questions
            </button>
          </p>
        </motion.div>
      </div>
    </section>
  );
} 