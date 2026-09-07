export * from './emoji-catalog'

/**
 * Provider identifier constant object.

 */
export const EmojiSource = {
  Fluent: 'fluent',
  Apple: 'apple',
  Telegram: 'telegram',
  Twemoji: 'twemoji',
  Blobmoji: 'blobmoji',
  Noto: 'noto',
} as const

/**
 * All supported emoji provider keys.
 */
export type EmojiSource = (typeof EmojiSource)[keyof typeof EmojiSource]

/**
 * Media file format constant object.
 */
export const EmojiFormat = {
  Webp: 'webp',
  Avif: 'avif',
  Png: 'png',
  Gif: 'gif',
  Svg: 'svg',
  Lottie: 'lottie',
} as const

/**
 * Media file format extensions supported across providers.
 */
export type EmojiFormat = (typeof EmojiFormat)[keyof typeof EmojiFormat]

/**
 * Visual style constant object.
 */
export const EmojiType = {
  ThreeD: '3d',
  Anim: 'anim',
  Flat: 'flat',
  Modern: 'modern',
  Mono: 'mono',
  Pure: 'pure',
} as const

/**
 * All emoji visual style representations.
 */
export type EmojiType = (typeof EmojiType)[keyof typeof EmojiType]

export type FluentEmojiType =
  | typeof EmojiType.Anim
  | typeof EmojiType.Flat
  | typeof EmojiType.Modern
  | typeof EmojiType.Mono
  | typeof EmojiType.ThreeD

export type TelegramEmojiType = typeof EmojiType.Anim
export type AppleEmojiType = typeof EmojiType.Flat
export type TwemojiEmojiType = typeof EmojiType.Flat
export type BlobmojiEmojiType = typeof EmojiType.Flat
export type NotoEmojiType = typeof EmojiType.Anim | typeof EmojiType.Flat

export type FluentEmojiFormat =
  | typeof EmojiFormat.Webp
  | typeof EmojiFormat.Png
  | typeof EmojiFormat.Svg

export type AppleEmojiFormat = typeof EmojiFormat.Png
export type TelegramEmojiFormat = typeof EmojiFormat.Webp
export type NotoEmojiFormat =
  | typeof EmojiFormat.Webp
  | typeof EmojiFormat.Avif
  | typeof EmojiFormat.Gif
  | typeof EmojiFormat.Lottie
  | typeof EmojiFormat.Svg
export type TwemojiEmojiFormat = typeof EmojiFormat.Svg
export type BlobmojiEmojiFormat = typeof EmojiFormat.Png

/**
 * Mapping of each provider to its authorized visual styles.
 */
export type EmojiTypeMap = {
  [EmojiSource.Apple]: AppleEmojiType
  [EmojiSource.Fluent]: FluentEmojiType
  [EmojiSource.Telegram]: TelegramEmojiType
  [EmojiSource.Twemoji]: TwemojiEmojiType
  [EmojiSource.Blobmoji]: BlobmojiEmojiType
  [EmojiSource.Noto]: NotoEmojiType
}

/**
 * Default visual style per provider mapping.
 */
export type EmojiDefaultTypeMap = {
  [EmojiSource.Fluent]: typeof EmojiType.ThreeD
  [EmojiSource.Apple]: typeof EmojiType.Flat
  [EmojiSource.Telegram]: typeof EmojiType.Anim
  [EmojiSource.Noto]: typeof EmojiType.Anim
  [EmojiSource.Twemoji]: typeof EmojiType.Flat
  [EmojiSource.Blobmoji]: typeof EmojiType.Flat
}

/**
 * Authorized visual styles allowed per provider at compile-time.
 */
export type AllowedEmojiType<S extends EmojiSource = typeof EmojiSource.Fluent> =
  EmojiTypeMap[S] | typeof EmojiType.Pure

/**
 * Default visual style for a provider at compile-time.
 */
export type EmojiDefaultType<S extends EmojiSource = typeof EmojiSource.Fluent> =
  EmojiDefaultTypeMap[S]

/**
 * Authorized file format extensions allowed per provider and visual style at compile-time.
 */
export type AllowedEmojiFormat<
  S extends EmojiSource = typeof EmojiSource.Fluent,
  T extends EmojiType = EmojiDefaultType<S>,
> =
  T extends typeof EmojiType.Pure
    ? never
    : S extends typeof EmojiSource.Fluent
      ? T extends typeof EmojiType.ThreeD
        ? typeof EmojiFormat.Webp
        : T extends typeof EmojiType.Anim
          ? typeof EmojiFormat.Webp | typeof EmojiFormat.Png
          : typeof EmojiFormat.Svg
      : S extends typeof EmojiSource.Apple
        ? typeof EmojiFormat.Png
        : S extends typeof EmojiSource.Telegram
          ? typeof EmojiFormat.Webp
          : S extends typeof EmojiSource.Noto
            ? T extends typeof EmojiType.Anim
              ? typeof EmojiFormat.Webp | typeof EmojiFormat.Gif | typeof EmojiFormat.Avif | typeof EmojiFormat.Lottie
              : typeof EmojiFormat.Svg
            : S extends typeof EmojiSource.Twemoji
              ? typeof EmojiFormat.Svg
              : S extends typeof EmojiSource.Blobmoji
                ? typeof EmojiFormat.Png
                : never



/**
 * Valid visual styles allowed per provider at runtime.
 */
export const validEmojiTypes: Record<EmojiSource, string[]> = {
  [EmojiSource.Apple]: [EmojiType.Flat, EmojiType.Pure],
  [EmojiSource.Fluent]: [EmojiType.Anim, EmojiType.Flat, EmojiType.Modern, EmojiType.Mono, EmojiType.ThreeD, EmojiType.Pure],
  [EmojiSource.Telegram]: [EmojiType.Anim, EmojiType.Pure],
  [EmojiSource.Twemoji]: [EmojiType.Flat, EmojiType.Pure],
  [EmojiSource.Blobmoji]: [EmojiType.Flat, EmojiType.Pure],
  [EmojiSource.Noto]: [EmojiType.Anim, EmojiType.Flat, EmojiType.Pure],
}

/**
 * Returns the default visual style for a given provider.
 */
export const getEmojiDefaultType = (source: EmojiSource): EmojiType => {
  switch (source) {
    case EmojiSource.Fluent:
      return EmojiType.ThreeD
    case EmojiSource.Telegram:
      return EmojiType.Anim
    case EmojiSource.Noto:
      return EmojiType.Anim
    case EmojiSource.Apple:
      return EmojiType.Flat
    case EmojiSource.Twemoji:
      return EmojiType.Flat
    case EmojiSource.Blobmoji:
      return EmojiType.Flat
    default:
      return EmojiType.ThreeD
  }
}

/**
 * Authorized formats per visual style for each provider at runtime.
 */
export const validEmojiFormats: Record<EmojiSource, Record<string, EmojiFormat[]>> = {
  [EmojiSource.Fluent]: {
    [EmojiType.ThreeD]: [EmojiFormat.Webp],
    [EmojiType.Anim]: [EmojiFormat.Webp, EmojiFormat.Png],
    [EmojiType.Flat]: [EmojiFormat.Svg],
    [EmojiType.Modern]: [EmojiFormat.Svg],
    [EmojiType.Mono]: [EmojiFormat.Svg],
    [EmojiType.Pure]: [],
  },
  [EmojiSource.Apple]: {
    [EmojiType.Flat]: [EmojiFormat.Png],
    [EmojiType.Pure]: [],
  },
  [EmojiSource.Telegram]: {
    [EmojiType.Anim]: [EmojiFormat.Webp],
    [EmojiType.Pure]: [],
  },
  [EmojiSource.Noto]: {
    [EmojiType.Anim]: [EmojiFormat.Webp, EmojiFormat.Gif, EmojiFormat.Avif, EmojiFormat.Lottie],
    [EmojiType.Flat]: [EmojiFormat.Svg],
    [EmojiType.Pure]: [],
  },
  [EmojiSource.Twemoji]: {
    [EmojiType.Flat]: [EmojiFormat.Svg],
    [EmojiType.Pure]: [],
  },
  [EmojiSource.Blobmoji]: {
    [EmojiType.Flat]: [EmojiFormat.Png],
    [EmojiType.Pure]: [],
  },
}

// ---------------------------------------------------------------------------
// Strict Discriminated Unions for Options (Per-Type & Per-Format)
// ---------------------------------------------------------------------------

export type FluentResolveOptions =
  | {
      /** Microsoft Fluent Emojis (Windows 11) */
      source?: typeof EmojiSource.Fluent
      /** High fidelity 3D renders (WebP 256×256) */
      type?: typeof EmojiType.ThreeD
      /** Media format for 3D is always WebP */
      format?: typeof EmojiFormat.Webp
    }
  | {
      source?: typeof EmojiSource.Fluent
      /** High framerate animations (WebP or APNG) */
      type: typeof EmojiType.Anim
      /** Media format for animated Fluent emojis: WebP (default) or lossless APNG */
      format?: typeof EmojiFormat.Webp | typeof EmojiFormat.Png
    }
  | {
      source?: typeof EmojiSource.Fluent
      /** Vector graphics (SVG) */
      type: typeof EmojiType.Flat | typeof EmojiType.Modern | typeof EmojiType.Mono
      /** Media format for vector styles is always SVG */
      format?: typeof EmojiFormat.Svg
    }
  | {
      source?: typeof EmojiSource.Fluent
      /** Native OS emoji font text rendering */
      type: typeof EmojiType.Pure
      format?: never
    }

export type AppleResolveOptions =
  | {
      /** Apple standard emojis (iOS / macOS) */
      source: typeof EmojiSource.Apple
      /** Apple standard PNG (160×160) */
      type?: typeof EmojiType.Flat
      /** Media format for Apple emojis is PNG */
      format?: typeof EmojiFormat.Png
    }
  | {
      source: typeof EmojiSource.Apple
      type: typeof EmojiType.Pure
      format?: never
    }

export type TelegramResolveOptions =
  | {
      /** Telegram Animated Emojis (HD 512×512 WebP) */
      source: typeof EmojiSource.Telegram
      /** High definition animated emojis (512×512) */
      type?: typeof EmojiType.Anim
      /** Media format for Telegram animated emojis is WebP */
      format?: typeof EmojiFormat.Webp
    }
  | {
      source: typeof EmojiSource.Telegram
      type: typeof EmojiType.Pure
      format?: never
    }

export type NotoResolveOptions =
  | {
      /** Google Noto Emojis (served live from Google's global CDN `fonts.gstatic.com`) */
      source: typeof EmojiSource.Noto
      /** Google Noto animated emojis */
      type?: typeof EmojiType.Anim
      /** Animated formats: WebP (default), GIF, AVIF, or Lottie JSON */
      format?: typeof EmojiFormat.Webp | typeof EmojiFormat.Gif | typeof EmojiFormat.Avif | typeof EmojiFormat.Lottie
    }
  | {
      source: typeof EmojiSource.Noto
      /** Google Noto flat vector emojis */
      type: typeof EmojiType.Flat
      /** Vector format is SVG */
      format?: typeof EmojiFormat.Svg
    }
  | {
      source: typeof EmojiSource.Noto
      type: typeof EmojiType.Pure
      format?: never
    }

export type TwemojiResolveOptions =
  | {
      /** Twitter / X Twemoji Vector Emojis */
      source: typeof EmojiSource.Twemoji
      /** Infinitely scalable vector (SVG) */
      type?: typeof EmojiType.Flat
      /** Format for Twemoji is SVG */
      format?: typeof EmojiFormat.Svg
    }
  | {
      source: typeof EmojiSource.Twemoji
      type: typeof EmojiType.Pure
      format?: never
    }

export type BlobmojiResolveOptions =
  | {
      /** Classic Google Blob Emojis (Retro Blobs) */
      source: typeof EmojiSource.Blobmoji
      /** Retro Google Blob (PNG 128×128) */
      type?: typeof EmojiType.Flat
      /** Format for Blobmoji is PNG */
      format?: typeof EmojiFormat.Png
    }
  | {
      source: typeof EmojiSource.Blobmoji
      type: typeof EmojiType.Pure
      format?: never
    }

export type EmojiFallbackOption =
  | boolean
  | EmojiSource
  | { source: EmojiSource; type?: EmojiType }

/**
 * Universal discriminated union of emoji resolution options.
 */
export type ResolveEmojiOptionsUnion = (
  | FluentResolveOptions
  | AppleResolveOptions
  | TelegramResolveOptions
  | NotoResolveOptions
  | TwemojiResolveOptions
  | BlobmojiResolveOptions
) & {
  /**
   * Smart fallback cascade: if the asset does not exist in the requested provider/style,
   * automatically fall back to the closest available provider/style instead of throwing 404.
   */
  fallback?: EmojiFallbackOption
}


export type EmojiOptionsBySource<T extends EmojiSource = typeof EmojiSource.Fluent> =
  T extends typeof EmojiSource.Apple ? AppleResolveOptions :
  T extends typeof EmojiSource.Telegram ? TelegramResolveOptions :
  T extends typeof EmojiSource.Noto ? NotoResolveOptions :
  T extends typeof EmojiSource.Twemoji ? TwemojiResolveOptions :
  T extends typeof EmojiSource.Blobmoji ? BlobmojiResolveOptions :
  FluentResolveOptions

/**
 * Resolution options supporting generic source narrowing or default discriminated union.
 */
export type ResolveEmojiOptions<T extends EmojiSource = typeof EmojiSource.Fluent> =
  [T] extends [never] ? ResolveEmojiOptionsUnion :
  EmojiOptionsBySource<T>

// ---------------------------------------------------------------------------
// Provider Metadata (for UI Pickers, Playgrounds, and Inspections)
// ---------------------------------------------------------------------------

export interface EmojiProviderMeta {
  /** Unique provider identifier */
  id: EmojiSource
  /** Display name of the provider */
  name: string
  /** Brief description of the design aesthetic */
  description: string
  /** Default visual style used if none specified */
  defaultType: EmojiType
  /** List of authorized visual styles */
  types: EmojiType[]
  /** List of authorized file format extensions */
  formats: EmojiFormat[]
  /** Whether this provider offers animated versions */
  animated: boolean
  /** Whether this provider offers vector SVG versions */
  vector: boolean
}

/**
 * Public catalog of all supported providers and their technical capabilities.
 */
export const EMOJI_PROVIDERS_META: Record<EmojiSource, EmojiProviderMeta> = {
  [EmojiSource.Fluent]: {
    id: EmojiSource.Fluent,
    name: 'Microsoft Fluent',
    description: 'Microsoft Windows 11 3D & Animated Emojis',
    defaultType: EmojiType.ThreeD,
    types: [EmojiType.ThreeD, EmojiType.Anim, EmojiType.Flat, EmojiType.Modern, EmojiType.Mono],
    formats: [EmojiFormat.Webp, EmojiFormat.Png, EmojiFormat.Svg],
    animated: true,
    vector: true,
  },
  [EmojiSource.Apple]: {
    id: EmojiSource.Apple,
    name: 'Apple',
    description: 'Apple iOS & macOS Standard Emojis',
    defaultType: EmojiType.Flat,
    types: [EmojiType.Flat],
    formats: [EmojiFormat.Png],
    animated: false,
    vector: false,
  },
  [EmojiSource.Telegram]: {
    id: EmojiSource.Telegram,
    name: 'Telegram',
    description: 'Telegram HD 512×512 Animated Emojis',
    defaultType: EmojiType.Anim,
    types: [EmojiType.Anim],
    formats: [EmojiFormat.Webp],
    animated: true,
    vector: false,
  },
  [EmojiSource.Noto]: {
    id: EmojiSource.Noto,
    name: 'Google Noto',
    description: 'Google Animated & Vector Emojis (Google Global CDN)',
    defaultType: EmojiType.Anim,
    types: [EmojiType.Anim, EmojiType.Flat],
    formats: [EmojiFormat.Webp, EmojiFormat.Gif, EmojiFormat.Avif, EmojiFormat.Lottie, EmojiFormat.Svg],
    animated: true,
    vector: true,
  },
  [EmojiSource.Twemoji]: {
    id: EmojiSource.Twemoji,
    name: 'Twemoji (Twitter / X)',
    description: 'Twitter / X Open Source Vector Emojis',
    defaultType: EmojiType.Flat,
    types: [EmojiType.Flat],
    formats: [EmojiFormat.Svg],
    animated: false,
    vector: true,
  },
  [EmojiSource.Blobmoji]: {
    id: EmojiSource.Blobmoji,
    name: 'Blobmoji (Google Blobs)',
    description: 'Classic Retro Google Blob Emojis',
    defaultType: EmojiType.Flat,
    types: [EmojiType.Flat],
    formats: [EmojiFormat.Png],
    animated: false,
    vector: false,
  },
}
