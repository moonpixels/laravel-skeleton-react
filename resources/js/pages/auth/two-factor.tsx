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
import { useState } from 'react'
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

  const [isRecoveryMode, setIsRecoveryMode] = useState(
    form.getValues('is_recovery')
  )

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
    const isRecovery = !form.getValues('is_recovery')
    form.setValue('is_recovery', isRecovery)
    setIsRecoveryMode(isRecovery)
  }

  return (
    <GuestLayout title={t('twoFactorAuthentication')}>
      <AuthForm
        description={
          isRecoveryMode
            ? t('twoFactorRecoveryCodeDescription')
            : t('twoFactorCodeDescription')
        }
        title={t('twoFactorAuthentication')}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isRecoveryMode
                      ? t('recoveryCodeLabel')
                      : t('2faCodeLabel')}
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
              {t('confirmCode')}
            </Button>
          </form>
        </Form>

        <AuthFormFooter>
          <Text size="sm" variant="muted">
            {t('havingTrouble') + ' '}

            <Button variant="link" onClick={handleModeClick}>
              {isRecoveryMode ? t('useCode') : t('useRecoveryCode')}
            </Button>
          </Text>
        </AuthFormFooter>
      </AuthForm>
    </GuestLayout>
  )
}
