import { EmojiFormat, EmojiType } from "@/types";
import { toUnicode } from "@/core/utils";

export const getNotoEmojiName = (
  emoji: string,
  type: EmojiType = EmojiType.Anim,
  format?: EmojiFormat,
): string => {
  if (type === EmojiType.Flat) {
    return `${toUnicode(emoji)}.${EmojiFormat.Svg}`;
  }
  const ext = format || EmojiFormat.Webp;
  return `${toUnicode(emoji)}.${ext}`;
};

/**
 * Resolves direct Google Fonts CDN URL for Google Noto Emoji.
 * Google hosts 512.webp, 512.avif, 512.gif, lottie.json and emoji.svg directly.
 */
export const getGoogleNotoUrl = (
  emoji: string,
  format: EmojiFormat = EmojiFormat.Webp,
): string => {
  const codepoint = toUnicode(emoji).replace(/-/g, "_");
  if (format === EmojiFormat.Svg) {
    return `https://fonts.gstatic.com/s/e/notoemoji/latest/${codepoint}/emoji.svg`;
  }
  if (format === EmojiFormat.Lottie) {
    return `https://fonts.gstatic.com/s/e/notoemoji/latest/${codepoint}/lottie.json`;
  }
  return `https://fonts.gstatic.com/s/e/notoemoji/latest/${codepoint}/512.${format}`;
};
