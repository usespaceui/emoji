import { EmojiSource, EmojiType, getEmojiDefaultType } from '@/types'
import { toUnicode } from '@/core/utils'
import manifestData from './emoji-manifest.json'

interface ManifestStructure {
  generatedAt: string
  counts: Record<string, number>
  providers: Record<string, string[]>
}

const rawManifest = manifestData as ManifestStructure

const providerSets = new Map<string, Set<string>>()
const providerNormSets = new Map<string, Set<string>>()

function normalizeCodepoint(codepoint: string) {
  return toUnicode(codepoint).toLowerCase().replace(/-fe0f/g, '').replace(/--+/g, '-').replace(/^-|-$/g, '')
}

for (const [key, codepoints] of Object.entries(rawManifest.providers)) {
  const set = new Set(codepoints)
  const norm = new Set(codepoints.map(normalizeCodepoint))
  providerSets.set(key, set)
  providerNormSets.set(key, norm)
}

function setHas(key: string, emoji: string) {
  const set = providerSets.get(key)
  const norm = providerNormSets.get(key)
  if (!set || !norm) return false
  const codepoint = toUnicode(emoji).toLowerCase()
  if (set.has(codepoint)) return true
  const stripped = normalizeCodepoint(codepoint)
  return set.has(stripped) || norm.has(stripped)
}

export function isEmojiSupported(
  emoji: string,
  options?: { source?: EmojiSource; type?: EmojiType; format?: string },
): boolean {
  if (!emoji) return false
  const source = options?.source ?? EmojiSource.Fluent
  const type = options?.type ?? getEmojiDefaultType(source)

  if (type === EmojiType.Pure) return true
  if (source === EmojiSource.Noto) return true

  if (options?.format) {
    return setHas(`${source}/${type}/${options.format}`, emoji)
  }
  return setHas(`${source}/${type}`, emoji)
}

export function getAvailableProvidersForEmoji(
  emoji: string,
): Array<{ source: EmojiSource; type: EmojiType }> {
  if (!emoji) return []
  const results: Array<{ source: EmojiSource; type: EmojiType }> = []

  for (const key of providerSets.keys()) {
    const parts = key.split('/')
    if (parts.length !== 2) continue
    if (!setHas(key, emoji)) continue
    results.push({
      source: parts[0] as EmojiSource,
      type: parts[1] as EmojiType,
    })
  }

  return results
}

export function getSmartFallbackForEmoji(
  emoji: string,
  preferredSource: EmojiSource = EmojiSource.Fluent,
  preferredType?: EmojiType,
): { source: EmojiSource; type: EmojiType } | undefined {
  const type = preferredType ?? getEmojiDefaultType(preferredSource)

  if (isEmojiSupported(emoji, { source: preferredSource, type })) {
    return { source: preferredSource, type }
  }

  const candidates: Array<{ source: EmojiSource; type: EmojiType }> = []

  if (type === EmojiType.Anim) {
    candidates.push(
      { source: EmojiSource.Fluent, type: EmojiType.Anim },
      { source: EmojiSource.Fluent, type: EmojiType.ThreeD },
      { source: EmojiSource.Apple, type: EmojiType.Flat },
      { source: EmojiSource.Twemoji, type: EmojiType.Flat },
    )
  } else if (type === EmojiType.ThreeD) {
    candidates.push(
      { source: EmojiSource.Fluent, type: EmojiType.Anim },
      { source: EmojiSource.Apple, type: EmojiType.Flat },
      { source: EmojiSource.Twemoji, type: EmojiType.Flat },
    )
  } else {
    candidates.push(
      { source: EmojiSource.Apple, type: EmojiType.Flat },
      { source: EmojiSource.Twemoji, type: EmojiType.Flat },
      { source: EmojiSource.Fluent, type: EmojiType.Flat },
      { source: EmojiSource.Blobmoji, type: EmojiType.Flat },
    )
  }

  for (const candidate of candidates) {
    if (candidate.source === preferredSource && candidate.type === type) continue
    if (isEmojiSupported(emoji, candidate)) return candidate
  }

  return undefined
}

export function getSupportedEmojiCount(source: EmojiSource, type: EmojiType, format?: string): number {
  const key = format ? `${source}/${type}/${format}` : `${source}/${type}`
  return rawManifest.counts[key] ?? 0
}

export function listSupportedEmojis(source: EmojiSource, type: EmojiType, format?: string): string[] {
  if (type === EmojiType.Pure) return []
  const key = format ? `${source}/${type}/${format}` : `${source}/${type}`
  return rawManifest.providers[key] ?? []
}

export { rawManifest as emojiManifest }
