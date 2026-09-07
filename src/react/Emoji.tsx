'use client'

import { type ElementType, createElement, forwardRef, useEffect, useMemo, useState } from 'react'
import { EmojiFormat, EmojiSource, EmojiType, type EmojiComponent } from '@/types'
import { getGoogleNotoUrl, resolveEmojiUrl } from '@/core/cdn'
import { cn } from 'cn'
import { LottieEmoji } from './LottieEmoji'

const createContainer = (as: ElementType) => forwardRef((props: any, ref) => createElement(as, { ...props, ref }))

export const Emoji: EmojiComponent = forwardRef<any, any>(
  (
    {
      emoji,
      className,
      style,
      source = EmojiSource.Fluent,
      type,
      format,
      fallback,
      size = 40,
      unoptimized,
      as = 'img',
      onError,
      ...restProps
    },
    ref,
  ) => {
    const [failed, setFailed] = useState(false)
    const [lottieFailed, setLottieFailed] = useState(false)

    const ImgContainer = useMemo(() => createContainer(as), [as])

    const emojiUrl = useMemo(() => {
      if (type === EmojiType.Pure || !emoji) return undefined
      try {
        return resolveEmojiUrl(emoji, {
          source,
          type,
          format,
          fallback,
        } as any)
      } catch {
        return undefined
      }
    }, [emoji, source, type, format, fallback])

    useEffect(() => {
      setFailed(false)
      setLottieFailed(false)
    }, [emojiUrl])

    const useNative = type === EmojiType.Pure || (Boolean(fallback) && (!emojiUrl || failed))

    if (useNative) {
      return (
        <span
          className={cn(
            'inline-flex items-center justify-center relative text-center leading-none select-none',
            className,
          )}
          ref={ref}
          role="img"
          aria-label={emoji}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: size,
            height: size,
            flex: 'none',
            fontSize: size * 0.9,
            ...style,
          }}
          {...restProps}
        >
          {emoji}
        </span>
      )
    }

    if (!emojiUrl || failed) return null

    const isLottie = !lottieFailed && (format === EmojiFormat.Lottie || emojiUrl.includes('lottie.json'))
    const rasterUrl =
      lottieFailed && source === EmojiSource.Noto ? getGoogleNotoUrl(emoji, EmojiFormat.Webp) : emojiUrl

    if (isLottie) {
      return (
        <LottieEmoji
          ref={ref}
          src={emojiUrl}
          size={size}
          className={className}
          style={style}
          alt={emoji}
          onError={(event) => {
            setLottieFailed(true)
            onError?.(event)
          }}
        />
      )
    }

    return (
      <ImgContainer
        alt={emoji}
        className={className}
        height={size}
        loading="lazy"
        onError={(e: any) => {
          setFailed(true)
          onError?.(e)
        }}
        ref={ref}
        src={rasterUrl}
        style={{ flex: 'none', ...style }}
        unoptimized={unoptimized}
        width={size}
        {...restProps}
      />
    )
  },
) as EmojiComponent

Emoji.displayName = 'Emoji'

export default Emoji
