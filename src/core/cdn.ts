import urlJoin from 'url-join'
import {
  EmojiFormat,
  EmojiSource,
  EmojiType,
  getEmojiDefaultType,
  validEmojiFormats,
  validEmojiTypes,
  type EmojiTypeMap,
  type ResolveEmojiOptionsUnion,
} from '@/types'
import {
  getAppleEmojiName,
  getBlobmojiEmojiName,
  getFluentEmojiName,
  getGoogleNotoUrl,
  getNotoEmojiName,
  getTelegramEmojiName,
  getTwemojiEmojiName,
} from '@/core/providers'
import { getSmartFallbackForEmoji, isEmojiSupported } from '@/data/manifest'

export { getGoogleNotoUrl }

const DOMAINS = ['https://cdn.spaceui.one', 'https://cdn.aurthle.one', 'https://cdn.aurthle.com']

export const validateEmojiType = (source: EmojiSource, type: string): boolean => {
  if (!validEmojiTypes[source]?.includes(type)) {
    throw new Error(
      `❌ Type '${type}' invalid for '${source}'. Authorized types: ${validEmojiTypes[source]?.join(', ')}`,
    )
  }
  return true
}

export const validateEmojiFormat = (source: EmojiSource, type: string, format?: string): boolean => {
  if (!format) return true
  const allowed = validEmojiFormats[source]?.[type]
  if (allowed && !allowed.includes(format as EmojiFormat)) {
    throw new Error(
      `❌ Format '${format}' invalid for '${source}' with type '${type}'. Authorized formats: ${allowed.join(', ')}`,
    )
  }
  return true
}

export const getEmojiPath = (
  source: EmojiSource,
  name: string,
  type: EmojiTypeMap[EmojiSource],
  format?: EmojiFormat,
): string => {
  let emoji: string
  switch (source) {
    case EmojiSource.Apple:
      emoji = getAppleEmojiName(name)
      break
    case EmojiSource.Fluent:
      emoji = getFluentEmojiName(name, type, format)
      break
    case EmojiSource.Telegram:
      emoji = getTelegramEmojiName(name)
      break
    case EmojiSource.Twemoji:
      emoji = getTwemojiEmojiName(name)
      break
    case EmojiSource.Blobmoji:
      emoji = getBlobmojiEmojiName(name)
      break
    case EmojiSource.Noto:
      emoji = getNotoEmojiName(name, type, format)
      break
  }

  return emoji
}

/**
 * Returns all CDN mirror URLs for a given emoji.
 */
export const getEmojiUrls = (name: string, options?: ResolveEmojiOptionsUnion): string[] => {
  if (name.startsWith('http://') || name.startsWith('https://')) {
    return [name]
  }

  let source = (options?.source ?? EmojiSource.Fluent) as EmojiSource
  let emojiType = (options?.type ?? getEmojiDefaultType(source)) as EmojiTypeMap[EmojiSource]
  let format = options?.format

  // Smart fallback resolution if asset is missing and fallback is enabled
  if (options?.fallback && !isEmojiSupported(name, { source, type: emojiType })) {
    if (typeof options.fallback === 'object' && 'source' in options.fallback) {
      source = options.fallback.source
      emojiType = (options.fallback.type ?? getEmojiDefaultType(source)) as EmojiTypeMap[EmojiSource]
      format = undefined
    } else if (typeof options.fallback === 'string' && Object.values(EmojiSource).includes(options.fallback as any)) {
      source = options.fallback as EmojiSource
      emojiType = getEmojiDefaultType(source) as EmojiTypeMap[EmojiSource]
      format = undefined
    } else {
      const smart = getSmartFallbackForEmoji(name, source, emojiType)
      if (smart) {
        source = smart.source
        emojiType = smart.type as EmojiTypeMap[EmojiSource]
        format = undefined
      }
    }
  }

  validateEmojiType(source, emojiType)
  validateEmojiFormat(source, emojiType, (options as any)?.format)

  // For Noto, serve directly from Google's global CDN
  if (source === EmojiSource.Noto) {
    const googleFormat =
      emojiType === EmojiType.Flat
        ? EmojiFormat.Svg
        : format === EmojiFormat.Gif
          ? EmojiFormat.Gif
          : format === EmojiFormat.Avif
            ? EmojiFormat.Avif
            : format === EmojiFormat.Lottie
              ? EmojiFormat.Lottie
              : EmojiFormat.Webp
    return [getGoogleNotoUrl(name, googleFormat)]
  }

  const emoji = getEmojiPath(source, name, emojiType, format)
  return DOMAINS.map((domain) => urlJoin(domain, `/common/emoji/${source}/${emojiType}/${emoji}`))
}

/**
 * Resolves the primary CDN URL for a given emoji.
 */
export const resolveEmojiUrl = (emoji: string, options?: ResolveEmojiOptionsUnion): string => {
  const urls = getEmojiUrls(emoji, options)
  return urls[0]
}
