import { SettingsGrid } from '@/Components/SettingsGrid'
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
import { useToast } from '@/Hooks/useToast'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from '@inertiajs/react'
import { useLaravelReactI18n } from 'laravel-react-i18n'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  current_password: z.string(),
  password: z.string().min(8),
  password_confirmation: z.string().min(8),
})

export function PasswordForm() {
  const { t } = useLaravelReactI18n()

  const { toast } = useToast()

  const { setFormServerErrors, passwordConfirmationMessage } = useFormValidation()

  formSchema.refine(
    (data) => data.password === data.password_confirmation,
    () => passwordConfirmationMessage()
  )

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      current_password: '',
      password: '',
      password_confirmation: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await new Promise<void>((resolve) =>
      router.put(route('account.password.update'), values, {
        preserveScroll: true,
        onError: (errors) => {
          setFormServerErrors(form, errors)
        },
        onSuccess: () => {
          form.reset()

          toast({
            description: t('account.account_has_been_updated'),
            title: t('account.account_updated'),
            variant: 'successful',
          })
        },
        onFinish: () => resolve(),
      })
    )
  }

  return (
    <SettingsGrid
      description={t('account.change_password_description')}
      title={t('account.change_password')}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <FormField
            control={form.control}
            name="current_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('account.current_password')}</FormLabel>
                <FormControl>
                  <Input autoComplete="current-password" required type="password" {...field} />
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
                <FormLabel>{t('account.new_password')}</FormLabel>
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
                <FormLabel>{t('account.confirm_new_password')}</FormLabel>
                <FormControl>
                  <Input autoComplete="new-password" required type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button loading={form.formState.isSubmitting} type="submit">
            {t('account.update_password')}
          </Button>
        </form>
      </Form>
    </SettingsGrid>
  )
}
