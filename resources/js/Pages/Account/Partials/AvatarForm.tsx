import { Avatar, AvatarFallback, AvatarImage } from '@/Components/UI/Avatar'
import { Button } from '@/Components/UI/Button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/Components/UI/Form'
import { Skeleton } from '@/Components/UI/Skeleton'
import { useFormValidation } from '@/Hooks/useFormValidation'
import { useToast } from '@/Hooks/useToast'
import { useUser } from '@/Hooks/useUser'
import { initials } from '@/Utils/strings'
import { cn } from '@/Utils/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from '@inertiajs/react'
import { useLaravelReactI18n } from 'laravel-react-i18n'
import { ChangeEvent, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  avatar: z.union([z.instanceof(File), z.literal('')]),
})

export function AvatarForm() {
  const { t } = useLaravelReactI18n()

  const { user } = useUser()

  const { setFormServerErrors } = useFormValidation()

  const { toast } = useToast()

  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      avatar: new File([], ''),
    },
  })

  const inputRef = useRef<HTMLInputElement | null>(null)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await new Promise<void>((resolve) =>
      router.post(
        route('account.avatar.update'),
        { ...values, _method: 'put' },
        {
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
        }
      )
    )
  }

  async function handleRemoveAvatarClick() {
    await new Promise<void>((resolve) =>
      router.delete(route('account.avatar.destroy'), {
        preserveScroll: true,
        onStart: () => setIsRemovingAvatar(true),
        onSuccess: () => {
          toast({
            description: t('account.account_has_been_updated'),
            title: t('account.account_updated'),
            variant: 'successful',
          })
        },
        onFinish: () => {
          setIsRemovingAvatar(false)
          resolve()
        },
      })
    )
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files

    if (files?.length) {
      form.setValue('avatar', files[0], { shouldValidate: true })
      form.handleSubmit(onSubmit)()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('general.avatar')}</FormLabel>
              <FormDescription>{t('account.avatar_description')}</FormDescription>
              <FormControl>
                <div className="flex items-center space-x-4">
                  <div className="size-11 shrink-0">
                    {form.formState.isSubmitting || isRemovingAvatar ? (
                      <Skeleton className="size-11 rounded-md" />
                    ) : (
                      <Avatar size="md">
                        {user.avatar_url ? (
                          <>
                            <AvatarImage
                              alt={user.name}
                              src={user.avatar_url}
                              className={cn({
                                'opacity-50': form.formState.isSubmitting || isRemovingAvatar,
                              })}
                            />
                            <AvatarFallback delayMs={500}>{initials(user.name)}</AvatarFallback>
                          </>
                        ) : (
                          <span>{initials(user.name)}</span>
                        )}
                      </Avatar>
                    )}
                  </div>

                  <div>
                    <input
                      {...field}
                      value=""
                      accept="image/*"
                      className="hidden"
                      type="file"
                      ref={(e) => {
                        field.ref(e)
                        inputRef.current = e
                      }}
                      onChange={handleFileChange}
                    />

                    <div className="flex items-center space-x-2">
                      <Button
                        loading={form.formState.isSubmitting}
                        type="button"
                        variant="secondary"
                        onClick={() => inputRef.current?.click()}
                      >
                        {t('general.change')}
                      </Button>

                      <Button
                        disabled={!user.avatar_url}
                        loading={isRemovingAvatar}
                        type="button"
                        variant="destructive"
                        onClick={handleRemoveAvatarClick}
                      >
                        {t('general.remove')}
                      </Button>
                    </div>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
