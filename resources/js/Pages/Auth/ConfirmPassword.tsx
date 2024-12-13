import { AuthForm } from '@/Components/AuthForm'
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
  password: z.string(),
})

export default function ConfirmPassword() {
  const { t } = useLaravelReactI18n()

  const { setFormServerErrors } = useFormValidation()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await new Promise<void>((resolve) =>
      router.post(route('password.confirm'), values, {
        onError: (errors) => {
          setFormServerErrors(form, errors)
        },
        onFinish: () => resolve(),
      })
    )
  }

  return (
    <GuestLayout>
      <Head title={t('auth.confirm_your_password')} />

      <AuthForm
        description={t('auth.confirm_your_password_description')}
        title={t('auth.confirm_your_password')}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

            <Button loading={form.formState.isSubmitting} className="w-full" type="submit">
              {t('general.confirm')}
            </Button>
          </form>
        </Form>
      </AuthForm>
    </GuestLayout>
  )
}
