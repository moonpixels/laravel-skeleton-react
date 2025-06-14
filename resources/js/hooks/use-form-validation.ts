import { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

export function useFormValidation() {
  const { t } = useTranslation()

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

  function passwordConfirmationMessage(): z.CustomErrorParams {
    return {
      message: t('validation:confirmed', {
        attribute: t('common:password').toLowerCase(),
      }),
      path: ['password'],
    }
  }

  const customErrorMap: z.ZodErrorMap = (error, ctx) => {
    if (ctx.data === undefined) {
      return {
        message: t('validation:required', {
          attribute: pathToAttribute(error.path),
        }),
      }
    }

    switch (error.code) {
      case z.ZodIssueCode.invalid_type:
        switch (error.expected) {
          case 'boolean':
            return {
              message: t('validation:boolean', {
                attribute: pathToAttribute(error.path),
              }),
            }
        }
        break

      case z.ZodIssueCode.invalid_string:
        switch (error.validation) {
          case 'email':
            return {
              message: t('validation:email', {
                attribute: pathToAttribute(error.path),
              }),
            }
        }
        break

      case z.ZodIssueCode.too_small:
        switch (error.type) {
          case 'string':
            return {
              message: t('validation:min.string', {
                attribute: pathToAttribute(error.path),
                min: error.minimum.toString(),
              }),
            }
        }
    }

    return { message: ctx.defaultError }
  }

  function pathToAttribute(path: (string | number)[]): string {
    const attribute = path[0].toString()

    return attributeMap[attribute] ?? attribute.replace('_', ' ')
  }

  const attributeMap: Record<string, string> = {}

  z.setErrorMap(customErrorMap)

  return { passwordConfirmationMessage, setFormServerErrors }
}
