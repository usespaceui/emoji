import { EmojiFormat } from "@/types";
import { toUnicode } from "@/core/utils";

export const getAppleEmojiName = (emoji: string): string => {
  return `${toUnicode(emoji)}.${EmojiFormat.Png}`;
};

