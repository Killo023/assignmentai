'use client';

import { motion } from 'framer-motion';
import { Upload, Bot, Download, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: Upload,
      title: 'Upload Assignment',
      description: 'Simply drag and drop your assignment file (PDF, DOCX, XLSX) or paste text directly.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      number: '02',
      icon: Bot,
      title: 'AI Processes & Generates',
      description: 'Our advanced AI analyzes your requirements and generates comprehensive, university-level solutions.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      number: '03',
      icon: Download,
      title: 'Download or Refine',
      description: 'Download your completed assignment in any format or chat with AI to make refinements.',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            How It <span className="text-gradient">Works</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Get your assignments completed in just three simple steps
          </motion.p>
        </div>

        <div className="relative">
          {/* Connection lines for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 transform -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-4 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="text-center"
                >
                  {/* Step number */}
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-gray-100 shadow-lg mb-6 relative z-10">
                    <span className="text-2xl font-bold text-gray-400">{step.number}</span>
                  </div>
                  
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${step.bgColor} mb-6 mx-auto shadow-sm`}>
                    <step.icon className={`w-10 h-10 ${step.color}`} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                    {step.description}
                  </p>
                </motion.div>
                
                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center mt-8 mb-8">
                    <ArrowRight className="w-6 h-6 text-gray-400 transform rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Demo video or preview section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 md:p-12 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            See It In Action
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Watch how our AI transforms your assignment requirements into comprehensive, well-structured solutions in just minutes.
          </p>
          
          {/* Placeholder for demo video */}
          <div className="relative aspect-video bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-w-4xl mx-auto">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
              <div className="text-center">
                <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-4">
                  <div className="w-0 h-0 border-l-[20px] border-l-primary-500 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1" />
                </div>
                <p className="text-gray-600 font-medium">Demo Video Coming Soon</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 