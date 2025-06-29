import { SettingsGrid } from '@/components/settings-grid'
import { Text } from '@/components/text'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useUser } from '@/contexts/user-context'
import { useCopy } from '@/hooks/use-copy'
import { useFormValidation } from '@/hooks/use-form-validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from '@inertiajs/react'
import { AxiosResponse } from 'axios'
import { ClipboardCheckIcon, ClipboardIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { z } from 'zod'

const disableFormSchema = z.object({
  code: z.string(),
})

export function TwoFactorDisableDialog() {
  const { t } = useTranslation()

  const { setFormServerErrors } = useFormValidation()

  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(disableFormSchema),
    defaultValues: {
      code: '',
    },
  })

  async function onSubmit(values: z.infer<typeof disableFormSchema>) {
    await new Promise<void>((resolve) =>
      router.delete(route('two-factor.disable'), {
        preserveScroll: true,
        data: values,
        onError: (errors) => {
          setFormServerErrors(form, errors)
        },
        onSuccess: () => {
          form.reset()

          toast.success(t('twoFactorDisabled'), {
            description: t('twoFactorDisabledDescription'),
          })
        },
        onFinish: () => {
          resolve()
        },
      })
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t('disableTwoFactor')}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('disableTwoFactor')}</DialogTitle>
          <DialogDescription>{t('disableTwoFactorWarning')}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-6"
            id="disable-two-factor-form"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('2faCodeLabel')}</FormLabel>
                  <FormControl>
                    <Input autoComplete="one-time-code" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              {t('cancel')}
            </Button>
          </DialogClose>

          <Button
            loading={form.formState.isSubmitting}
            type="submit"
            form="disable-two-factor-form"
            variant="destructive"
          >
            {t('disable')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const enableFormSchema = z.object({
  code: z.string(),
})

interface TwoFactorSettings {
  qrCode: { __html: string }
  secret: string
}

export function TwoFactorEnableDialog({ onEnable }: { onEnable?: () => void }) {
  const { t } = useTranslation()

  const { setFormServerErrors } = useFormValidation()

  const [open, setOpen] = useState(false)

  const [twoFactorSettings, setTwoFactorSettings] =
    useState<TwoFactorSettings | null>(null)

  const form = useForm({
    resolver: zodResolver(enableFormSchema),
    defaultValues: {
      code: '',
    },
  })

  async function handleOpenChange(open: boolean) {
    setOpen(open)

    if (open) {
      await fetchTwoFactorSettings()
    } else {
      setTwoFactorSettings(null)
      form.reset()
    }
  }

  async function onSubmit(values: z.infer<typeof enableFormSchema>) {
    await new Promise<void>((resolve) =>
      router.post(route('two-factor.confirm'), values, {
        preserveScroll: true,
        onError: (errors) => {
          setFormServerErrors(form, errors)
        },
        onSuccess: () => {
          form.reset()

          toast.success(t('twoFactorEnabled'), {
            description: t('twoFactorEnabledDescription'),
          })

          if (onEnable) {
            onEnable()
          }
        },
        onFinish: () => {
          resolve()
        },
      })
    )
  }

  async function fetchTwoFactorSettings() {
    try {
      const response: AxiosResponse<{
        qrCode: string
        secret: string
      }> = await axios.post(route('two-factor.enable'))

      setTwoFactorSettings({
        qrCode: { __html: response.data.qrCode },
        secret: response.data.secret,
      })
    } catch {
      setOpen(false)

      toast.error(t('genericError'), {
        description: t('genericErrorDescription'),
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>{t('enableTwoFactor')}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('enableTwoFactor')}</DialogTitle>
          <DialogDescription>
            {t('enableTwoFactorDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-2">
          {!twoFactorSettings && (
            <>
              <Skeleton className="size-32" />
              <Skeleton className="h-4 w-32" />
            </>
          )}

          {twoFactorSettings && (
            <>
              <div
                className="dark:[&_path[fill='#09090b']]:fill-foreground dark:[&_rect[fill='#ffffff']]:fill-background flex items-center justify-center"
                dangerouslySetInnerHTML={twoFactorSettings.qrCode}
              />

              <Text className="font-mono" size="xs">
                {twoFactorSettings.secret}
              </Text>
            </>
          )}
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-6"
            id="confirm-two-factor-form"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('2faCodeLabel')}</FormLabel>
                  <FormControl>
                    <Input autoComplete="one-time-code" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              {t('cancel')}
            </Button>
          </DialogClose>

          <Button
            loading={form.formState.isSubmitting}
            type="submit"
            form="confirm-two-factor-form"
          >
            {t('enable')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function TwoFactorRecoveryCodesDialog({
  recentlyEnabled,
}: {
  recentlyEnabled?: boolean
}) {
  const { t } = useTranslation()

  const { copyText, copied } = useCopy()

  const [open, setOpen] = useState(false)

  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null)

  const CopyButtonIcon = copied ? ClipboardCheckIcon : ClipboardIcon

  if (recentlyEnabled && !open) {
    handleOpenChange(true)
  }

  async function handleOpenChange(open: boolean) {
    setOpen(open)

    if (open) {
      await fetchRecoveryCodes()
    } else {
      setRecoveryCodes(null)
    }
  }

  function handleCopyClick() {
    if (recoveryCodes) {
      copyText(recoveryCodes.join('\n'))
    }
  }

  async function fetchRecoveryCodes() {
    try {
      const response: AxiosResponse<{
        recoveryCodes: string[]
      }> = await axios.get(route('two-factor.recovery-codes'))

      setRecoveryCodes(response.data.recoveryCodes)
    } catch {
      setOpen(false)

      toast.error(t('genericError'), {
        description: t('genericErrorDescription'),
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">{t('viewRecoveryCodes')}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('recoveryCodes')}</DialogTitle>
          <DialogDescription>{t('recoveryCodesDescription')}</DialogDescription>
        </DialogHeader>

        <ul className="mx-auto grid list-none grid-cols-2 gap-x-6">
          {!recoveryCodes &&
            Array.from({ length: 8 }).map((_, index) => (
              <li key={index} className="py-1">
                <Skeleton className="h-3 w-[72px]" />
              </li>
            ))}

          {recoveryCodes?.map((code) => (
            <li key={code} className="text-foreground font-mono text-xs/5">
              {code}
            </li>
          ))}
        </ul>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              {t('close')}
            </Button>
          </DialogClose>

          <Button onClick={handleCopyClick}>
            <span className="flex items-center gap-1">
              <CopyButtonIcon className="size-4" />

              {copied ? t('copied') : t('copy')}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function TwoFactorForm() {
  const { t } = useTranslation()

  const { twoFactorEnabled } = useUser()

  const [recentlyEnabled, setRecentlyEnabled] = useState(false)

  const timeoutRef = useRef<number | null>(null)

  function handleEnable() {
    setRecentlyEnabled(true)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      setRecentlyEnabled(false)
    })
  }

  return (
    <SettingsGrid
      description={t('twoFactorAuthenticationDescription')}
      title={t('twoFactorAuthentication')}
    >
      <div className="flex h-full items-center">
        {twoFactorEnabled ? (
          <div className="flex flex-wrap gap-2">
            <TwoFactorRecoveryCodesDialog recentlyEnabled={recentlyEnabled} />
            <TwoFactorDisableDialog />
          </div>
        ) : (
          <TwoFactorEnableDialog onEnable={handleEnable} />
        )}
      </div>
    </SettingsGrid>
  )
}
