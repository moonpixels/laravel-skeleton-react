import { DataTableFilterOption } from '@/components/data-table/data-table-filters'

export const filterOptions: DataTableFilterOption[] = [
  {
    id: 'name',
    labelTransKey: 'name',
    type: 'text',
    clause: [
      {
        type: 'equal',
        filterKey: 'name',
        valuePrefix: '=',
      },
      {
        type: 'notEqual',
        filterKey: 'name',
        valuePrefix: '<>',
      },
      {
        type: 'contains',
        filterKey: '_name',
      },
    ],
  },
  {
    id: 'email',
    labelTransKey: 'email',
    type: 'text',
    clause: [
      {
        type: 'equal',
        filterKey: 'email',
        valuePrefix: '=',
      },
      {
        type: 'notEqual',
        filterKey: 'email',
        valuePrefix: '<>',
      },
      {
        type: 'contains',
        filterKey: '_email',
      },
    ],
  },
  {
    id: 'language',
    labelTransKey: 'language',
    type: 'multiselect',
    options: [
      { value: 'en_GB', labelTransKey: 'english' },
      { value: 'fr_FR', labelTransKey: 'french' },
      { value: 'de_DE', labelTransKey: 'german' },
      { value: 'es_ES', labelTransKey: 'spanish' },
      { value: 'it_IT', labelTransKey: 'italian' },
      { value: 'ja_JP', labelTransKey: 'japanese' },
      { value: 'ko_KR', labelTransKey: 'korean' },
      { value: 'pt_BR', labelTransKey: 'brazilianPortuguese' },
      { value: 'ru_RU', labelTransKey: 'russian' },
      { value: 'zh_CN', labelTransKey: 'chineseSimplified' },
      { value: 'zh_TW', labelTransKey: 'chineseTraditional' },
    ],
    clause: [
      {
        type: 'equal',
        filterKey: 'language',
        valuePrefix: '=',
      },
      {
        type: 'notEqual',
        filterKey: 'language',
        valuePrefix: '<>',
      },
    ],
  },
  {
    id: 'verified',
    labelTransKey: 'verified',
    type: 'boolean',
    clause: [
      {
        type: 'equal',
        filterKey: 'verified',
      },
    ],
  },
  {
    id: 'createdAt',
    labelTransKey: 'createdAt',
    type: 'datetime',
    clause: [
      {
        type: 'equal',
        filterKey: 'created_at',
        valuePrefix: '=',
      },
      {
        type: 'notEqual',
        filterKey: 'created_at',
        valuePrefix: '<>',
      },
      {
        type: 'greaterThan',
        filterKey: 'created_at',
        valuePrefix: '>',
      },
      {
        type: 'lessThan',
        filterKey: 'created_at',
        valuePrefix: '<',
      },
      {
        type: 'between',
        filterKey: 'created_at',
      },
    ],
  },
]
