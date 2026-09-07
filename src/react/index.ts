export { Emoji, default } from "./Emoji";
export { useEmoji } from "./use-emoji";
export { isEmojiSupported, getSmartFallbackForEmoji, getAvailableProvidersForEmoji } from "@/data/manifest";
export { EmojiSource, EmojiType, EMOJI_PROVIDERS_META } from "@/types";
export type {
  EmojiProps,
  UseEmojiOptions,
  UseEmojiResult,
  EmojiProviderMeta,
  EmojiCatalog,
  AnyStandardEmoji,
} from "@/types";

