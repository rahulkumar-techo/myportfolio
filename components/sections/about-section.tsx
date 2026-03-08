'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Mail, Calendar, Code2, Coffee, Rocket } from 'lucide-react'
import { developerProfile } from '@/lib/data'
import Image from 'next/image'

const stats = [
  {
    icon: Calendar,
    value: developerProfile.stats.yearsExperience,
    label: 'Years Experience',
    suffix: '+',
  },
  {
    icon: Rocket,
    value: developerProfile.stats.projectsCompleted,
    label: 'Projects Completed',
    suffix: '+',
  },
  {
    icon: Coffee,
    value: developerProfile.stats.coffeeConsumed,
    label: 'Coffee Consumed',
    suffix: '',
  },
]

export default function AboutSection() {

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

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

            <span className="text-foreground">Crafting </span>
            <span className="text-primary text-glow-cyan">Digital Excellence</span>

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

            <div className="glass-card rounded-2xl p-5 md:p-8 relative overflow-hidden">

              {/* holographic border */}

              <div className="absolute inset-0 rounded-2xl border border-primary/20" />
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-accent to-primary" />

              {/* PROFILE HEADER */}

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 mb-6">

                {/* avatar */}

                <div className="relative flex-shrink-0">

                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">

                    <span className="text-xl md:text-3xl font-bold text-primary">

                      <Image
                        alt={developerProfile.name.split(' ').map(n => n[0]).join('')}
                        src={developerProfile?.avatarUrl}
                        width={100}
                        height={100}
                        className=' rounded-2xl'
                      />

                    </span>

                  </div>

                  <div className="absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-green-500 border-4 border-background" />

                </div>

                {/* info */}

                <div className="flex-1">

                  <h3 className="text-lg md:text-2xl font-bold text-foreground mb-1">
                    {developerProfile.name}
                  </h3>

                  <p className="text-primary font-mono text-xs md:text-sm mb-3">
                    {developerProfile.title}
                  </p>

                  <div className="flex flex-wrap gap-3 text-xs md:text-sm text-muted-foreground">

                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {developerProfile.location}
                    </span>

                    <span className="flex items-center gap-1 break-all">
                      <Mail className="w-4 h-4" />
                      {developerProfile.email}
                    </span>

                  </div>

                </div>

              </div>


              {/* BIO */}

              <p className="text-muted-foreground leading-relaxed text-sm md:text-base mb-6">
                {developerProfile.bio}
              </p>


              {/* STATS */}

              <div className="grid grid-cols-3 gap-3 md:gap-4 ">

                {stats.map((stat, index) => (

                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    className="glass-card rounded-xl border border-transparent p-3 text-center group transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/10 md:p-4"
                  >

                    <stat.icon className="mx-auto mb-2 h-5 w-5 text-primary transition duration-300 group-hover:scale-110 group-hover:text-accent md:h-6 md:w-6" />

                    <div className="text-lg font-bold text-foreground transition-colors duration-300 group-hover:text-primary md:text-2xl">

                      {stat.value.toLocaleString()}{stat.suffix}

                    </div>

                    <div className="text-[10px] text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80 md:text-xs">
                      {stat.label}
                    </div>

                  </motion.div>

                ))}

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
