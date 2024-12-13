import { AuthForm, AuthFormFooter } from '@/Components/AuthForm'
import { Text } from '@/Components/Text'
import { Button } from '@/Components/UI/Button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/Components/UI/Form'
import { Input } from '@/Components/UI/Input'
import { useFormValidation } from '@/Hooks/useFormValidation'
import { GuestLayout } from '@/Layouts/GuestLayout'
import { zodResolver } from '@hookform/resolvers/zod'
import { Head, router } from '@inertiajs/react'
import { useLaravelReactI18n } from 'laravel-react-i18n'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  code: z.string(),
  is_recovery: z.boolean(),
})

export default function TwoFactor() {
  const { t } = useLaravelReactI18n()

  const { setFormServerErrors } = useFormValidation()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      is_recovery: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await new Promise<void>((resolve) =>
      router.post(route('two-factor.login'), values, {
        onError: (errors) => {
          setFormServerErrors(form, errors)
        },
        onFinish: () => resolve(),
      })
    )
  }

  function handleModeClick() {
    form.setValue('is_recovery', !form.getValues('is_recovery'))
  }

  return (
    <GuestLayout>
      <Head title={t('auth.two_factor_authentication')} />

      <AuthForm
        description={
          form.getValues('is_recovery')
            ? t('auth.two_factor_recovery_code_description')
            : t('auth.two_factor_code_description')
        }
        title={t('auth.two_factor_authentication')}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {form.getValues('is_recovery')
                      ? t('auth.recovery_code_label')
                      : t('auth.2fa_code_label')}
                  </FormLabel>
                  <FormControl>
                    <Input autoComplete="one-time-code" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button loading={form.formState.isSubmitting} className="w-full" type="submit">
              {form.getValues('is_recovery') ? t('auth.recovery_code') : t('auth.confirm_code')}
            </Button>
          </form>
        </Form>

        <AuthFormFooter>
          <Text as="p" size="sm" variant="muted">
            {t('auth.having_trouble') + ' '}

            <Button variant="link" onClick={handleModeClick}>
              {form.getValues('is_recovery') ? t('auth.use_code') : t('auth.use_recovery_code')}
            </Button>
          </Text>
        </AuthFormFooter>
      </AuthForm>
    </GuestLayout>
  )
}
