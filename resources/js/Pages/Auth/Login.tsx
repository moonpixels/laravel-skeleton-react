import { AuthForm, AuthFormFooter } from '@/Components/AuthForm'
import { Text } from '@/Components/Text'
import { TextLink } from '@/Components/TextLink'
import { Button } from '@/Components/UI/Button'
import { Checkbox } from '@/Components/UI/Checkbox'
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
import { useToast } from '@/Hooks/useToast'
import { GuestLayout } from '@/Layouts/GuestLayout'
import { zodResolver } from '@hookform/resolvers/zod'
import { Head, router } from '@inertiajs/react'
import { useLaravelReactI18n } from 'laravel-react-i18n'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  remember: z.boolean(),
})

export default function Login({ status }: { status?: string }) {
  const { t } = useLaravelReactI18n()

  const { toast } = useToast()

  const { setFormServerErrors } = useFormValidation()

  useEffect(() => {
    if (status === 'password-updated') {
      toast({
        description: t('auth.password_updated_description'),
        title: t('auth.password_updated'),
        variant: 'successful',
      })
    }
  }, [status])

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
    <GuestLayout>
      <Head title={t('auth.login_to_account')} />

      <AuthForm
        description={t('auth.login_to_account_description')}
        title={t('auth.login_to_account')}
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('general.password')}</FormLabel>
                  <FormControl>
                    <Input autoComplete="current-password" required type="password" {...field} />
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
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel>{t('auth.remember_label')}</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Text asChild size="sm">
                <TextLink href={route('password.request')}>{t('auth.forgot_password')}</TextLink>
              </Text>
            </div>

            <Button loading={form.formState.isSubmitting} className="w-full" type="submit">
              {t('auth.log_in')}
            </Button>
          </form>
        </Form>

        <AuthFormFooter>
          <Text as="p" size="sm" variant="muted">
            {t('auth.no_account') + ' '}

            <TextLink href={route('register')}>{t('auth.create_account')}</TextLink>
          </Text>
        </AuthFormFooter>
      </AuthForm>
    </GuestLayout>
  )
}
