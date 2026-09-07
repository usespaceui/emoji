import { EmojiFormat, EmojiType } from "@/types";
import { toUnicode } from "@/core/utils";

export const getFluentEmojiName = (
  emoji: string,
  type: EmojiType = EmojiType.ThreeD,
  format?: EmojiFormat,
): string => {
  if (type === EmojiType.Anim && format === EmojiFormat.Png) {
    return `${toUnicode(emoji)}.${EmojiFormat.Png}`;
  }
  const ext = [EmojiType.Anim, EmojiType.ThreeD].includes(type as any) ? EmojiFormat.Webp : EmojiFormat.Svg;
  return `${toUnicode(emoji)}.${ext}`;
};

