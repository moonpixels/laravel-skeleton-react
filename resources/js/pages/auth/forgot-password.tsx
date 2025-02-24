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
import { Head, router } from '@inertiajs/react'
import { useLaravelReactI18n } from 'laravel-react-i18n'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  email: z.string().email(),
})

export default function ForgotPassword({ status }: { status?: string }) {
  const { t } = useLaravelReactI18n()

  const { setFormServerErrors } = useFormValidation()

  useEffect(() => {
    if (status === 'reset-link-sent') {
      toast.success(t('auth.password_reset_email_sent'), {
        description: t('auth.password_reset_email_sent_description'),
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
    <GuestLayout>
      <Head title={t('auth.forgot_your_password')} />

      <AuthForm
        description={t('auth.forgot_your_password_description')}
        title={t('auth.forgot_your_password')}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('general.email')}</FormLabel>
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

            <Button loading={form.formState.isSubmitting} className="w-full" type="submit">
              {t('auth.send_password_reset_email')}
            </Button>
          </form>
        </Form>

        <AuthFormFooter>
          <Text as="p" size="sm" variant="muted">
            {t('auth.remembered_password') + ' '}

            <TextLink href={route('login')}>{t('auth.log_in')}</TextLink>
          </Text>
        </AuthFormFooter>
      </AuthForm>
    </GuestLayout>
  )
}
