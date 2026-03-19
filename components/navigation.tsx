'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, Linkedin, Briefcase, ImageIcon, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SiInstagram } from 'react-icons/si';
import ThemeToggle from '@/components/theme-toggle';
import Image from 'next/image';

const navItems = [
  { href: '/#about', label: 'About' },
  { href: '/#skills', label: 'Skills' },
  { href: '/#experience', label: 'Experience' },
  { href: '/contact', label: 'Contact' },
];
const dropdownItems = [
  { href: '/projects', label: 'Projects' },
  { href: '/assets', label: 'Assets' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileWorkOpen, setIsMobileWorkOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      setIsMobileWorkOpen(false);
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-2xl ${isScrolled ? 'glass-card backdrop-blur-2xl border-b border-border/50' : ''
          }`}
      >
        <nav className="container mx-auto px-4 py-2 md:py-4 flex items-center justify-between ">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-lg  opacity-80 group-hover:opacity-100 transition-opacity" />

              <div className="absolute inset-0.5 rounded-lg bg-background flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Rahul Kumar Logo"
                  width={32}
                  height={32}
                  className="object-contain rounded-full"
                  priority
                />
              </div>
            </div>

            <span className="hidden sm:block text-foreground font-semibold tracking-wide">
              Rahul Kumar
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>

                <Link
                  href={item.href}
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-1/2 transition-all duration-300" />
                </Link>

              </li>
            ))}
            <li className="relative group">
              <button
                type="button"
                className="px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors relative group inline-flex items-center"
                aria-haspopup="true"
              >
                Work
                <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-1/2 transition-all duration-300" />
              </button>
              <div className="absolute left-1/2 top-full z-50 w-48 -translate-x-1/2 pt-2 opacity-0 invisible translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0">
                <div className="rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-lg">
                  <ul className="py-2">
                    {dropdownItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors"
                        >
                          {item.href === '/projects' ? (
                            <Briefcase className="h-4 w-4" />
                          ) : (
                            <ImageIcon className="h-4 w-4" />
                          )}
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          </ul>

          {/* Social Links & CTA */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <Link
                href="https://github.com/rahulkumar-techo"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/rahul-kumar-6a225127a/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link
                href="https://www.instagram.com/mr_rpraja?igsh=MTl3amhnNmF4MXJ4Ng=="
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <SiInstagram className="w-5 h-5" />
              </Link>
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />

            {/* Social icons */}
            <Link
              href="https://github.com/rahulkumar-techo"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </Link>

            <Link
              href="https://www.linkedin.com/in/rahul-kumar-6a225127a/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </Link>

            <Link
              href="https://www.instagram.com/mr_rpraja"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <SiInstagram className="w-4 h-4" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-foreground"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-3/4 max-w-sm glass-card border-l border-border/50 p-8 pt-24"
            >
              <ul className="flex flex-col gap-4">
                {[navItems[0], navItems[1]].map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-3 text-lg text-foreground hover:text-primary transition-colors border-b border-border/30 flex items-center gap-2"
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}

                <motion.li
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <button
                    type="button"
                    onClick={() => setIsMobileWorkOpen((prev) => !prev)}
                    className="w-full pt-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between"
                    aria-expanded={isMobileWorkOpen}
                  >
                    Work
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${isMobileWorkOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                </motion.li>

                <AnimatePresence>
                  {isMobileWorkOpen && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col gap-2"
                    >
                      {dropdownItems.map((item, index) => (
                        <motion.li
                          key={item.href}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 + index * 0.05 }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="py-3 text-lg text-foreground hover:text-primary transition-colors border-b border-border/30 flex items-center gap-2"
                          >
                            {item.href === '/projects' ? (
                              <Briefcase className="h-5 w-5" />
                            ) : (
                              <ImageIcon className="h-5 w-5" />
                            )}
                            {item.label}
                          </Link>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>

                {[navItems[2], navItems[3]].map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-3 text-lg text-foreground hover:text-primary transition-colors border-b border-border/30 flex items-center gap-2"
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
