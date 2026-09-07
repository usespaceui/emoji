import { defineConfig } from "tsup";
import path from "path";
import { copyFile, mkdir } from "fs/promises";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    react: "src/react/index.ts",
    data: "src/data/index.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  external: ["react", "react-dom", "lottie-web"],
  alias: {
    "@": path.resolve(__dirname, "src"),
  },
  onSuccess: async () => {
    try {
      const destDir = path.resolve(__dirname, "dist/data/emojiLib");
      await mkdir(destDir, { recursive: true });
      await copyFile(
        path.resolve(__dirname, "src/data/emojiLib/index.json"),
        path.resolve(destDir, "index.json"),
      );
      await copyFile(
        path.resolve(__dirname, "src/data/emoji-manifest.json"),
        path.resolve(__dirname, "dist/data/emoji-manifest.json"),
      );
      console.log("✓ Copied data files to dist/data/");

    } catch (err) {
      console.error("Error copying data files:", err);
    }
  },
});
