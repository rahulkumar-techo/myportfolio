'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

interface ThemeToggleProps {
  className?: string;
  logoOnly?: boolean;
}

export default function ThemeToggle({ className = '', logoOnly = false }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme !== 'light' : true;

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`glass-card inline-flex items-center gap-2 rounded-lg border border-transparent text-sm text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/10 hover:text-foreground ${logoOnly ? 'h-9 w-9 justify-center p-0' : 'px-3 py-2'} ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {logoOnly ? (
        <Image
          src="/logo.png"
          alt="Theme toggle logo"
          width={20}
          height={20}
          className="rounded-full object-contain"
        />
      ) : (
        <>
          {isDark ? <Sun className="h-4 w-4 text-primary" /> : <Moon className="h-4 w-4 text-primary" />}
          <span className="font-mono md:flex hidden">{isDark ? 'Light' : 'Dark'}</span>
        </>
      )}
    </button>
  );
}
