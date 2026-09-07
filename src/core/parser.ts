import emojiRegex from 'emoji-regex'

/**
 * Extracts the first emoji found in a given text string.
 *
 * @param text - The string to extract the emoji from
 * @returns The extracted emoji or undefined
 *
 * @example
 * extractEmoji("Hello 🚀 world!") // returns "🚀"
 */
export const extractEmoji = (text: string): string | undefined => {
  const regex = emojiRegex()
  const match = text.match(regex)
  return match?.[0]
}
