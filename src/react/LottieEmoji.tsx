'use client'

import { forwardRef, useCallback, useEffect, useRef, type CSSProperties } from 'react'
import type { AnimationItem } from 'lottie-web'
import { cn } from 'cn'

type LottieEmojiProps = {
  src: string
  size?: number
  className?: string
  style?: CSSProperties
  alt?: string
  onError?: (event: unknown) => void
}

type LottiePlayer = {
  loadAnimation: (params: Record<string, unknown>) => AnimationItem
}

function resolvePlayer(mod: unknown): LottiePlayer | null {
  let current: any = mod
  for (let index = 0; index < 4; index++) {
    if (current && typeof current.loadAnimation === 'function') return current
    current = current?.default
  }
  return null
}

function fitSvg(node: HTMLElement) {
  const svg = node.querySelector('svg')
  if (!svg) return
  svg.removeAttribute('width')
  svg.removeAttribute('height')
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
  svg.style.width = '100%'
  svg.style.height = '100%'
  svg.style.display = 'block'
}

export const LottieEmoji = forwardRef<HTMLDivElement, LottieEmojiProps>(function LottieEmoji(
  { src, size = 40, className, style, alt, onError },
  ref,
) {
  const nodeRef = useRef<HTMLDivElement | null>(null)
  const onErrorRef = useRef(onError)
  onErrorRef.current = onError

  const setRefs = useCallback(
    (el: HTMLDivElement | null) => {
      nodeRef.current = el
      if (typeof ref === 'function') ref(el)
      else if (ref) ref.current = el
    },
    [ref],
  )

  useEffect(() => {
    const node = nodeRef.current
    if (!node) return

    let cancelled = false
    let anim: AnimationItem | null = null

    const run = async () => {
      try {
        const [mod, response] = await Promise.all([import('lottie-web'), fetch(src)])
        if (cancelled || !nodeRef.current) return
        if (!response.ok) throw new Error(`Lottie ${response.status}`)
        const animationData = await response.json()
        const lottie = resolvePlayer(mod)
        if (!lottie) throw new Error('lottie-web unavailable')

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        anim = lottie.loadAnimation({
          container: nodeRef.current,
          renderer: 'svg',
          loop: !reduced,
          autoplay: !reduced,
          animationData,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid meet',
            viewBoxOnly: true,
          },
        })
        fitSvg(nodeRef.current)
        if (reduced) anim.goToAndStop(0, true)
      } catch (error) {
        if (!cancelled) onErrorRef.current?.(error)
      }
    }

    void run()

    return () => {
      cancelled = true
      anim?.destroy()
      node.replaceChildren()
    }
  }, [src])

  return (
    <div
      ref={setRefs}
      data-emoji-lottie=""
      role="img"
      aria-label={alt}
      className={cn(className)}
      style={{
        display: 'block',
        width: size,
        height: size,
        flex: 'none',
        overflow: 'hidden',
        lineHeight: 0,
        ...style,
      }}
    />
  )
})

LottieEmoji.displayName = 'LottieEmoji'
