import * as z from 'zod'
import { trans } from 'laravel-vue-i18n'

export function passwordConfirmationMessage(): z.CustomErrorParams {
  return {
    message: trans('validation.confirmed', {
      attribute: trans('general.password').toLowerCase(),
    }),
    path: ['password'],
  }
}

export const customErrorMap: z.ZodErrorMap = (error, ctx) => {
  if (ctx.data === undefined) {
    return {
      message: trans('validation.required', {
        attribute: pathToAttribute(error.path),
      }),
    }
  }

  switch (error.code) {
    case z.ZodIssueCode.invalid_type:
      switch (error.expected) {
        case 'boolean':
          return {
            message: trans('validation.boolean', {
              attribute: pathToAttribute(error.path),
            }),
          }
      }
      break

    case z.ZodIssueCode.invalid_string:
      switch (error.validation) {
        case 'email':
          return {
            message: trans('validation.email', {
              attribute: pathToAttribute(error.path),
            }),
          }
      }
      break

    case z.ZodIssueCode.too_small:
      switch (error.type) {
        case 'string':
          return {
            message: trans('validation.min.string', {
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
