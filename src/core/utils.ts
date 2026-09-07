import emojiRegex from "emoji-regex";

export function isEmoji(emoji: string): boolean {
  const regex = emojiRegex();
  const pureEmoji = emoji.match(regex)?.[0];
  return pureEmoji !== undefined;
}

export function isFlagEmoji(emoji: string): boolean {
  const flagRegex = /(?:\uD83C[\uDDE6-\uDDFF]){2}/;
  return flagRegex.test(emoji);
}

function padHex(part: string) {
  const hex = part.toLowerCase()
  return hex.length < 4 ? hex.padStart(4, '0') : hex
}

export function toUnicode(emoji: string): string {
  const trimmed = emoji.trim()
  if (/^[0-9a-fA-F]{4,6}([-_][0-9a-fA-F]{4,6})*$/.test(trimmed)) {
    return trimmed.toLowerCase().replace(/_/g, '-').split('-').map(padHex).join('-')
  }
  return [...emoji].map((char) => padHex(char.codePointAt(0)!.toString(16))).join('-')
}

export function fromUnicode(codepoint: string): string {
  return codepoint
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => String.fromCodePoint(Number.parseInt(part, 16)))
    .join("");
}
