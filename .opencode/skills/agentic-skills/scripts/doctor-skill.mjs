#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const args = process.argv.slice(2)
const targetPath = args[0] ? resolve(args[0]) : process.cwd()
const skillMdPath = join(targetPath, 'SKILL.md')

if (!existsSync(skillMdPath)) {
  console.error(`SKILL.md not found at ${skillMdPath}`)
  process.exit(1)
}

const content = readFileSync(skillMdPath, 'utf-8')

if (!content.startsWith('---')) {
  console.error('Missing YAML frontmatter in SKILL.md')
  process.exit(1)
}

const fixed = fixMultilineDescription(content)

if (fixed === content) {
  console.log('No changes needed.')
  process.exit(0)
}

writeFileSync(skillMdPath, fixed, 'utf-8')
console.log(
  'Fixed multi-line description and added # prettier-ignore if needed.'
)

function fixMultilineDescription(source) {
  const lines = source.split('\n')
  const out = []
  let inFrontmatter = false
  let frontmatterCount = 0
  let inDescription = false
  const descriptionParts = []
  let hasPrettierIgnore = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.trim() === '---') {
      frontmatterCount += 1
      if (frontmatterCount === 2 && inDescription) {
        out.push(`description: ${descriptionParts.join(' ')}`)
        descriptionParts.length = 0
        inDescription = false
      }
      inFrontmatter = frontmatterCount === 1
      out.push(line)
      continue
    }

    if (!inFrontmatter) {
      out.push(line)
      continue
    }

    if (line.trim() === '# prettier-ignore') {
      hasPrettierIgnore = true
      out.push(line)
      continue
    }

    if (line.match(/^description:/)) {
      const valueMatch = line.match(/^description:\s*(.*)$/)
      const valueOnLine = valueMatch ? valueMatch[1].trim() : ''
      if (!hasPrettierIgnore) {
        out.push('# prettier-ignore')
        hasPrettierIgnore = true
      }
      if (valueOnLine) {
        out.push(`description: ${valueOnLine}`)
        continue
      }
      inDescription = true
      continue
    }

    if (inDescription) {
      if (line.match(/^[a-z_-]+:/)) {
        out.push(`description: ${descriptionParts.join(' ')}`)
        descriptionParts.length = 0
        inDescription = false
        out.push(line)
        continue
      }
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        descriptionParts.push(trimmed)
      }
      continue
    }

    out.push(line)
  }

  if (inDescription && descriptionParts.length > 0) {
    out.push(`description: ${descriptionParts.join(' ')}`)
  }

  return out.join('\n')
}
