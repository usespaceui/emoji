<p align="center">
  <a href="https://www.spaceui.one/tools/emoji" target="_blank">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://www.spaceui.one/logo.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://www.spaceui.one/logo.svg">
      <img alt="Space UI logo" src="https://www.spaceui.one/logo.svg" width="100" />
    </picture>
  </a>
</p>

<h1 align="center">
  @usespaceui/emoji
</h1>

<p align="center">
  A modern, unified emoji library for React featuring Apple, Microsoft Fluent, Telegram, Google Noto, Twemoji, and Blobmoji emojis.
</p>

<p align="center">
  <a href="https://www.spaceui.one/tools/emoji">Preview</a> • 
  <a href="https://github.com/usespaceui/emoji">Source Code</a> • 
  <a href="https://www.spaceui.one">SpaceUI.one</a>
</p>

<p align="center">
  <a href="https://twitter.com/intent/follow?screen_name=usespaceui">
    <img src="https://img.shields.io/twitter/follow/usespaceui.svg?label=Follow%20@usespaceui" alt="Follow @usespaceui" />
  </a>
</p>

<div align="center">
  <a href="https://www.npmjs.com/package/@usespaceui/emoji">
    <img src="https://img.shields.io/npm/v/@usespaceui/emoji?color=%23fa6400&label=version" />
  </a>
  <a href="https://www.npmjs.com/package/@usespaceui/emoji">
    <img src="https://img.shields.io/npm/unpacked-size/%40usespaceui%2Femoji?label=install%20size">
  </a>
  <a href="https://www.npmjs.com/package/@usespaceui/emoji">
    <img src="https://img.shields.io/bundlejs/size/%40usespaceui%2Femoji?format=min">
  </a>
  <a href="https://www.npmjs.com/package/@usespaceui/emoji">
    <img src="https://img.shields.io/bundlejs/size/%40usespaceui%2Femoji">
  </a>
  <a href="https://github.com/usespaceui/emoji">
    <img src="https://img.shields.io/github/repo-size/usespaceui/emoji">
  </a>
  <a href="https://www.npmjs.com/package/@usespaceui/emoji">
    <img src="https://img.shields.io/npm/dm/@usespaceui/emoji" />
  </a>
  <a href="https://github.com/usespaceui/emoji/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@usespaceui/emoji" />
  </a>
  <br><br>
</div>

---

## ✨ Overview

`@usespaceui/emoji` is a unified, accessible, and lightweight emoji library for React and headless JavaScript/TypeScript runtimes. Render high-resolution 3D, animated, vector, or retro emojis across top design ecosystems with zero configuration.

- **6 Design Providers:** Microsoft Fluent, Apple, Telegram, Google Noto, Twemoji (Twitter/X), and Google Blobmoji.
- **Multiple Visual Styles:** 3D, Animated, Flat (Vector), Modern, Mono, and Native Pure OS text.
- **Direct Multi-Format Media:** WebP (Fluent/Telegram anim), PNG (still), SVG, GIF, AVIF, and Lottie JSON (Noto).
- **Opt-in fallback:** `fallback` is off by default. Missing assets render nothing. Pass `fallback` to cascade to another pack or native text.
- **Typed catalogs:** generated `EmojiCatalog` types per provider/style from CDN filenames.
- **Headless & SSR Compatible:** Core resolvers have zero React dependencies and run anywhere (Node.js, Next.js Edge, Bun, Cloudflare Workers).

---

## 🎨 Provider Matrix

| Provider                    | Key          | Supported Styles (`type`)                                  | Media Formats (`format`)                                    | Asset Source                           |
| :-------------------------- | :----------- | :--------------------------------------------------------- | :---------------------------------------------------------- | :------------------------------------- |
| **Microsoft Fluent**        | `"fluent"`   | `3d` _(default)_, `anim`, `flat`, `modern`, `mono`, `pure` | WebP (3D & Anim), PNG (anim stills), SVG (Flat/Modern/Mono) | SpaceUI Multi-CDN                      |
| **Apple**                   | `"apple"`    | `flat` _(default)_, `pure`                                 | PNG (160×160)                                               | SpaceUI Multi-CDN                      |
| **Telegram**                | `"telegram"` | `anim` _(default)_, `pure`                                 | WebP (512×512 HD animations)                                | SpaceUI Multi-CDN                      |
| **Google Noto**             | `"noto"`     | `anim` _(default)_, `flat`, `pure`                         | WebP, GIF, AVIF, **Lottie JSON**, SVG                       | Google Fonts CDN (`fonts.gstatic.com`) |
| **Twemoji (Twitter / X)**   | `"twemoji"`  | `flat` _(default)_, `pure`                                 | SVG (infinite vector scalability)                           | SpaceUI Multi-CDN                      |
| **Blobmoji (Retro Google)** | `"blobmoji"` | `flat` _(default)_, `pure`                                 | PNG (128×128 classic blobs)                                 | SpaceUI Multi-CDN                      |

---

## 📦 Installation

```bash
pnpm add @usespaceui/emoji
# or
npm install @usespaceui/emoji
# or
yarn add @usespaceui/emoji
```

---

## 🚀 Usage

### 1. React Component (`@usespaceui/emoji/react`)

```tsx
import { Emoji } from '@usespaceui/emoji/react'

export default function App() {
  return (
    <div className="flex items-center gap-4">
      {/* Microsoft Fluent 3D (default) */}
      <Emoji emoji="🔥" type="3d" size={48} />

      {/* Microsoft Fluent animation (WebP). PNG in anim/ is a still, not APNG. */}
      <Emoji emoji="🚀" source="fluent" type="anim" format="webp" size={48} />

      {/* Apple Standard (iOS / macOS PNG) */}
      <Emoji emoji="🍎" source="apple" size={48} />

      {/* Telegram HD Animated WebP (512x512) */}
      <Emoji emoji="🎉" source="telegram" type="anim" size={48} />

      {/* Google Noto Live from Google Fonts (WebP, GIF, Lottie, SVG) */}
      <Emoji emoji="🤖" source="noto" type="anim" format="gif" size={48} />

      {/* Twemoji Scalable Vector (SVG) */}
      <Emoji emoji="✨" source="twemoji" size={48} />

      {/* Classic Google Blobs (Blobmoji) */}
      <Emoji emoji="🫠" source="blobmoji" size={48} />

      {/* Pure Native Text Rendering (OS System Font) */}
      <Emoji emoji="💎" type="pure" size={40} />
    </div>
  )
}
```

---

### 2. Smart Fallback Cascade

`fallback` defaults to `false`: missing assets render `null` (no native glyph, no hex). Opt in to cascade:

```tsx
// 🪨 (Rock) does not exist in Telegram Anim:
// With fallback enabled, it automatically falls back to Fluent Anim WebP!
<Emoji
  emoji="🪨"
  source="telegram"
  type="anim"
  fallback
  size={48}
/>

// Or specify an explicit fallback provider target:
<Emoji
  emoji="🪨"
  source="telegram"
  fallback="apple"
  size={48}
/>
```

---

### 3. React Hook (`useEmoji`)

```tsx
import { useEmoji } from '@usespaceui/emoji/react'

function EmojiAvatar({ emoji }: { emoji: string }) {
  const { url, isNative } = useEmoji(emoji, {
    source: 'fluent',
    type: '3d',
  })

  if (isNative) {
    return <span>{emoji}</span>
  }

  return <img src={url} alt={emoji} className="w-10 h-10" />
}
```

---

## 🧠 Headless Core API (`@usespaceui/emoji`)

The root entry point is **100% headless** with zero React dependencies, suitable for Node.js, Next.js Server Components, API routes, or any backend:

```ts
import {
  resolveEmojiUrl,
  getEmojiUrls,
  getGoogleNotoUrl,
  isEmojiSupported,
  getSmartFallbackForEmoji,
  getAvailableProvidersForEmoji,
  extractEmoji,
  getEmojiName,
  getEmoji,
  toUnicode,
  fromUnicode,
  listSupportedEmojis,
} from '@usespaceui/emoji'

// 1. Resolve Primary CDN Asset URL
const url = resolveEmojiUrl('🔥', { source: 'fluent', type: '3d' })
// -> "https://cdn.spaceui.one/common/emoji/fluent/3d/1f525.webp"

// 2. Resolve Multi-CDN Redundancy Mirrors
const mirrors = getEmojiUrls('🔥', { source: 'fluent', type: '3d' })
// -> ["https://cdn.spaceui.one/...", "https://cdn.aurthle.com/..."]

// 3. Resolve Direct Google Fonts CDN URL for Google Noto
const notoUrl = getGoogleNotoUrl('🤖', 'webp')
// -> "https://fonts.gstatic.com/s/e/notoemoji/latest/1f916/512.webp"

// 4. Inspect Asset Availability in Manifest (pass format to check the real file)
isEmojiSupported('🔥', { source: 'telegram', type: 'anim' }) // true
isEmojiSupported('1f170', { source: 'fluent', type: 'anim', format: 'webp' }) // false (png only)
isEmojiSupported('🪨', { source: 'telegram', type: 'anim' }) // false

// 5. Query All Providers Supporting an Emoji
const providers = getAvailableProvidersForEmoji('🪨')
// -> [{ source: "apple", type: "flat" }, { source: "fluent", type: "3d" }, ...]

// 6. List filenames that actually exist for a pack/format
listSupportedEmojis('fluent', 'anim', 'webp') // ["0023-fe0f", "1f600", ...]

// 7. Unicode & Name Utilities
const char = extractEmoji('Rocket 🚀 launch') // "🚀"
const name = getEmojiName('🤯') // "exploding-head"
const glyph = getEmoji('exploding-head') // "🤯"
const hex = toUnicode('😀') // "1f600"
const back = fromUnicode('1f600') // "😀"

const fallbackTarget = getSmartFallbackForEmoji('🪨', 'telegram', 'anim')
// -> { source: "fluent", type: "anim" }
```

---

## ⚙️ Props & Options Reference (`<Emoji />`)

| Prop          | Type                                                                     | Default          | Description                                                                                                         |
| :------------ | :----------------------------------------------------------------------- | :--------------- | :------------------------------------------------------------------------------------------------------------------ |
| `emoji`       | `string`                                                                 | **required**     | The emoji character (e.g. `"🔥"`) or Unicode hex (e.g. `"1f525"`). Strictly typed to available assets per provider. |
| `source`      | `"fluent" \| "apple" \| "telegram" \| "noto" \| "twemoji" \| "blobmoji"` | `"fluent"`       | Visual emoji design provider.                                                                                       |
| `type`        | `"3d" \| "anim" \| "flat" \| "modern" \| "mono" \| "pure"`               | Provider default | Visual style variant allowed for the chosen source.                                                                 |
| `format`      | `"webp" \| "png" \| "svg" \| "gif" \| "avif" \| "lottie"`                | Style default    | Media container format strictly narrowed per provider & style.                                                      |
| `fallback`    | `boolean \| EmojiSource \| { source, type }`                             | `false`          | Off: render nothing if missing. On: cascade to another pack, then native text.                                      |
| `size`        | `number`                                                                 | `40`             | Render dimension in pixels (width and height).                                                                      |
| `as`          | `ElementType`                                                            | `"img"`          | Custom underlying container or component tag (e.g. Next.js `Image`).                                                |
| `unoptimized` | `boolean`                                                                | `false`          | Disables image optimization when passed to custom containers.                                                       |
| `className`   | `string`                                                                 | `undefined`      | Custom CSS classes applied to element.                                                                              |
| `style`       | `CSSProperties`                                                          | `undefined`      | Inline styles applied to element.                                                                                   |

---

## 🗂 Library Subpaths

| Subpath                   | Description                                                                                      |
| :------------------------ | :----------------------------------------------------------------------------------------------- |
| `@usespaceui/emoji`       | Headless Core: URL resolvers, manifest helpers, Unicode parsers, metadata, and TypeScript types. |
| `@usespaceui/emoji/react` | React Components: `<Emoji />` component, `useEmoji` hook, and React prop types.                  |
| `@usespaceui/emoji/data`  | Raw Datasets: `emoji-manifest.json` and `emojiLib` Unicode dictionary lookup tables.             |

---

## 📦 Related Packages

| Package                                                              | Description                                                   |
| :------------------------------------------------------------------- | :------------------------------------------------------------ |
| [`@usespaceui/avatars`](https://github.com/usespaceui/avatars)       | Classic generative SVG avatar engine with multiple families   |
| [`@usespaceui/squishmoji`](https://github.com/usespaceui/squishmoji) | Interactive, procedural squishy SVG avatars & animated emojis |
| [`@usespaceui/gradients`](https://github.com/usespaceui/gradients)   | Procedural CSS & SVG gradient generator                       |
| [`@usespaceui/sounds`](https://github.com/usespaceui/sounds)         | UI sound effects and audio interactions                       |
| [`@usespaceui/squircle`](https://github.com/usespaceui/squircle)     | iOS & Figma style continuous curvature squircles              |

---

## 🪪 License

MIT — Free for personal and commercial projects.

---

## 📚 Resources

- 🔍 [Interactive Studio](https://www.spaceui.one/tools/emoji)
- 📖 [Space UI Ecosystem](https://www.spaceui.one)
- 🌍 [Space UI GitHub Community](https://github.com/usespaceui)

---

## 🛠 Maintenance

If you discover a bug or have a feature request, please open an [issue on GitHub](https://github.com/usespaceui/emoji/issues).

---

<p align="center">
  <a href="https://www.spaceui.one" target="_blank">
    <img src="https://www.spaceui.one/favicon.ico" width="60" style="border-radius: 50%" alt="Space UI Logo" />
  </a>
  <br />
  <b>Maintained by the Space UI Team</b>
</p>
