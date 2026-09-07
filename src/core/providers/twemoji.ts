import { EmojiFormat } from "@/types";
import { toUnicode } from "@/core/utils";

export const getTwemojiEmojiName = (emoji: string): string => {
  return `${toUnicode(emoji)}.${EmojiFormat.Svg}`;
};

