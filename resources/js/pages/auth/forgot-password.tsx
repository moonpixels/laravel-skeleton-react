import { AuthForm, AuthFormFooter } from '@/components/auth-form'
import { Text } from '@/components/text'
import { TextLink } from '@/components/text-link'
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
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  email: z.string().email(),
})

export default function ForgotPassword({ status }: { status?: string }) {
  const { t } = useTranslation()

  const { setFormServerErrors } = useFormValidation()

  useEffect(() => {
    if (status === 'reset-link-sent') {
      toast.success(t('passwordResetEmailSent'), {
        description: t('passwordResetEmailSentDescription'),
      })
    }
  }, [status, t])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await new Promise<void>((resolve) =>
      router.post(route('password.email'), values, {
        onError: (errors) => {
          setFormServerErrors(form, errors)
        },
        onFinish: () => resolve(),
      })
    )
  }

  return (
    <GuestLayout title={t('forgotYourPassword')}>
      <AuthForm
        description={t('forgotYourPasswordDescription')}
        title={t('forgotYourPassword')}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email')}</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="username"
                      inputMode="email"
                      required
                      type="email"
                      {...field}
                    />
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
              {t('sendPasswordResetEmail')}
            </Button>
          </form>
        </Form>

        <AuthFormFooter>
          <Text size="sm" variant="muted">
            {t('rememberedPassword') + ' '}

            <TextLink href={route('login')}>{t('logIn')}</TextLink>
          </Text>
        </AuthFormFooter>
      </AuthForm>
    </GuestLayout>
  )
}
