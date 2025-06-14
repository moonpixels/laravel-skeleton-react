import { SettingsGrid } from '@/components/settings-grid'
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
import { useUser } from '@/contexts/user-context'
import { useFormValidation } from '@/hooks/use-form-validation'
import { AvatarForm } from '@/pages/account/partials/avatar-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from '@inertiajs/react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
})

export function BasicInformationForm() {
  const { t } = useTranslation()

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
          toast.success(t('accountUpdated'), {
            description: t('accountHasBeenUpdated'),
          })
        },
        onFinish: () => resolve(),
      })
    )
  }

  return (
    <SettingsGrid
      description={t('basicInformationDescription')}
      title={t('basicInformation')}
    >
      <AvatarForm />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('common:name')}</FormLabel>
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

          <Button loading={form.formState.isSubmitting} type="submit">
            {t('common:submit')}
          </Button>
        </form>
      </Form>
    </SettingsGrid>
  )
}
