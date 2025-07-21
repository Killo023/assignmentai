'use client';

import { Button } from '@/components/ui/Button';
import { FileText, FileSpreadsheet, MessageSquare, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  const supportedFormats = [
    { icon: FileText, label: 'PDF', color: 'text-red-500' },
    { icon: FileText, label: 'DOCX', color: 'text-blue-500' },
    { icon: FileSpreadsheet, label: 'XLSX', color: 'text-green-500' },
    { icon: MessageSquare, label: 'Gemini Chat', color: 'text-purple-500' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center gradient-bg overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
      
      <div className="container relative z-10 mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            AI-Powered
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              Assignment Assistant
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Upload any assignment and get university-level solutions in minutes. 
            Our AI understands context and delivers comprehensive, well-structured results.
          </p>
          
          {/* Supported formats badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-10"
          >
            <span className="text-white/80 font-medium">Supported formats:</span>
            {supportedFormats.map((format, index) => (
              <div key={format.label} className="flex items-center gap-1">
                <format.icon className={`w-4 h-4 ${format.color}`} />
                <span className="text-white text-sm font-medium">{format.label}</span>
              </div>
            ))}
          </motion.div>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/signup">
              <Button 
                size="lg" 
                className="bg-white text-primary-600 hover:bg-gray-100 font-bold px-8 py-4 text-lg h-14 animate-pulse-slow"
              >
                Start Free Trial
                <span className="ml-2">→</span>
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 font-medium px-8 py-4 text-lg h-14"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              How It Works
              <Download className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
          
          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-12 text-white/70"
          >
            <p className="text-sm mb-4">Trusted by 10,000+ students worldwide</p>
            <div className="flex justify-center items-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">4.9/5</div>
                <div className="text-xs">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-xs">AI Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">7 Days</div>
                <div className="text-xs">Free Trial</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 