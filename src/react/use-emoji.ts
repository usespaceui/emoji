"use client";

import { useMemo } from "react";
import { EmojiSource, EmojiType } from "@/types";
import type { UseEmojiOptions, UseEmojiResult } from "@/types";
import { resolveEmojiUrl } from "@/core/cdn";

/**
 * Hook to resolve an emoji's CDN URL or identify native status.
 */
export function useEmoji<T extends EmojiSource = typeof EmojiSource.Fluent>(
  emoji: string,
  options?: UseEmojiOptions<T>,
): UseEmojiResult {
  const isNative = options?.type === EmojiType.Pure;

  const url = useMemo(() => {
    if (isNative || !emoji) return undefined;
    return resolveEmojiUrl(emoji, {
      source: options?.source,
      type: options?.type,
      format: options?.format,
    } as any);
  }, [emoji, options?.source, options?.type, options?.format, isNative]);

  return { url, isNative };
}
