'use client'

import { useEffect } from 'react'

export function ScrollRevealInit() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('show')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.reveal, .reveal-l, .reveal-r, .stat-cell').forEach((el) => {
      io.observe(el)
    })

    return () => io.disconnect()
  }, [])

  return null
}
