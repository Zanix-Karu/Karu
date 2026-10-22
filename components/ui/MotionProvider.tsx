'use client'

import { MotionConfig } from 'framer-motion'

// Like the app's motion.css: anyone whose device asks for reduced motion
// gets content without movement. The CSS block in globals.css covers CSS
// animations; this covers framer-motion's hovers and entrances.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
