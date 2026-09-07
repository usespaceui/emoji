/**
 * Test suite for @usespaceui/emoji
 * Thorough validation of runtime URL resolution, type validations,
 * format restrictions, edge cases, and error rejection mechanisms.
 */

import {
  EmojiFormat,
  EmojiSource,
  EmojiType,
  EMOJI_PROVIDERS_META,
  getEmojiDefaultType,
  validEmojiFormats,
  validEmojiTypes,
} from '../src/types/emoji'
import {
  getEmojiPath,
  getEmojiUrls,
  resolveEmojiUrl,
  validateEmojiFormat,
  validateEmojiType,
} from '../src/core/cdn'
import { toUnicode } from '../src/core/utils'
import {
  getAvailableProvidersForEmoji,
  getSmartFallbackForEmoji,
  isEmojiSupported,
} from '../src/data/manifest'


const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bgGreen: '\x1b[42m\x1b[30m',
  bgRed: '\x1b[41m\x1b[37m',
}

let passed = 0
let failed = 0

function assert(condition: boolean, title: string, details?: string) {
  if (condition) {
    console.log(`  ${colors.green}✔ PASS${colors.reset}  ${colors.bold}${title}${colors.reset}`)
    if (details) {
      console.log(`         ${colors.dim}↳ ${details}${colors.reset}`)
    }
    passed++
  } else {
    console.error(`  ${colors.red}✖ FAIL${colors.reset}  ${colors.bold}${title}${colors.reset}`)
    if (details) {
      console.error(`         ${colors.red}↳ ${details}${colors.reset}`)
    }
    failed++
  }
}

function assertThrows(fn: () => void, title: string, expectedErrorSubstr: string) {
  try {
    fn()
    console.error(`  ${colors.red}✖ FAIL${colors.reset}  ${colors.bold}${title}${colors.reset}`)
    console.error(`         ${colors.red}↳ Expected function to throw an error, but it succeeded!${colors.reset}`)
    failed++
  } catch (err: any) {
    const message = err?.message || String(err)
    if (message.includes(expectedErrorSubstr)) {
      console.log(`  ${colors.green}✔ PASS${colors.reset}  ${colors.bold}${title}${colors.reset}`)
      console.log(`         ${colors.dim}↳ Expected rejection: "${message}"${colors.reset}`)
      passed++
    } else {
      console.error(`  ${colors.red}✖ FAIL${colors.reset}  ${colors.bold}${title}${colors.reset}`)
      console.error(
        `         ${colors.red}↳ Threw wrong error: "${message}" (expected substring: "${expectedErrorSubstr}")${colors.reset}`,
      )
      failed++
    }
  }
}

console.log(`\n${colors.bold}${colors.cyan}====================================================${colors.reset}`)
console.log(`${colors.bold}${colors.cyan}   @usespaceui/emoji - Comprehensive Test Suite  ${colors.reset}`)
console.log(`${colors.bold}${colors.cyan}====================================================${colors.reset}\n`)

// ---------------------------------------------------------------------------
// 1. VALID RESOLUTIONS ACROSS ALL PROVIDERS & MEDIA FORMATS
// ---------------------------------------------------------------------------
console.log(`${colors.bold}${colors.yellow}▶ SECTION 1: VALID ASSET RESOLUTIONS${colors.reset}\n`)

// Test 1: Fluent 3D default (WebP)
const fluent3d = resolveEmojiUrl('🔥', { source: EmojiSource.Fluent, type: EmojiType.ThreeD })
assert(
  fluent3d.endsWith('/common/emoji/fluent/3d/1f525.webp'),
  'Fluent 3D resolves to .webp',
  fluent3d,
)

// Test 2: Fluent Animated WebP
const fluentAnimWebp = resolveEmojiUrl('🔥', {
  source: EmojiSource.Fluent,
  type: EmojiType.Anim,
  format: EmojiFormat.Webp,
})
assert(
  fluentAnimWebp.endsWith('/common/emoji/fluent/anim/1f525.webp'),
  'Fluent Anim with format "webp" resolves to .webp',
  fluentAnimWebp,
)

// Test 3: Fluent Animated APNG (Lossless)
const fluentAnimApng = resolveEmojiUrl('🔥', {
  source: EmojiSource.Fluent,
  type: EmojiType.Anim,
  format: EmojiFormat.Png,
})
assert(
  fluentAnimApng.endsWith('/common/emoji/fluent/anim/1f525.png'),
  'Fluent Anim with format "png" resolves to lossless APNG .png',
  fluentAnimApng,
)

// Test 4: Fluent Flat / Modern / Mono Vector SVGs
const fluentFlat = resolveEmojiUrl('🔥', { source: EmojiSource.Fluent, type: EmojiType.Flat })
const fluentModern = resolveEmojiUrl('🔥', { source: EmojiSource.Fluent, type: EmojiType.Modern })
const fluentMono = resolveEmojiUrl('🔥', { source: EmojiSource.Fluent, type: EmojiType.Mono })
assert(
  fluentFlat.endsWith('/common/emoji/fluent/flat/1f525.svg') &&
    fluentModern.endsWith('/common/emoji/fluent/modern/1f525.svg') &&
    fluentMono.endsWith('/common/emoji/fluent/mono/1f525.svg'),
  'Fluent 2D styles (flat, modern, mono) all resolve to vector .svg',
  `Flat: ${fluentFlat.split('/').pop()}, Modern: ${fluentModern.split('/').pop()}, Mono: ${fluentMono.split('/').pop()}`,
)

// Test 5: Apple Flat PNG
const apple = resolveEmojiUrl('🍎', { source: EmojiSource.Apple, type: EmojiType.Flat })
assert(
  apple.endsWith('/common/emoji/apple/flat/1f34e.png'),
  'Apple Flat resolves to official PNG',
  apple,
)

// Test 6: Telegram HD Animated WebP
const telegram = resolveEmojiUrl('🚀', { source: EmojiSource.Telegram, type: EmojiType.Anim })
assert(
  telegram.endsWith('/common/emoji/telegram/anim/1f680.webp'),
  'Telegram Anim resolves to 512x512 .webp',
  telegram,
)

// Test 7: Google Noto live from Google CDN (WebP, GIF, AVIF, Lottie, SVG)
const notoWebp = resolveEmojiUrl('🔥', { source: EmojiSource.Noto, type: EmojiType.Anim, format: EmojiFormat.Webp })
const notoGif = resolveEmojiUrl('🔥', { source: EmojiSource.Noto, type: EmojiType.Anim, format: EmojiFormat.Gif })
const notoAvif = resolveEmojiUrl('🔥', { source: EmojiSource.Noto, type: EmojiType.Anim, format: EmojiFormat.Avif })
const notoLottie = resolveEmojiUrl('🔥', { source: EmojiSource.Noto, type: EmojiType.Anim, format: EmojiFormat.Lottie })
const notoFlatSvg = resolveEmojiUrl('🔥', { source: EmojiSource.Noto, type: EmojiType.Flat, format: EmojiFormat.Svg })
assert(
  notoWebp === 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.webp' &&
    notoGif === 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.gif' &&
    notoAvif === 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.avif' &&
    notoLottie === 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/lottie.json' &&
    notoFlatSvg === 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/emoji.svg',
  'Google Noto resolves live URLs for webp, gif, avif, lottie, and svg from fonts.gstatic.com',
  `Lottie: ${notoLottie}`,
)

// Test 8: Twemoji Vector SVG
const twemoji = resolveEmojiUrl('🎉', { source: EmojiSource.Twemoji, type: EmojiType.Flat })
assert(
  twemoji.endsWith('/common/emoji/twemoji/flat/1f389.svg'),
  'Twemoji resolves to vector .svg',
  twemoji,
)

// Test 9: Blobmoji Retro Google Blob PNG
const blobmoji = resolveEmojiUrl('🫠', { source: EmojiSource.Blobmoji, type: EmojiType.Flat })
assert(
  blobmoji.endsWith('/common/emoji/blobmoji/flat/1fae0.png'),
  'Blobmoji resolves to retro PNG',
  blobmoji,
)

// ---------------------------------------------------------------------------
// 2. EDGE CASES, ENCODINGS, AND URL PASSTHROUGH
// ---------------------------------------------------------------------------
console.log(`\n${colors.bold}${colors.yellow}▶ SECTION 2: EDGE CASES & ENCODINGS${colors.reset}\n`)

// Test 10: Direct HTTP / HTTPS URL passthrough
const directUrl = resolveEmojiUrl('https://example.com/custom-avatar.webp', { source: 'fluent' as any })
assert(
  directUrl === 'https://example.com/custom-avatar.webp',
  'Direct URL string is preserved and returned untouched',
  directUrl,
)

// Test 11: Hex code input (e.g. '1f525' directly without unicode character)
const hexInputUrl = resolveEmojiUrl('1f525', { source: EmojiSource.Fluent, type: EmojiType.ThreeD })
assert(
  hexInputUrl.endsWith('/1f525.webp'),
  'Hexadecimal codepoint input ("1f525") resolves identically to "🔥"',
  hexInputUrl,
)

// Test 12: Composite emoji with skin tone modifier (e.g. 👍🏽)
const thumbsUpMedium = resolveEmojiUrl('👍🏽', { source: EmojiSource.Fluent, type: EmojiType.Flat })
assert(
  thumbsUpMedium.includes('1f44d_1f3fd') || thumbsUpMedium.includes('1f44d-1f3fd'),
  'Composite emoji with skin tone ("👍🏽") correctly parses multiple codepoints',
  thumbsUpMedium,
)

// Test 13: Default fallbacks when options are omitted
const defaultOmittedOptions = resolveEmojiUrl('🔥')
assert(
  defaultOmittedOptions.includes('fluent/3d/1f525.webp'),
  'Omitting options completely defaults to Fluent 3D WebP',
  defaultOmittedOptions,
)

// Test 14: Default style when only source is specified
const appleOmittedType = resolveEmojiUrl('🍎', { source: EmojiSource.Apple } as any)
assert(
  appleOmittedType.includes('apple/flat/1f34e.png'),
  'Specifying only { source: "apple" } automatically defaults type to "flat"',
  appleOmittedType,
)

// Test 15: Mirror URLs are valid, non-empty and well-formed
const mirrors = getEmojiUrls('🔥', { source: EmojiSource.Fluent, type: EmojiType.ThreeD })
const allValidUrls = mirrors.every((u) => {
  try {
    const parsed = new URL(u)
    return parsed.protocol === 'https:' && parsed.pathname.startsWith('/common/emoji/')
  } catch {
    return false
  }
})
assert(
  mirrors.length >= 2 && allValidUrls,
  'All CDN mirror URLs are syntactically valid HTTPS URLs',
  mirrors.join(' | '),
)

// ---------------------------------------------------------------------------
// 3. INVALID TYPE COMBINATIONS (Must throw runtime errors)
// ---------------------------------------------------------------------------
console.log(`\n${colors.bold}${colors.yellow}▶ SECTION 3: INVALID TYPE VALIDATIONS${colors.reset}\n`)

// Test 16: Type 'anim' forbidden on Apple
assertThrows(
  () => resolveEmojiUrl('🍎', { source: EmojiSource.Apple, type: 'anim' as any }),
  'resolveEmojiUrl rejects { source: "apple", type: "anim" }',
  "Type 'anim' invalid for 'apple'",
)

// Test 17: Type '3d' forbidden on Telegram
assertThrows(
  () => resolveEmojiUrl('✈️', { source: EmojiSource.Telegram, type: '3d' as any }),
  'resolveEmojiUrl rejects { source: "telegram", type: "3d" }',
  "Type '3d' invalid for 'telegram'",
)

// Test 18: Type 'mono' forbidden on Twemoji
assertThrows(
  () => resolveEmojiUrl('🐦', { source: EmojiSource.Twemoji, type: 'mono' as any }),
  'resolveEmojiUrl rejects { source: "twemoji", type: "mono" }',
  "Type 'mono' invalid for 'twemoji'",
)

// Test 19: Non-existent visual style 'hologram'
assertThrows(
  () => resolveEmojiUrl('🔥', { source: EmojiSource.Fluent, type: 'hologram' as any }),
  'resolveEmojiUrl rejects imaginary style "hologram"',
  "Type 'hologram' invalid for 'fluent'",
)

// Test 20: Deprecated alias 'blob' rejected
assertThrows(
  () => resolveEmojiUrl('🫠', { source: 'blob' as any, type: 'flat' as any }),
  'resolveEmojiUrl rejects legacy alias "blob" (only official "blobmoji" is valid)',
  "invalid for 'blob'",
)

// ---------------------------------------------------------------------------
// 4. INVALID FORMAT COMBINATIONS (Must throw runtime errors)
// ---------------------------------------------------------------------------
console.log(`\n${colors.bold}${colors.yellow}▶ SECTION 4: INVALID FORMAT COMBINATIONS (REAL BUG CHECKS)${colors.reset}\n`)

// Test 21: Format 'svg' forbidden on Fluent when type is 'anim' (Fluent animations only exist as WebP or APNG)
assertThrows(
  () =>
    resolveEmojiUrl('🔥', {
      source: EmojiSource.Fluent,
      type: EmojiType.Anim,
      format: 'svg' as any,
    }),
  'Fluent Anim rejects format "svg" (animations only exist as WebP/APNG)',
  "Format 'svg' invalid for 'fluent' with type 'anim'",
)

// Test 22: Format 'png' forbidden on Fluent when type is '3d' (Fluent 3D only exists as WebP)
assertThrows(
  () =>
    resolveEmojiUrl('🔥', {
      source: EmojiSource.Fluent,
      type: EmojiType.ThreeD,
      format: 'png' as any,
    }),
  'Fluent 3D rejects format "png" (3D only exists as WebP)',
  "Format 'png' invalid for 'fluent' with type '3d'",
)

// Test 23: Format 'webp' forbidden on Google Noto when type is 'flat' (Noto flat vector is SVG only)
assertThrows(
  () =>
    resolveEmojiUrl('🔥', {
      source: EmojiSource.Noto,
      type: EmojiType.Flat,
      format: 'webp' as any,
    }),
  'Google Noto Flat rejects format "webp" (vector is SVG only)',
  "Format 'webp' invalid for 'noto' with type 'flat'",
)

// Test 24: Format 'gif' forbidden on Google Noto when type is 'flat'
assertThrows(
  () =>
    resolveEmojiUrl('🔥', {
      source: EmojiSource.Noto,
      type: EmojiType.Flat,
      format: 'gif' as any,
    }),
  'Google Noto Flat rejects format "gif"',
  "Format 'gif' invalid for 'noto' with type 'flat'",
)

// Test 25: Format 'svg' forbidden on Apple Flat (Apple standard emojis are PNG only)
assertThrows(
  () =>
    resolveEmojiUrl('🍎', {
      source: EmojiSource.Apple,
      type: EmojiType.Flat,
      format: 'svg' as any,
    }),
  'Apple Flat rejects format "svg" (Apple emojis are PNG only)',
  "Format 'svg' invalid for 'apple' with type 'flat'",
)

// Test 26: Format 'png' forbidden on Telegram Anim (Telegram animated emojis are WebP only)
assertThrows(
  () =>
    resolveEmojiUrl('🚀', {
      source: EmojiSource.Telegram,
      type: EmojiType.Anim,
      format: 'png' as any,
    }),
  'Telegram Anim rejects format "png" (Telegram animations are WebP only)',
  "Format 'png' invalid for 'telegram' with type 'anim'",
)

// ---------------------------------------------------------------------------
// 5. MANIFEST & SMART FALLBACK ENGINE
// ---------------------------------------------------------------------------
console.log(`\n${colors.bold}${colors.yellow}▶ SECTION 5: MANIFEST & SMART FALLBACK ENGINE${colors.reset}\n`)

// Test 27: isEmojiSupported identifies existing Telegram animation
const fireTelegramSupported = isEmojiSupported('🔥', { source: EmojiSource.Telegram, type: EmojiType.Anim })
assert(
  fireTelegramSupported === true,
  'isEmojiSupported correctly identifies "🔥" in Telegram Anim (631 pack)',
  String(fireTelegramSupported),
)

// Test 28: isEmojiSupported flags missing emoji in Telegram animation
const rockTelegramSupported = isEmojiSupported('🪨', { source: EmojiSource.Telegram, type: EmojiType.Anim })
assert(
  rockTelegramSupported === false,
  'isEmojiSupported correctly flags "🪨" as missing in Telegram Anim',
  String(rockTelegramSupported),
)

// Test 29: isEmojiSupported confirms "🪨" is supported in Apple Flat
const rockAppleSupported = isEmojiSupported('🪨', { source: EmojiSource.Apple, type: EmojiType.Flat })
assert(
  rockAppleSupported === true,
  'isEmojiSupported confirms "🪨" is available in Apple Flat (4248 pack)',
  String(rockAppleSupported),
)

// Test 30: getAvailableProvidersForEmoji returns exact providers supporting "🪨"
const rockProviders = getAvailableProvidersForEmoji('🪨')
const hasApple = rockProviders.some((p) => p.source === EmojiSource.Apple)
const hasTelegram = rockProviders.some((p) => p.source === EmojiSource.Telegram)
assert(
  hasApple && !hasTelegram,
  'getAvailableProvidersForEmoji("🪨") contains Apple and Fluent, but excludes Telegram',
  `Found: ${rockProviders.map((p) => `${p.source}/${p.type}`).join(', ')}`,
)

// Test 31: Smart Fallback automatically redirects missing Telegram emoji to Fluent Anim
const rockSmartFallbackUrl = resolveEmojiUrl('🪨', {
  source: EmojiSource.Telegram,
  type: EmojiType.Anim,
  fallback: true,
})
assert(
  rockSmartFallbackUrl.endsWith('/common/emoji/fluent/anim/1faa8.webp'),
  'Smart fallback redirects unsupported Telegram Anim "🪨" to Fluent Anim without 404',
  rockSmartFallbackUrl,
)

// Test 32: Smart Fallback with custom target provider
const rockCustomFallbackUrl = resolveEmojiUrl('🪨', {
  source: EmojiSource.Telegram,
  type: EmojiType.Anim,
  fallback: EmojiSource.Apple,
})
assert(
  rockCustomFallbackUrl.endsWith('/common/emoji/apple/flat/1faa8.png'),
  'Custom fallback redirects unsupported Telegram emoji to Apple Flat',
  rockCustomFallbackUrl,
)

// ---------------------------------------------------------------------------
// SUMMARY
// ---------------------------------------------------------------------------
console.log(`\n${colors.bold}${colors.cyan}----------------------------------------------------${colors.reset}`)
if (failed === 0) {
  console.log(`${colors.bgGreen}${colors.bold}  TOTAL SUCCESS: All ${passed}/${passed} tests passed successfully!  ${colors.reset}\n`)
} else {
  console.log(`${colors.bgRed}${colors.bold}  FAILURE: ${failed} test(s) failed out of ${passed + failed}!  ${colors.reset}\n`)
  process.exit(1)
}

