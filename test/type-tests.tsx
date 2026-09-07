/**
 * Type-level tests for @usespaceui/emoji
 * Verifies that TypeScript permits valid props and rejects invalid props at compile time.
 * If any @ts-expect-error does NOT trigger a compilation error, `tsc --noEmit` will fail.
 */

import { Emoji } from '../src/react/Emoji'
import { EmojiFormat, EmojiSource, EmojiType } from '../src/types/emoji'

export function TypeCheckDemo() {
  return (
    <>
      {/* ======================================================== */}
      {/* 1. VALID CASES (TypeScript must accept without error)   */}
      {/* ======================================================== */}

      {/* Fluent with official visual styles and formats */}
      <Emoji emoji="🔥" source="fluent" type="3d" />
      <Emoji emoji="🔥" source={EmojiSource.Fluent} type={EmojiType.ThreeD} />
      <Emoji emoji="🔥" source="fluent" type="anim" format="webp" />
      <Emoji emoji="🔥" source="fluent" type="anim" format="png" />
      <Emoji emoji="🔥" source="fluent" type="modern" format="svg" />
      <Emoji emoji="🔥" source="fluent" type="mono" />

      {/* Apple: flat only */}
      <Emoji emoji="🍎" source="apple" type="flat" format="png" />
      <Emoji emoji="🍎" source={EmojiSource.Apple} type={EmojiType.Flat} />

      {/* Telegram: animated WebP only */}
      <Emoji emoji="✈️" source="telegram" type="anim" format="webp" />

      {/* Google Noto: animated or flat with supported formats */}
      <Emoji emoji="🤖" source="noto" type="anim" format="webp" />
      <Emoji emoji="🤖" source="noto" type="anim" format="gif" />
      <Emoji emoji="🤖" source="noto" type="anim" format="lottie" />
      <Emoji emoji="🤖" source="noto" type="flat" format="svg" />

      {/* Twemoji: flat vector SVG only */}
      <Emoji emoji="🐦" source="twemoji" type="flat" format="svg" />

      {/* Blobmoji: flat PNG only */}
      <Emoji emoji="🫠" source="blobmoji" type="flat" format="png" />

      {/* Pure text mode (native OS emoji font rendering) on any provider */}
      <Emoji emoji="💎" source="fluent" type="pure" />
      <Emoji emoji="💎" source="apple" type="pure" />

      {/* ======================================================== */}
      {/* 2. INVALID CASES (TypeScript MUST reject with @ts-expect-error) */}
      {/* ======================================================== */}

      {/* ❌ Format 'lottie' forbidden on Fluent (string or constant) */}
      {/* @ts-expect-error: format 'lottie' is not supported by Fluent */}
      <Emoji emoji="🔥" source="fluent" type="anim" format="lottie" />

      {/* ❌ Format 'svg' forbidden on Fluent (string or constant) */}
      {/* @ts-expect-error: format 'svg' is not supported by Fluent when 'anim' type */}
      <Emoji emoji="🔥" source="fluent" type="anim" format="svg" />

      {/* ❌ Format 'png' forbidden on Google Noto (Noto serves WebP, GIF, AVIF, Lottie, SVG) */}
      {/* @ts-expect-error: format 'png' is not supported by Google Noto */}
      <Emoji emoji="🔥" source="noto" type="anim" format="png" />

      {/* ❌ Type 'anim' forbidden on Apple (Apple emojis are static only) */}
      {/* @ts-expect-error: type 'anim' is not supported by Apple */}
      <Emoji emoji="🍎" source="apple" type="anim" />

      {/* ❌ Type '3d' forbidden on Telegram (Telegram only offers HD 'anim') */}
      {/* @ts-expect-error: type '3d' is not supported by Telegram */}
      <Emoji emoji="✈️" source="telegram" type="3d" />

      {/* ❌ Type 'mono' forbidden on Twemoji */}
      {/* @ts-expect-error: type 'mono' is not supported by Twemoji */}
      <Emoji emoji="🐦" source="twemoji" type="mono" />

      {/* ❌ Non-existent style 'neon' */}
      {/* @ts-expect-error: type 'neon' does not exist on Fluent */}
      <Emoji emoji="🔥" source="fluent" type="neon" />

      {/* ❌ Unknown provider 'android' or deprecated alias 'blob' */}
      {/* @ts-expect-error: source 'blob' is not an authorized provider */}
      <Emoji emoji="🔥" source="blob" type="flat" />

      {/* ❌ Emoji '🪨' is not part of the 631 Telegram animated emojis (strict guard without fallback) */}
      {/* @ts-expect-error: emoji '🪨' is missing in Telegram animated pack */}
      <Emoji emoji="🪨" source="telegram" type="anim" />

      {/* ✔ But WITH fallback, any emoji is accepted because Smart Fallback redirects cleanly */}
      <Emoji emoji="🪨" source="telegram" type="anim" fallback />
    </>
  )
}

