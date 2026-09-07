import { EmojiFormat } from "@/types";
import { toUnicode } from "@/core/utils";

export const getBlobmojiEmojiName = (emoji: string): string => {
  return `${toUnicode(emoji)}.${EmojiFormat.Png}`;
};

