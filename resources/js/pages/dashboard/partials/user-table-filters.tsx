import { DataTableFilterOption } from '@/components/data-table/data-table-filters'

export const filterOptions: DataTableFilterOption[] = [
  {
    id: 'name',
    label: 'name',
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
    label: 'email',
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
    label: 'language',
    type: 'select',
    options: [{ value: 'en_GB', label: 'english' }],
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
    label: 'verified',
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
    label: 'createdAt',
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
