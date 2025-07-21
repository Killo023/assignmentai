'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How does the AI assignment assistant work?',
      answer: 'Our AI analyzes your assignment requirements and generates comprehensive, university-level solutions. Simply upload your assignment file (PDF, DOCX, XLSX) or paste the text, and our advanced AI will process it to create well-structured, original content that meets academic standards.',
    },
    {
      question: 'Is the content plagiarism-free and original?',
      answer: 'Yes, absolutely. Our AI generates completely original content for each assignment. Every response is unique and created specifically for your requirements. We recommend using plagiarism checkers as an additional verification step, but our AI ensures all content is original.',
    },
    {
      question: 'What file formats are supported?',
      answer: 'We support PDF, DOCX (Word documents), and XLSX (Excel spreadsheets) for uploads. You can also paste text directly into our platform. For downloads, you can export your completed assignments in PDF, DOCX, or XLSX formats.',
    },
    {
      question: 'Can I get revisions or refinements to my assignment?',
      answer: 'Yes! Our chat feature allows you to interact with the AI to request changes, ask for clarifications, or get additional content. You can refine your assignment until it meets your exact requirements. Premium users get unlimited chat interactions.',
    },
    {
      question: 'How long does it take to complete an assignment?',
      answer: 'Most assignments are completed within 2-5 minutes, depending on complexity and length. Our AI works 24/7, so you can submit assignments anytime and get instant results. Complex research papers may take up to 10 minutes.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Frequently Asked <span className="text-gradient">Questions</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Everything you need to know about our AI assignment assistant
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="mb-4"
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 flex-shrink-0 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-gray-700 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact support */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-4">
              Our support team is here to help you 24/7
            </p>
            <button className="text-primary-500 hover:text-primary-600 font-medium">
              Contact Support →
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 