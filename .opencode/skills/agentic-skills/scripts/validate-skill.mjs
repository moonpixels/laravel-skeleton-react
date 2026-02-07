#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'

const args = process.argv.slice(2)
const targetPath = args[0] ? resolve(args[0]) : process.cwd()
const outputJson = args.includes('--json')
const strict = args.includes('--strict')

const errors = []
const warnings = []

const limits = {
  descriptionMax: 300,
  descriptionWarn: 200,
  bodyLineMax: 50,
  codeBlockWarn: 2,
  codeBlockMax: 3,
  sectionWarn: 8,
}

function error(message) {
  errors.push(message)
}

function warn(message) {
  warnings.push(message)
}

function stripCodeBlocks(content) {
  return content.replace(/```[\s\S]*?```/g, '')
}

function stripHtmlComments(content) {
  return content.replace(/<!--[\s\S]*?-->/g, '')
}

function countWords(text) {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length
}

function estimateTokens(wordCount) {
  return Math.round(wordCount * 1.3)
}

function extractKeywords(text) {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3)
  const unique = [...new Set(words)]
  const stopwords = new Set([
    'this',
    'that',
    'with',
    'from',
    'have',
    'will',
    'when',
    'what',
    'where',
    'which',
    'their',
    'them',
    'then',
    'than',
    'these',
    'those',
    'there',
  ])
  return unique.filter((word) => !stopwords.has(word))
}

function hasYamlFrontmatter(content) {
  return content.startsWith('---\n') || content.startsWith('---\r\n')
}

function extractFrontmatter(content) {
  if (!hasYamlFrontmatter(content)) {
    return { name: null, description: null, body: content, rawFrontmatter: '' }
  }
  const parts = content.split('---\n')
  if (parts.length < 3) {
    return { name: null, description: null, body: content, rawFrontmatter: '' }
  }
  const frontmatter = parts[1]
  const body = parts.slice(2).join('---\n')
  const nameMatch = frontmatter.match(/name:\s*(.+)/)
  const name = nameMatch ? nameMatch[1].trim() : null
  const descMatch = frontmatter.match(/description:\s*(.+?)(?=\n[a-z]+:|$)/s)
  const description = descMatch ? descMatch[1].trim() : null
  return { name, description, body, rawFrontmatter: frontmatter }
}

function isDescriptionMultiline(frontmatter) {
  const descLineMatch = frontmatter.match(/^description:\s*(.*)$/m)
  if (!descLineMatch) return false
  const valueOnLine = descLineMatch[1].trim()
  if (!valueOnLine) return true
  const lines = frontmatter.split('\n')
  let foundDesc = false
  for (const line of lines) {
    if (line.match(/^description:/)) {
      foundDesc = true
      continue
    }
    if (foundDesc) {
      if (
        line.match(/^\s+\S/) &&
        !line.trim().startsWith('#') &&
        !line.match(/^[a-z_-]+:/)
      ) {
        return true
      }
      if (line.match(/^[a-z_-]+:/)) {
        break
      }
    }
  }
  return false
}

function validateNameFormat(name, dirName) {
  if (!name) {
    error('SKILL.md frontmatter missing name')
    return
  }
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) {
    error(`Skill name must match regex ^[a-z0-9]+(-[a-z0-9]+)*$: ${name}`)
  }
  if (name.length > 64) {
    error(`Skill name too long (max 64 chars): ${name.length}`)
  }
  if (name !== dirName) {
    error(`Skill name '${name}' must match directory '${dirName}'`)
  }
}

function validateDescription(description, frontmatter) {
  if (!description) {
    error('SKILL.md frontmatter missing description')
    return
  }
  if (isDescriptionMultiline(frontmatter)) {
    error('Description must be single-line YAML (multiline detected)')
  }
  if (description.length > limits.descriptionMax) {
    error(
      `Description too long (${description.length}, max ${limits.descriptionMax})`
    )
  } else if (description.length > limits.descriptionWarn) {
    warn(
      `Description length ${description.length} (recommended <= ${limits.descriptionWarn})`
    )
  }
  const lower = description.toLowerCase()
  const hasTrigger =
    lower.includes('use when') ||
    lower.includes('use for') ||
    lower.includes('use to')
  if (!hasTrigger) {
    error('Description missing trigger phrase: Use when/Use for/Use to')
  }
  if (/\b(I can|I will|I help|my|me)\b/i.test(description)) {
    warn('Description uses first person (prefer third person)')
  }
  const actionVerbs =
    /^(create|build|design|analyze|test|validate|generate|process|manage|execute|handle|provide)/i
  if (!actionVerbs.test(description.trim())) {
    warn('Description is not action-oriented (start with a verb)')
  }
}

function validateBody(body) {
  const bodyWithoutComments = stripHtmlComments(body)
  const lines = bodyWithoutComments
    .trim()
    .split('\n')
    .filter((line) => line.length > 0)
  const lineCount = lines.length
  if (lineCount > limits.bodyLineMax) {
    error(`SKILL.md body has ${lineCount} lines (max ${limits.bodyLineMax})`)
  }
  const codeBlocks = (body.match(/```[\s\S]*?```/g) || []).length
  if (codeBlocks > limits.codeBlockMax) {
    error(`SKILL.md has ${codeBlocks} code blocks (max ${limits.codeBlockMax})`)
  } else if (codeBlocks > limits.codeBlockWarn) {
    warn(
      `SKILL.md has ${codeBlocks} code blocks (recommended <= ${limits.codeBlockWarn})`
    )
  }
  const sections = (body.match(/^#{1,6}\s/gm) || []).length
  if (sections > limits.sectionWarn) {
    warn(
      `SKILL.md has ${sections} sections (recommended <= ${limits.sectionWarn})`
    )
  }
  if (!body.includes('## Quick Start') && !body.includes('## Quick start')) {
    error('Missing required "## Quick Start" section')
  }
  const wordCount = countWords(body)
  const estimatedTokens = estimateTokens(wordCount)
  return { lineCount, codeBlocks, sections, wordCount, estimatedTokens }
}

function validateReferences(skillPath, body) {
  const referencesDir = join(skillPath, 'references')
  const skillContent = stripCodeBlocks(body)
  const referencePattern = /\[([^\]]+)\]\((references\/[^)]+\.md)\)/g
  const matches = [...skillContent.matchAll(referencePattern)]

  const referencedFiles = matches.map((match) => match[2])
  const missing = []
  const nesting = []

  for (const filePath of referencedFiles) {
    const fullPath = join(skillPath, filePath)
    if (!existsSync(fullPath)) {
      missing.push(filePath)
      error(`Referenced file not found: ${filePath}`)
      continue
    }
    const depth = referenceDepth(skillPath, filePath)
    if (depth > 1) {
      warn(`Reference nesting depth ${depth} for ${filePath} (recommended 1)`)
    }
    nesting.push({ file: filePath, depth })
  }

  if (existsSync(referencesDir)) {
    const files = readdirSync(referencesDir).filter((file) =>
      file.endsWith('.md')
    )
    for (const file of files) {
      const referenced = referencedFiles.some((ref) => ref.endsWith(file))
      if (!referenced) {
        warn(`Reference file not linked from SKILL.md: ${file}`)
      }
    }
  }

  return { referencedFiles, missing, nesting }
}

function referenceDepth(skillPath, filePath, visited = new Set()) {
  if (visited.has(filePath)) return 0
  visited.add(filePath)
  const fullPath = join(skillPath, filePath)
  if (!existsSync(fullPath)) return 0
  const content = stripCodeBlocks(readFileSync(fullPath, 'utf-8'))
  const referencePattern = /\[([^\]]+)\]\((references\/[^)]+\.md)\)/g
  const matches = [...content.matchAll(referencePattern)]
  if (matches.length === 0) return 1
  let maxDepth = 1
  for (const match of matches) {
    const nestedDepth = referenceDepth(skillPath, match[2], new Set(visited))
    maxDepth = Math.max(maxDepth, 1 + nestedDepth)
  }
  return maxDepth
}

function validateKeywords(description, body) {
  const descKeywords = extractKeywords(description)
  const bodyKeywords = extractKeywords(body)
  if (descKeywords.length < 5 || bodyKeywords.length < 5) return
  const overlap = descKeywords.filter((keyword) =>
    bodyKeywords.includes(keyword)
  )
  const overlapRatio = overlap.length / descKeywords.length
  if (overlapRatio < 0.3) {
    warn(
      `Low keyword overlap between description and body (${Math.round(overlapRatio * 100)}%)`
    )
  }
}

function validateSkillPath(skillPath) {
  const stats = statSync(skillPath)
  if (!stats.isDirectory()) {
    error(`Path is not a directory: ${skillPath}`)
    return null
  }
  const skillMdPath = join(skillPath, 'SKILL.md')
  if (!existsSync(skillMdPath)) {
    error('SKILL.md not found in skill directory')
    return null
  }
  const content = readFileSync(skillMdPath, 'utf-8')
  if (!hasYamlFrontmatter(content)) {
    error('Missing YAML frontmatter in SKILL.md')
  }
  const { name, description, body, rawFrontmatter } =
    extractFrontmatter(content)
  const dirName = basename(skillPath)

  validateNameFormat(name, dirName)
  validateDescription(description, rawFrontmatter)
  const bodyStats = validateBody(body)
  validateReferences(skillPath, body)
  if (description) {
    validateKeywords(description, body)
  }

  return { name, description, bodyStats }
}

if (!existsSync(targetPath)) {
  error(`Path does not exist: ${targetPath}`)
}

const result = existsSync(targetPath) ? validateSkillPath(targetPath) : null

const report = {
  path: targetPath,
  valid: errors.length === 0,
  errors,
  warnings,
  stats: result?.bodyStats ?? null,
}

if (outputJson) {
  console.log(JSON.stringify(report, null, 2))
  process.exit(report.valid && !(strict && warnings.length) ? 0 : 1)
}

if (errors.length > 0) {
  console.log('Errors:')
  errors.forEach((message) => console.log(`- ${message}`))
}
if (warnings.length > 0) {
  console.log('Warnings:')
  warnings.forEach((message) => console.log(`- ${message}`))
}
if (errors.length === 0) {
  console.log('Skill is valid.')
}

process.exit(report.valid && !(strict && warnings.length) ? 0 : 1)
