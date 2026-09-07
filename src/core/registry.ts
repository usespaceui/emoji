import emojiLib from '@/data/emojiLib/index.json'
import { fromUnicode, toUnicode } from '@/core/utils'

export type EmojiLibrary = Record<string, string>
export type EmojiCharacter = string
export type EmojiName = string

let reverseEmojiMap: Record<string, string> | null = null

const getReverseEmojiMap = (): Record<string, string> => {
  if (!reverseEmojiMap) {
    reverseEmojiMap = {}
    for (const [emoji, name] of Object.entries(emojiLib)) {
      reverseEmojiMap[name] = emoji
    }
  }
  return reverseEmojiMap
}

/**
 * Returns the short name of an emoji character (or hex codepoint).
 *
 * @example
 * getEmojiName("🤯") // "exploding-head"
 * getEmojiName("1f92f") // "exploding-head"
 */
export const getEmojiName = (emojiChar: string): string | undefined => {
  const library = emojiLib as EmojiLibrary
  if (library[emojiChar]) return library[emojiChar]
  try {
    const char = fromUnicode(toUnicode(emojiChar))
    return library[char]
  } catch {
    return undefined
  }
}

/**
 * Returns the emoji character for a short name.
 *
 * @example
 * getEmoji("exploding-head") // "🤯"
 */
export const getEmoji = (name: string): string | undefined => {
  return getReverseEmojiMap()[name]
}
