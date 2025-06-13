import { AuthForm, AuthFormFooter } from '@/components/auth-form'
import { Text } from '@/components/text'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useFormValidation } from '@/hooks/use-form-validation'
import { GuestLayout } from '@/layouts/guest-layout'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from '@inertiajs/react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

const formSchema = z.object({
  code: z.string(),
  is_recovery: z.boolean(),
})

export default function TwoFactor() {
  const { t } = useTranslation()

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
    <GuestLayout title={t('two_factor_authentication')}>
      <AuthForm
        description={
          form.getValues('is_recovery')
            ? t('two_factor_recovery_code_description')
            : t('two_factor_code_description')
        }
        title={t('two_factor_authentication')}
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
                      ? t('recovery_code_label')
                      : t('2fa_code_label')}
                  </FormLabel>
                  <FormControl>
                    <Input autoComplete="one-time-code" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              loading={form.formState.isSubmitting}
              className="w-full"
              type="submit"
            >
              {form.getValues('is_recovery')
                ? t('recovery_code')
                : t('confirm_code')}
            </Button>
          </form>
        </Form>

        <AuthFormFooter>
          <Text as="p" size="sm" variant="muted">
            {t('having_trouble') + ' '}

            <Button variant="link" onClick={handleModeClick}>
              {form.getValues('is_recovery')
                ? t('use_code')
                : t('use_recovery_code')}
            </Button>
          </Text>
        </AuthFormFooter>
      </AuthForm>
    </GuestLayout>
  )
}
