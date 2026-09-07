import fs from 'node:fs'
import path from 'node:path'

const EXT_FORMAT: Record<string, string> = {
  '.webp': 'webp',
  '.png': 'png',
  '.svg': 'svg',
  '.gif': 'gif',
  '.json': 'lottie',
}

const candidatePaths = [
  path.resolve(__dirname, '../../ui/cdn/common/emoji'),
  path.resolve(__dirname, '../../../../../design-system/packages/ui/cdn/common/emoji'),
  path.resolve(__dirname, '../../../../design-system/packages/ui/cdn/common/emoji'),
  'F:/laragon/www/oricodes_plugin/_uikit/uisource/space-ui/packages/ui/cdn/common/emoji',
]
const EMOJI_CDN_DIR = candidatePaths.find((p) => fs.existsSync(p)) || candidatePaths[0]

const OUTPUT_DATA_DIR = path.resolve(__dirname, '../src/data')
const OUTPUT_TYPES_DIR = path.resolve(__dirname, '../src/types')

interface ManifestOutput {
  generatedAt: string
  counts: Record<string, number>
  providers: Record<string, string[]>
}

// Convert hex string (e.g. "1f525" or "1f44d-1f3fd") to actual Unicode emoji character
function hexToChar(hex: string): string {
  try {
    const codes = hex.split('-').map((h) => Number.parseInt(h, 16))
    return String.fromCodePoint(...codes)
  } catch {
    return ''
  }
}

function toPascal(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function run() {
  console.log('🔍 Scanning emoji CDN directory:', EMOJI_CDN_DIR)
  if (!fs.existsSync(EMOJI_CDN_DIR)) {
    throw new Error(`Directory not found: ${EMOJI_CDN_DIR}`)
  }

  const manifest: ManifestOutput = {
    generatedAt: new Date().toISOString(),
    counts: {},
    providers: {},
  }

  const sources = fs.readdirSync(EMOJI_CDN_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()

  const providerTypeEntries: Array<{
    source: string
    type: string
    key: string
    pascalName: string
    codepoints: string[]
    chars: string[]
  }> = []

  for (const source of sources) {
    const sourcePath = path.join(EMOJI_CDN_DIR, source)
    const types = fs.readdirSync(sourcePath, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort()

    for (const type of types) {
      const typePath = path.join(sourcePath, type)
      const files = fs.readdirSync(typePath)

      const codepointSet = new Set<string>()
      const byFormat = new Map<string, Set<string>>()
      for (const file of files) {
        const ext = path.extname(file).toLowerCase()
        const format = EXT_FORMAT[ext]
        if (!format) continue
        const codepoint = path.basename(file, ext).toLowerCase()
        codepointSet.add(codepoint)
        if (!byFormat.has(format)) byFormat.set(format, new Set())
        byFormat.get(format)!.add(codepoint)
      }

      const sortedCodepoints = Array.from(codepointSet).sort()
      const key = `${source}/${type}`
      manifest.providers[key] = sortedCodepoints
      manifest.counts[key] = sortedCodepoints.length
      for (const [format, set] of byFormat) {
        const formatKey = `${key}/${format}`
        const sorted = Array.from(set).sort()
        manifest.providers[formatKey] = sorted
        manifest.counts[formatKey] = sorted.length
      }

      const chars: string[] = []
      for (const cp of sortedCodepoints) {
        const char = hexToChar(cp)
        if (char) chars.push(char)
      }

      const pascalName = `${toPascal(source)}${toPascal(type)}`
      providerTypeEntries.push({
        source,
        type,
        key,
        pascalName,
        codepoints: sortedCodepoints,
        chars,
      })

      console.log(`  ✔ [${key}]: ${sortedCodepoints.length} emojis`)
    }
  }

  // Ensure output directories exist
  fs.mkdirSync(OUTPUT_DATA_DIR, { recursive: true })
  fs.mkdirSync(OUTPUT_TYPES_DIR, { recursive: true })

  // 1. Write manifest JSON
  const manifestJsonPath = path.join(OUTPUT_DATA_DIR, 'emoji-manifest.json')
  fs.writeFileSync(manifestJsonPath, JSON.stringify(manifest, null, 2), 'utf-8')
  console.log(`💾 Manifest saved to ${manifestJsonPath}`)

  // 2. Write unified emoji catalog types
  let catalogCode = `/**
 * Auto-generated Universal Emoji Catalog types.
 * Generated on: ${manifest.generatedAt}
 * Covers all ${providerTypeEntries.length} provider/type pairings directly from CDN assets.
 */\n\n`

  for (const entry of providerTypeEntries) {
    const constName = `${entry.source.toUpperCase()}_${entry.type.toUpperCase()}_CODEPOINTS`
    const charConstName = `${entry.source.toUpperCase()}_${entry.type.toUpperCase()}_EMOJIS`
    
    catalogCode += `// ---------------------------------------------------------------------------\n`
    catalogCode += `// ${entry.key} (${entry.codepoints.length} emojis)\n`
    catalogCode += `// ---------------------------------------------------------------------------\n`
    catalogCode += `export const ${constName} = ${JSON.stringify(entry.codepoints)} as const\n`
    catalogCode += `export type ${entry.pascalName}Codepoint = (typeof ${constName})[number]\n\n`
    catalogCode += `export const ${charConstName} = ${JSON.stringify(entry.chars)} as const\n`
    catalogCode += `export type ${entry.pascalName}Char = (typeof ${charConstName})[number]\n\n`
    catalogCode += `export type ${entry.pascalName}Emoji = ${entry.pascalName}Char | ${entry.pascalName}Codepoint\n\n`
  }

  // Generate catalog interface
  catalogCode += `// ---------------------------------------------------------------------------\n`
  catalogCode += `// Universal Provider/Type Catalog Mapping\n`
  catalogCode += `// ---------------------------------------------------------------------------\n`
  catalogCode += `export interface EmojiCatalog {\n`
  for (const entry of providerTypeEntries) {
    catalogCode += `  '${entry.key}': ${entry.pascalName}Emoji\n`
  }
  catalogCode += `}\n\n`

  // Helpful aliases
  catalogCode += `/** Type of any supported emoji in the primary Apple/Flat reference set */\n`
  catalogCode += `export type AnyStandardEmoji = AppleFlatEmoji\n`

  const catalogTypesPath = path.join(OUTPUT_TYPES_DIR, 'emoji-catalog.ts')
  fs.writeFileSync(catalogTypesPath, catalogCode, 'utf-8')
  console.log(`💾 Universal Emoji Catalog types saved to ${catalogTypesPath}`)
}

run()
