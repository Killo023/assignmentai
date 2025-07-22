'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Menu, X, Bot, LogIn, UserPlus, User, CreditCard, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { onAuthStateChanged, signOut, getAuth } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const navigation = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.getElementById(href.substring(1));
      element?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    const auth = getAuth();
    await signOut(auth);
    setCurrentUser(null);
    router.push('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 group-hover:text-primary-500 transition-colors">
              AssignmentAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-gray-600 hover:text-primary-500 font-medium transition-colors"
              >
                {item.name}
              </button>
            ))}
            {currentUser && (
              <Link href="/dashboard?tab=profile" className="flex items-center gap-1 text-gray-600 hover:text-primary-500 font-medium transition-colors">
                <CreditCard className="w-4 h-4" /> Billing & Account
              </Link>
            )}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!currentUser ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="gap-2">
                    <UserPlus className="w-4 h-4" />
                    Start Free Trial
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" className="gap-2" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-primary-500 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-4">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className="block w-full text-left text-gray-600 hover:text-primary-500 font-medium transition-colors py-2"
                  >
                    {item.name}
                  </button>
                ))}
                {currentUser && (
                  <Link href="/dashboard?tab=profile" className="flex items-center gap-1 text-gray-600 hover:text-primary-500 font-medium transition-colors py-2">
                    <CreditCard className="w-4 h-4" /> Billing & Account
                  </Link>
                )}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  {!currentUser ? (
                    <>
                      <Link href="/login" className="block">
                        <Button variant="ghost" size="sm" className="w-full justify-center gap-2">
                          <LogIn className="w-4 h-4" />
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/signup" className="block">
                        <Button size="sm" className="w-full justify-center gap-2">
                          <UserPlus className="w-4 h-4" />
                          Start Free Trial
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Button variant="outline" size="sm" className="w-full justify-center gap-2" onClick={handleSignOut}>
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
} 