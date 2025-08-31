import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/components/ui/multiselect'

const languages = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  java: 'Java',
  csharp: 'C#',
  php: 'PHP',
  cpp: 'C++',
  rust: 'Rust',
  go: 'Go',
  swift: 'Swift',
}

type Language = keyof typeof languages

const values = Object.keys(languages) as Language[]

function renderValue(value: Language[]) {
  if (value.length === 0) {
    return <span className="text-muted-foreground">Select languages</span>
  }

  const firstLanguage = languages[value[0]]
  const additionalLanguages =
    value.length > 1 ? ` (+${value.length - 1} more)` : ''
  return firstLanguage + additionalLanguages
}

export default function MultiSelectExample() {
  return (
    <MultiSelect multiple defaultValue={['javascript', 'typescript']}>
      <MultiSelectTrigger>
        <MultiSelectValue>{renderValue}</MultiSelectValue>
      </MultiSelectTrigger>
      <MultiSelectContent>
        {values.map((value) => (
          <MultiSelectItem key={value} value={value}>
            {languages[value]}
          </MultiSelectItem>
        ))}
      </MultiSelectContent>
    </MultiSelect>
  )
}
