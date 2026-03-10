'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

type LoadingScreenProps = {
  fullScreen?: boolean;
  label?: string;
};

export default function LoadingScreen({
  fullScreen = true,
  label = 'Loading portfolio data'
}: LoadingScreenProps) {
  return (
    <div className={fullScreen ? 'relative flex min-h-screen items-center justify-center overflow-hidden' : 'relative flex min-h-[320px] items-center justify-center overflow-hidden'}>
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="relative flex h-36 w-36 items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-primary/30"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-3 rounded-full border-2 border-dashed border-accent/40"
          />
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-6 rounded-full border border-primary/20"
          />

          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-background/90 shadow-[0_0_40px_rgba(34,211,238,0.18)]">
            <Image
              src="/logo.png"
              alt="Rahul Kumar Logo"
              width={52}
              height={52}
              className="rounded-full object-contain"
              priority
            />
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm font-mono uppercase tracking-[0.35em] text-primary">AI GUIDE</p>
          <p className="mt-2 text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}
