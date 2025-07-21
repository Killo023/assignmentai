'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Clock, Download, MessageSquare, Shield, Zap } from 'lucide-react';

export default function FeaturesGrid() {
  const features = [
    {
      icon: GraduationCap,
      title: 'University-Level Quality',
      description: 'Advanced AI ensures academic excellence with proper citations, structure, and depth.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Clock,
      title: '7-Day Free Trial',
      description: 'Experience full functionality risk-free. No credit card required to start.',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      icon: Download,
      title: 'Download Any Format',
      description: 'Export your completed assignments as PDF, DOCX, or XLSX with perfect formatting.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      icon: MessageSquare,
      title: 'Chat with AI for Refinements',
      description: 'Interactive AI chat to refine, expand, or modify your assignments until perfect.',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      icon: Shield,
      title: 'Plagiarism-Free Content',
      description: 'Original, unique content generated specifically for your assignment requirements.',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
    {
      icon: Zap,
      title: 'Lightning Fast Processing',
      description: 'Get your completed assignments in minutes, not hours. AI works 24/7.',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

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
            Powerful Features for
            <span className="text-gradient"> Academic Success</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Everything you need to excel in your academic assignments with cutting-edge AI technology
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.bgColor} mb-6`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">98%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">10K+</div>
              <div className="text-gray-600">Students Helped</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">50K+</div>
              <div className="text-gray-600">Assignments Completed</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">4.9★</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 