'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Mail, Calendar, Code2, Coffee, Rocket } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePublicProfile } from '@/hooks/usePublicProfile';

export default function AboutSection() {

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { profile } = usePublicProfile()

  const rawAvatarUrl = typeof profile?.profile.image === 'string' ? profile.profile.image.trim() : ''
  const isGoogleAvatar = /googleusercontent\.com|ggpht\.com/i.test(rawAvatarUrl)
  const avatarUrl = !isGoogleAvatar && rawAvatarUrl ? rawAvatarUrl : '/avatar.png'
  const profileName = profile?.profile.name || profile?.settings.siteTitle || 'Portfolio Owner'
  const location = profile?.settings.location || 'Location not set'
  const email = profile?.settings.contactEmail || profile?.profile.email || 'Email not set'
  const bio = profile?.settings.bio || 'Use admin settings to describe your background and strengths.'
  const stats = [
    {
      icon: Calendar,
      value: profile?.stats.yearsExperience ?? 0,
      label: 'Years Experience',
      suffix: '+',
    },
    {
      icon: Rocket,
      value: profile?.stats.totalProjects ?? 0,
      label: 'Projects Completed',
      suffix: '',
    },
    {
      icon: Coffee,
      value: profile?.stats.testimonials ?? 0,
      label: 'Testimonials',
      suffix: '',
    },
  ]

  return (

    <section
      id="about"
      ref={ref}
      className="relative py-20 md:py-28 lg:py-32 overflow-hidden"
    >

      {/* BACKGROUND */}

      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-1/2 left-0 w-72 md:w-96 h-72 md:h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-60 md:w-80 h-60 md:h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">

        {/* HEADER */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >

          <span className="inline-flex items-center gap-2 px-4 py-2 mb-4 glass-card rounded-full text-xs md:text-sm font-mono text-primary">

            <Code2 className="w-4 h-4" />
            ABOUT ME

          </span>

          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4">

            <span className="text-foreground">About {profileName} </span>
            <span className="text-primary text-glow-cyan">Full Stack Developer</span>

          </h2>

          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">

            Passionate about creating innovative solutions that make a difference

          </p>

        </motion.div>


        {/* MAIN GRID */}

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">

          {/* PROFILE CARD */}

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative rounded-2xl overflow-hidden backdrop-blur-2xl border border-white/10">

              {/* 🔹 Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: `url('${avatarUrl}')` }}
              />

              {/* 🔹 Dark Overlay */}
              <div className="absolute inset-0 bg-black/60" />

              {/* 🔹 Glow Gradient */}
              <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10" />

              {/* 🔹 Border Top Glow */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary via-accent to-primary" />

              {/* 🔹 CONTENT */}
              <div className="relative z-10 p-5 md:p-8">

                {/* ===== HEADER ===== */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6">

                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <Image
                        alt="Profile avatar"
                        src={avatarUrl}
                        width={100}
                        height={100}
                      />
                    </div>

                    {/* Online Indicator */}
                    <div className="absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-green-500 border-4 border-black" />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="text-lg md:text-2xl font-bold text-white mb-1">
                      {profileName}
                    </h3>

                    <p className="text-primary font-mono text-xs md:text-sm mb-3">
                      {profile?.settings.siteTagline || 'Public profile summary'}
                    </p>

                    <div className="flex flex-wrap gap-3 text-xs md:text-sm text-gray-400">

                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {location}
                      </span>

                      <span className="flex items-center gap-1 break-all">
                        <Mail className="w-4 h-4" />
                        {email}
                      </span>

                    </div>
                  </div>
                </div>

                {/* ===== BIO ===== */}
                <p className="text-gray-400 leading-relaxed text-sm md:text-base mb-6">
                  {bio}
                </p>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-primary mb-3">Explore</p>
                  <div className="flex flex-wrap gap-3 text-xs md:text-sm text-gray-300">
                    <Link className="hover:text-primary transition-colors" href="/projects">Projects</Link>
                    <Link className="hover:text-primary transition-colors" href="/case-studies">Case Studies</Link>
                    <Link className="hover:text-primary transition-colors" href="/blog">Developer Blog</Link>
                    <Link className="hover:text-primary transition-colors" href="/#skills">Skills</Link>
                    <Link className="hover:text-primary transition-colors" href="/experience">Experience</Link>
                    <Link className="hover:text-primary transition-colors" href="/contact">Contact</Link>
                    <Link className="hover:text-primary transition-colors" href="/assets">Assets</Link>
                    <Link className="hover:text-primary transition-colors" href="/github">GitHub</Link>
                  </div>
                </div>

                {/* ===== STATS ===== */}
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      className="rounded-xl p-3 md:p-4 text-center transition-all duration-300 
                       bg-white/5 border border-white/10
                       hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/10"
                    >
                      <stat.icon className="mx-auto mb-2 h-5 w-5 text-primary group-hover:text-accent md:h-6 md:w-6" />

                      <div className="text-lg md:text-2xl font-bold text-white">
                        {stat.value.toLocaleString()}{stat.suffix}
                      </div>

                      <div className="text-[10px] md:text-xs text-gray-400">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>

              </div>
            </div>
          </motion.div>


          {/* CONTENT CARDS */}

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4 md:space-y-6"
          >

            {/* CARD */}

            <div className="glass-card rounded-xl p-5 md:p-6">

              <h4 className="text-base md:text-lg font-semibold mb-3 flex items-center gap-2">

                <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-primary" />
                </span>

                My Approach

              </h4>

              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">

                I believe in crafting experiences that are not just functional but memorable.
                Every project is an opportunity to push boundaries.

              </p>

            </div>


            <div className="glass-card rounded-xl p-5 md:p-6">

              <h4 className="text-base md:text-lg font-semibold mb-3 flex items-center gap-2">

                <span className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Rocket className="w-4 h-4 text-accent" />
                </span>

                What Drives Me

              </h4>

              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">

                The intersection of technology and creativity fascinates me.
                I thrive on solving complex problems with elegant solutions.

              </p>

            </div>


            <div className="glass-card rounded-xl p-5 md:p-6">

              <h4 className="text-base md:text-lg font-semibold mb-3 flex items-center gap-2">

                <span className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Coffee className="w-4 h-4 text-green-500" />
                </span>

                Beyond Code

              </h4>

              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">

                When I am not coding you will find me exploring new technologies,
                contributing to open-source, or enjoying a cup of coffee.

              </p>

            </div>

          </motion.div>

        </div>

      </div>

    </section>

  )

}
