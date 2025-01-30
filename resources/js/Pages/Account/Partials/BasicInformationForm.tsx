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
import { useUser } from '@/Contexts/UserContext'
import { useFormValidation } from '@/Hooks/useFormValidation'
import { useToast } from '@/Hooks/useToast'
import { AvatarForm } from '@/Pages/Account/Partials/AvatarForm'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from '@inertiajs/react'
import { useLaravelReactI18n } from 'laravel-react-i18n'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
})

export function BasicInformationForm() {
  const { t } = useLaravelReactI18n()

  const { toast } = useToast()

  const { setFormServerErrors } = useFormValidation()

  const { user } = useUser()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await new Promise<void>((resolve) =>
      router.put(route('account.update'), values, {
        preserveScroll: true,
        onError: (errors) => {
          setFormServerErrors(form, errors)
        },
        onSuccess: () => {
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
      description={t('account.basic_information_description')}
      title={t('account.basic_information')}
    >
      <AvatarForm />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
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

          <Button loading={form.formState.isSubmitting} type="submit">
            {t('general.submit')}
          </Button>
        </form>
      </Form>
    </SettingsGrid>
  )
}
