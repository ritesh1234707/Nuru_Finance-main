"use client"

import { useEffect, useState } from "react"
import { cn } from "../../lib/utils"

interface GlitchTextProps {
  text: string
  className?: string
  glitchOnHover?: boolean
}

export function GlitchText({ text, className, glitchOnHover = false }: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false)
  const [glitchText, setGlitchText] = useState(text)

  const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?"

  const createGlitch = () => {
    let result = ""
    for (let i = 0; i < text.length; i++) {
      if (Math.random() < 0.1) {
        result += glitchChars[Math.floor(Math.random() * glitchChars.length)]
      } else {
        result += text[i]
      }
    }
    return result
  }

  useEffect(() => {
    if (!isGlitching) return

    const interval = setInterval(() => {
      setGlitchText(createGlitch())
    }, 50)

    const timeout = setTimeout(() => {
      setIsGlitching(false)
      setGlitchText(text)
    }, 200)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [isGlitching, text])

  const handleMouseEnter = () => {
    if (glitchOnHover) {
      setIsGlitching(true)
    }
  }

  return (
    <span
      className={cn("relative inline-block transition-all duration-200", isGlitching && "animate-pulse", className)}
      onMouseEnter={handleMouseEnter}
      style={{
        textShadow: isGlitching ? "2px 0 #ff0000, -2px 0 #00ff00, 0 2px #0000ff" : "none",
      }}
    >
      {glitchText}
    </span>
  )
}
