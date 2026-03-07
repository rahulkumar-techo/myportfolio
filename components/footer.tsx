'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Heart, ArrowUp } from 'lucide-react';
import { developerProfile } from '@/lib/data';

const footerLinks = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
  { href: '/admin', label: 'Admin', isExternal: true },
];

const socialLinks = [
  { icon: Github, href: developerProfile.socialLinks.github || '#', label: 'GitHub' },
  { icon: Linkedin, href: developerProfile.socialLinks.linkedin || '#', label: 'LinkedIn' },
  { icon: Twitter, href: developerProfile.socialLinks.twitter || '#', label: 'Twitter' },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-12 border-t border-border/50">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-accent opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0.5 rounded-lg bg-background flex items-center justify-center">
                  <span className="text-primary font-bold text-lg font-mono">RK</span>
                </div>
              </div>
              <span className="text-foreground font-semibold">Rahul kumar</span>
            </Link>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Building digital experiences of tomorrow
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-4">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm  transition-colors ${link?.isExternal ? "hover:underline text-green-500 hover:text-green-800":"text-muted-foreground hover:text-primary"}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> using Next.js & Three.js
          </p>
          
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {developerProfile.name}. All rights reserved.
          </p>
          
          {/* Scroll to Top */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 glass rounded-lg text-muted-foreground hover:text-primary transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
