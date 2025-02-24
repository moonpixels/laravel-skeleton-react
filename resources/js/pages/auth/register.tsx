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
import { getBrowserLocale } from '@/contexts/locale-context'
import { useFormValidation } from '@/hooks/use-form-validation'
import { GuestLayout } from '@/layouts/guest-layout'
import { zodResolver } from '@hookform/resolvers/zod'
import { Head, router } from '@inertiajs/react'
import { useLaravelReactI18n } from 'laravel-react-i18n'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  password_confirmation: z.string().min(8),
})

export default function Register() {
  const { t } = useLaravelReactI18n()

  const { setFormServerErrors, passwordConfirmationMessage } = useFormValidation()

  formSchema.refine(
    (data) => data.password === data.password_confirmation,
    () => passwordConfirmationMessage()
  )

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await new Promise<void>((resolve) =>
      router.post(
        route('register'),
        {
          ...values,
          language: getBrowserLocale(),
        },
        {
          onError: (errors) => {
            setFormServerErrors(form, errors)
          },
          onFinish: () => resolve(),
        }
      )
    )
  }

  return (
    <GuestLayout>
      <Head title={t('auth.register_new_account')} />

      <AuthForm
        description={t('auth.register_new_account_description')}
        title={t('auth.register_new_account')}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('general.name')}</FormLabel>
                  <FormControl>
                    <Input autoComplete="name" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    <Input autoComplete="new-password" required type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('general.confirm_password')}</FormLabel>
                  <FormControl>
                    <Input autoComplete="new-password" required type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button loading={form.formState.isSubmitting} className="w-full" type="submit">
              {t('auth.register')}
            </Button>
          </form>
        </Form>

        <AuthFormFooter>
          <Text as="p" size="sm" variant="muted">
            {t('auth.already_have_account') + ' '}

            <TextLink href={route('login')}>{t('auth.log_in')}</TextLink>
          </Text>
        </AuthFormFooter>
      </AuthForm>
    </GuestLayout>
  )
}
