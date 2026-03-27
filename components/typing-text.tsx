'use client';

import { useEffect, useState } from 'react';

type TypingTextProps = {
  text: string;
  speed?: number;
  delay?: number;
  loop?: boolean;
  pause?: number;
  className?: string;
  cursorClassName?: string;
};

export default function TypingText({
  text,
  speed = 35,
  delay = 0,
  loop = false,
  pause = 1400,
  className,
  cursorClassName,
}: TypingTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setReduceMotion(true);
      setDisplayText(text);
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const typeNext = (index: number) => {
      if (cancelled) {
        return;
      }

      setDisplayText(text.slice(0, index));
      if (index < text.length) {
        timeoutId = setTimeout(() => typeNext(index + 1), speed);
        return;
      }

      if (loop) {
        timeoutId = setTimeout(() => typeNext(0), pause);
      }
    };

    const startTimeout = setTimeout(() => {
      typeNext(1);
    }, delay);

    return () => {
      cancelled = true;
      clearTimeout(startTimeout);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [text, speed, delay, loop, pause]);

  const cursorClasses =
    cursorClassName ?? 'ml-1 inline-block h-[0.85em] w-0.5 bg-current align-[-0.05em] animate-pulse';

  return (
    <span className={`relative inline-block max-w-full align-baseline overflow-hidden ${className ?? ''}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="invisible whitespace-normal break-words">
        {text}
      </span>
      <span aria-hidden="true" className="absolute inset-0 whitespace-normal break-words pointer-events-none">
        {reduceMotion ? text : displayText}
        {!reduceMotion ? <span className={cursorClasses} /> : null}
      </span>
    </span>
  );
}
