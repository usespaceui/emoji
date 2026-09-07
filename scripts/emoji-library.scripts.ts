import emojilib from 'unicode-emoji-json';
import fs from 'node:fs';
import { resolve } from 'node:path';

export function generateEmojiLib(saveToFile = false) {
  const newEmojilib = Object.fromEntries(
    Object.entries(emojilib).map(([emoji, item]) => [emoji, item.slug.replaceAll('_', '-')])
  );

  if (saveToFile) {
    const filePath = resolve(process.cwd(), '../data/emojiLib/index.json');
    fs.writeFileSync(filePath, JSON.stringify(newEmojilib, undefined, 2));
    console.log(`✅ File saved : ${filePath}`);
  }

  return newEmojilib;
}
