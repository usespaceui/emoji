import type { ElementType, HTMLAttributes, ReactElement, Ref } from 'react'
import type {
  AllowedEmojiFormat,
  AllowedEmojiType,
  EmojiCatalog,
  EmojiDefaultType,
  EmojiFallbackOption,
  EmojiFormat,
  EmojiSource,
  EmojiType,
  ResolveEmojiOptions,
  ResolveEmojiOptionsUnion,
} from './emoji'

export interface EmojiBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * The emoji character (e.g. "😀", "🚀", "🎉") or its Unicode hexadecimal code (e.g. "1f600").
   */
  emoji: string
  /**
   * Render target element type or custom component.
   * @default "img"
   */
  as?: ElementType
  /**
   * Size of the rendered emoji in pixels (width and height).
   * @default 40
   */
  size?: number
  /**
   * Disable default image optimization if applicable.
   * @default false
   */
  unoptimized?: boolean
}

/**
 * Universal catalog-driven emoji input:
 * Strictly narrows accepted emojis to the actual assets available for the given provider and visual style,
 * unless fallback mode is enabled (in which case any string is accepted).
 */
export type EmojiInput<
  S extends EmojiSource = typeof EmojiSource.Fluent,
  T extends EmojiType = EmojiDefaultType<S>,
  Fallback extends boolean | undefined = undefined,
> = Fallback extends true
  ? string
  : `${S}/${T}` extends keyof EmojiCatalog
    ? EmojiCatalog[`${S}/${T}`]
    : string

/**
 * Props for the <Emoji /> component, automatically narrowing visual style
 * and format options based on the chosen provider (`source`).
 */
export type EmojiProps<
  S extends EmojiSource = typeof EmojiSource.Fluent,
  T extends EmojiType = EmojiDefaultType<S>,
  F extends EmojiFormat = AllowedEmojiFormat<S, T>,
  Fallback extends boolean | undefined = undefined,
> = Omit<EmojiBaseProps, 'emoji'> & {
  emoji: EmojiInput<S, T, Fallback>
  source?: S
  type?: T extends AllowedEmojiType<S> ? T : AllowedEmojiType<S>
  format?: F extends AllowedEmojiFormat<S, T> ? F : AllowedEmojiFormat<S, T>
  /**
   * Smart fallback cascade: if the asset does not exist in the requested provider/style,
   * automatically fall back to the closest available provider/style instead of throwing 404.
   */
  fallback?: Fallback | EmojiFallbackOption
} & { ref?: Ref<any> }


export type EmojiPropsUnion = EmojiBaseProps & ResolveEmojiOptionsUnion

export interface EmojiComponent {
  <
    S extends EmojiSource = typeof EmojiSource.Fluent,
    T extends EmojiType = EmojiDefaultType<S>,
    F extends EmojiFormat = AllowedEmojiFormat<S, T>,
    Fallback extends boolean | undefined = undefined,
  >(
    props: EmojiProps<S, T, F, Fallback>
  ): ReactElement | null
  displayName?: string
}




/**
 * Options for the `useEmoji` hook, with discriminated union narrowing.
 */
export type UseEmojiOptions<T extends EmojiSource = typeof EmojiSource.Fluent> = ResolveEmojiOptions<T>

export interface UseEmojiResult {
  /** The resolved CDN or Google URL for the emoji asset (undefined if pure native text mode) */
  url: string | undefined
  /** Whether pure native OS text rendering is requested */
  isNative: boolean
}
