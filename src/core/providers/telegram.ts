import { EmojiFormat } from "@/types";
import { toUnicode } from "@/core/utils";

export const getTelegramEmojiName = (emoji: string): string => {
  return `${toUnicode(emoji)}.${EmojiFormat.Webp}`;
};

