'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface AIGuideMessage {
  id: string
  section: string
  message: string
}

const guideMessages: AIGuideMessage[] = [
  { id: 'hero', section: 'hero', message: "Hello! I am your AI guide. Let me show you this developer's incredible work." },
  { id: 'about', section: 'about', message: "Here's where you'll learn about the developer's journey and expertise." },
  { id: 'skills', section: 'skills', message: "These are the technologies mastered over years of experience." },
  { id: 'projects', section: 'projects', message: "Explore the showcase of projects that push boundaries." },
  { id: 'experience', section: 'experience', message: "A timeline of professional growth and achievements." },
  { id: 'testimonials', section: 'testimonials', message: "Hear what colleagues and clients have to say." },
  { id: 'contact', section: 'contact', message: "Ready to connect? Let's build something amazing together." },
]

interface AIGuideProps {
  currentSection: string
}

export default function AIGuide({ currentSection }: AIGuideProps) {

  const [isVisible, setIsVisible] = useState(false)
  const [currentMessage, setCurrentMessage] = useState<AIGuideMessage | null>(null)
  const [hasShownMessage, setHasShownMessage] = useState<Set<string>>(new Set())

  useEffect(() => {

    const message = guideMessages.find(m => m.section === currentSection)

    if (message && !hasShownMessage.has(message.id)) {

      setCurrentMessage(message)
      setIsVisible(true)
      setHasShownMessage(prev => new Set([...prev, message.id]))

      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 5000)

      return () => clearTimeout(timer)
    }

  }, [currentSection, hasShownMessage])

  return (

    <div className="
    fixed
    bottom-4 right-4
    md:bottom-8 md:right-8
    z-50
    flex items-end gap-3
    ">

      <AnimatePresence>

        {isVisible && currentMessage && (

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="flex items-end gap-3"
          >

            {/* MESSAGE BUBBLE */}

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="
              relative
              glass-card
              rounded-2xl
              rounded-br-sm
              p-3 md:p-4
              max-w-[200px] md:max-w-xs
              text-xs md:text-sm
              "
            >

              {/* Close button */}

              <button
                onClick={() => setIsVisible(false)}
                className="absolute top-1 right-1 p-1 opacity-60 hover:opacity-100"
              >
                <X size={14}/>
              </button>

              <p className="text-foreground/90 leading-relaxed pr-4">
                {currentMessage.message}
              </p>

              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/30">

                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"/>

                <span className="text-[10px] md:text-xs text-muted-foreground font-mono">
                  AI GUIDE
                </span>

              </div>

            </motion.div>


            {/* AI ORB */}

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="relative"
            >

              {/* glow */}

              <div className="
              absolute
              inset-0
              w-12 h-12
              md:w-16 md:h-16
              rounded-full
              bg-primary/20
              blur-xl
              animate-pulse
              "/>

              {/* main orb */}

              <div className="
              relative
              w-12 h-12
              md:w-16 md:h-16
              rounded-full
              glass-card
              flex items-center justify-center
              overflow-hidden
              ">

                {/* core */}

                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="
                  w-5 h-5
                  md:w-8 md:h-8
                  rounded-full
                  bg-gradient-to-br
                  from-primary
                  to-accent
                  "
                />

                {/* rotating ring */}

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="
                  absolute
                  inset-1 md:inset-2
                  rounded-full
                  border-2
                  border-primary/50
                  border-t-transparent
                  "
                />

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>

  )

}
