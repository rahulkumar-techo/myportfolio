'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, Mail, MapPin, Phone, Github, Linkedin, Twitter, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { usePublicSettings } from '@/hooks/useSettings';
import { useContact } from '@/hooks/useContact';

export default function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { user, loginWithGoogle } = useAuth();
  const { settings } = usePublicSettings();
  const { sendMessage } = useContact();
  const initAudioContext = async () => {
    if (audioContextRef.current) {
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      return;
    }

    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
    } catch {
      audioContextRef.current = null;
    }
  };

  const playNotification = () => {
    try {
      // Simple, dependency-free notification sound for successful message sends.
      const audioContext = audioContextRef.current;
      if (!audioContext) {
        return;
      }

      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = 880;
      gain.gain.value = 0.05;

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.15);
    } catch {
      // Ignore audio failures (e.g., autoplay restrictions).
    }
  };

  const showWebNotification = () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'granted') {
      // Comment: Light system notification to confirm the message was sent.
      new Notification('Message sent', {
        body: 'Thanks for reaching out. I will get back to you soon.'
      });
    }
  };

  const socialLinks = [
    { icon: Github, href: settings?.githubUrl || '#', label: 'GitHub' },
    { icon: Linkedin, href: settings?.linkedinUrl || '#', label: 'LinkedIn' },
    { icon: Twitter, href: settings?.twitterUrl || '#', label: 'Twitter' },
  ].filter((link) => link.href && link.href !== '#');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user?.provider !== 'google') {
      setSubmitError('Please sign in with Google to send a message.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    // Comment: initialize audio context while we still have a user gesture.
    await initAudioContext();

    const formElement =
      e.currentTarget instanceof HTMLFormElement
        ? e.currentTarget
        : e.target instanceof HTMLFormElement
          ? e.target
          : null;

    if (!formElement) {
      setSubmitError('Unable to submit the form. Please refresh and try again.');
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData(formElement);

    try {
      await sendMessage({
        name: user?.name || formData.get('name'),
        email: user?.email,
        subject: formData.get('subject'),
        message: formData.get('message')
      });

      setIsSubmitted(true);
      playNotification();
      showWebNotification();
      e.currentTarget.reset();
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error: any) {
      setSubmitError(error?.response?.data?.error || 'Unable to send your message right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 md:py-32 overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-primary/10 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 mb-4 glass-card rounded-full text-sm font-mono text-primary">
            <Send className="w-4 h-4" />
            CONTACT
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Let&apos;s </span>
            <span className="text-accent text-glow-purple">Connect</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? Let&apos;s build something amazing together
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Info Cards */}
            <div className="space-y-4">
              <div className="glass-card rounded-xl p-6 hover:border-primary/30 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                      <Link
                      href={`mailto:${settings?.contactEmail || ''}`}
                      className="text-foreground hover:text-primary transition-colors"
                    >
                      {settings?.contactEmail || 'No contact email set'}
                    </Link>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-6 hover:border-primary/30 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="text-foreground">{settings?.location || 'Location not set'}</p>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-6 hover:border-primary/30 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Availability</p>
                    <p className="text-foreground">Open for new opportunities</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4">Connect with me</h4>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                    aria-label={social.label}
                  >
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="w-12 h-12 glass-card rounded-xl flex items-center justify-center group-hover:border-primary/50 transition-colors"
                    >
                      <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Decorative Console */}
            <div className="glass-card rounded-xl p-4 font-mono text-sm">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border/50">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <span className="text-muted-foreground text-xs ml-2">terminal</span>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">
                  <span className="text-primary">$</span> status --check
                </p>
                <p className="text-green-500">
                  {'>'} Available for hire: <span className="text-foreground">true</span>
                </p>
                <p className="text-green-500">
                  {'>'} Response time: <span className="text-foreground">{'<'} 24h</span>
                </p>
                <p className="text-muted-foreground flex items-center gap-2">
                  <span className="text-primary">$</span>
                  <span className="animate-pulse">_</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
              {/* Top Glow Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-2">Message Sent!</h4>
                  <p className="text-muted-foreground">
                    Thank you for reaching out. I&apos;ll get back to you soon.
                  </p>
                </motion.div>
              ) : user?.provider !== 'google' ? (
                <div className="space-y-4 py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Sign in with Google to send one verified message. Each user can submit one message only.
                  </p>
                  <Button type="button" onClick={() => void loginWithGoogle('/contact')} className="w-full">
                    Sign in with Google
                  </Button>
                  {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="rounded-xl border border-border/60 bg-secondary/20 px-4 py-3 text-sm text-muted-foreground">
                    Signed in as <span className="text-foreground">{user?.name || user?.email}</span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-foreground">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      required
                      placeholder="Project Inquiry"
                      className="bg-secondary/50 border-border focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-foreground">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Tell me about your project..."
                      className="bg-secondary/50 border-border focus:border-primary resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>

                  {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
