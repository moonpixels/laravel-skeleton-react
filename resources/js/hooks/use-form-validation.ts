import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

export function useFormValidation() {
  const { t } = useTranslation()

  // Map of attribute names to their translations e.g. 'example_attribute' to 'Example Attribute'
  const attributeMap: Record<string, string> = {}

  const passwordConfirmationMessage: z.core.$ZodCustomParams = {
    message: t('validation:confirmed', {
      attribute: t('password').toLowerCase(),
    }),
    path: ['password'],
  }

  const customErrorMap: z.ZodErrorMap = (issue: z.core.$ZodRawIssue) => {
    const issueCode = issue.code
    const issuePath = issue.path ?? []

    if (issueCode === undefined) {
      return t('validation:required', {
        attribute: pathToAttribute(issuePath),
      })
    }

    switch (issueCode) {
      case 'invalid_type':
        switch (issue.expected) {
          case 'boolean':
            return t('validation:boolean', {
              attribute: pathToAttribute(issuePath),
            })
        }
        break

      case 'invalid_format':
        switch (issue.format) {
          case 'email':
            return t('validation:email', {
              attribute: pathToAttribute(issuePath),
            })
        }
        break

      case 'too_small':
        switch (issue.origin) {
          case 'string':
            return t('validation:min.string', {
              attribute: pathToAttribute(issuePath),
              min: issue.minimum.toString(),
            })
        }
    }
  }

  function pathToAttribute(path: PropertyKey[]): string {
    const attribute = path[0].toString()

    return attributeMap[attribute] ?? attribute.replace('_', ' ')
  }

  function setFormServerErrors<T extends FieldValues>(
    form: UseFormReturn<T>,
    errors: Record<string, string>
  ): void {
    Object.entries(errors).forEach(([key, message]) => {
      form.setError(key as Path<T>, {
        type: 'server',
        message: message,
      })
    })
  }

  z.config({
    customError: customErrorMap,
  })

  return { passwordConfirmationMessage, setFormServerErrors }
}
