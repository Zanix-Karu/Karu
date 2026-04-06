'use client'

import { useEffect, useRef, useState } from 'react'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Disable on touch devices or reduced-motion
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isTouch || prefersReduced) return

    document.body.classList.add('custom-cursor-active')
    setVisible(true)

    let mouseX = 0, mouseY = 0
    let circleX = 0, circleY = 0
    let rafId: number

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      if (dotRef.current) {
        dotRef.current.style.left = `${mouseX}px`
        dotRef.current.style.top = `${mouseY}px`
      }
    }

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t
    }

    function animate() {
      circleX = lerp(circleX, mouseX, 0.14)
      circleY = lerp(circleY, mouseY, 0.14)

      if (circleRef.current) {
        circleRef.current.style.left = `${circleX}px`
        circleRef.current.style.top = `${circleY}px`
      }

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)

    // Expand circle on interactive elements
    const onEnter = () => document.body.classList.add('cursor-hovering')
    const onLeave = () => document.body.classList.remove('cursor-hovering')

    const interactives = document.querySelectorAll('a, button, [role="button"], input, select, textarea, label')
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    window.addEventListener('mousemove', onMouseMove)

    return () => {
      document.body.classList.remove('custom-cursor-active', 'cursor-hovering')
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafId)
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])

  if (!visible) return null

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot"
        aria-hidden="true"
      />
      <div
        ref={circleRef}
        className="cursor-circle [body.cursor-hovering_&]:w-16 [body.cursor-hovering_&]:h-16"
        aria-hidden="true"
      />
    </>
  )
}
