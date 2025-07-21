import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AssignmentAI - AI-Powered Assignment Assistant',
  description: 'Upload any assignment and get university-level solutions in minutes. Advanced AI technology for academic success.',
  keywords: 'AI assignment help, academic writing, university assignments, homework assistance, AI tutor',
  authors: [{ name: 'AssignmentAI Team' }],
  creator: 'AssignmentAI',
  publisher: 'AssignmentAI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://assignmentai.com',
    title: 'AssignmentAI - AI-Powered Assignment Assistant',
    description: 'Upload any assignment and get university-level solutions in minutes. Advanced AI technology for academic success.',
    siteName: 'AssignmentAI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AssignmentAI - AI-Powered Assignment Assistant',
    description: 'Upload any assignment and get university-level solutions in minutes. Advanced AI technology for academic success.',
    creator: '@assignmentai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
} 