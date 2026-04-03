'use client';

import { FileText, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type PdfPreviewProps = {
  alt: string;
  className?: string;
  src: string;
};

type PreviewState = 'idle' | 'loading' | 'ready' | 'error';

export default function PdfPreview({ alt, className = '', src }: PdfPreviewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [state, setState] = useState<PreviewState>('idle');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) {
          return;
        }

        setIsVisible(true);
        observer.disconnect();
      },
      { rootMargin: '200px' }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    let cancelled = false;
    let loadingTask: { destroy?: () => void; promise: Promise<any> } | null = null;
    let renderTask: { cancel?: () => void; promise?: Promise<void> } | null = null;

    const renderPreview = async () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      setState('loading');

      try {
        const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

        if (!pdfjs.GlobalWorkerOptions.workerSrc) {
          pdfjs.GlobalWorkerOptions.workerSrc = new URL(
            'pdfjs-dist/build/pdf.worker.min.mjs',
            import.meta.url
          ).toString();
        }

        loadingTask = pdfjs.getDocument({
          url: src,
          useSystemFonts: true
        });

        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        if (cancelled) {
          pdf.cleanup();
          return;
        }

        const baseViewport = page.getViewport({ scale: 1 });
        const targetWidth = 480;
        const scale = targetWidth / baseViewport.width;
        const devicePixelRatio =
          typeof window === 'undefined' ? 1 : Math.min(window.devicePixelRatio || 1, 2);
        const viewport = page.getViewport({ scale: scale * devicePixelRatio });
        const context = canvas.getContext('2d', { alpha: false });

        if (!context) {
          setState('error');
          pdf.cleanup();
          return;
        }

        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        canvas.setAttribute('aria-label', alt);

        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);

        const nextRenderTask = page.render({
          canvasContext: context,
          viewport
        });
        renderTask = nextRenderTask;

        await nextRenderTask.promise;

        if (!cancelled) {
          setState('ready');
        }

        page.cleanup();
        pdf.cleanup();
      } catch {
        if (!cancelled) {
          setState('error');
        }
      }
    };

    void renderPreview();

    return () => {
      cancelled = true;
      renderTask?.cancel?.();
      loadingTask?.destroy?.();
    };
  }, [alt, isVisible, src]);

  return (
    <div ref={containerRef} className={`relative h-full w-full ${className}`}>
      <canvas
        ref={canvasRef}
        className={`h-full w-full object-contain ${state === 'ready' ? 'opacity-100' : 'opacity-0'}`}
      />
      {state !== 'ready' ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-secondary/20 text-muted-foreground">
          {state === 'loading' ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
          ) : (
            <FileText className="h-8 w-8 text-primary/60" />
          )}
          <span className="px-3 text-center text-xs font-mono uppercase tracking-[0.2em]">
            PDF Preview
          </span>
        </div>
      ) : null}
    </div>
  );
}
