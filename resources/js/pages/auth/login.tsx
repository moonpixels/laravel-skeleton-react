import { AuthForm, AuthFormFooter } from '@/components/auth-form'
import { Text } from '@/components/text'
import { TextLink } from '@/components/text-link'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
  password: z.string(),
  remember: z.boolean(),
})

export default function Login({ status }: { status?: string }) {
  const { t } = useTranslation()

  const { setFormServerErrors } = useFormValidation()

  useEffect(() => {
    if (status === 'password-updated') {
      toast.success(t('password_updated'), {
        description: t('password_updated_description'),
      })
    }
  }, [status, t])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await new Promise<void>((resolve) =>
      router.post(route('login'), values, {
        onError: (errors) => {
          setFormServerErrors(form, errors)
          form.setValue('password', '')
        },
        onFinish: () => resolve(),
      })
    )
  }

  return (
    <GuestLayout title={t('login_to_account')}>
      <AuthForm
        description={t('login_to_account_description')}
        title={t('login_to_account')}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common:email')}</FormLabel>
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common:password')}</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="current-password"
                      required
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between gap-3">
              <FormField
                control={form.control}
                name="remember"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>{t('remember_label')}</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Text asChild size="sm">
                <TextLink href={route('password.request')}>
                  {t('forgot_password')}
                </TextLink>
              </Text>
            </div>

            <Button
              loading={form.formState.isSubmitting}
              className="w-full"
              type="submit"
            >
              {t('log_in')}
            </Button>
          </form>
        </Form>

        <AuthFormFooter>
          <Text as="p" size="sm" variant="muted">
            {t('no_account') + ' '}

            <TextLink href={route('register')}>{t('create_account')}</TextLink>
          </Text>
        </AuthFormFooter>
      </AuthForm>
    </GuestLayout>
  )
}
