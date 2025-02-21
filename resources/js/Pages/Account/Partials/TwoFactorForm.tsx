import { SettingsGrid } from '@/Components/SettingsGrid'
import { Text } from '@/Components/Text'
import { Button } from '@/Components/UI/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/Components/UI/Dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/Components/UI/Form'
import { Input } from '@/Components/UI/Input'
import { Skeleton } from '@/Components/UI/Skeleton'
import { useUser } from '@/Contexts/UserContext'
import { useCopy } from '@/Hooks/useCopy'
import { useFormValidation } from '@/Hooks/useFormValidation'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from '@inertiajs/react'
import { AxiosResponse } from 'axios'
import { useLaravelReactI18n } from 'laravel-react-i18n'
import { ClipboardCheckIcon, ClipboardIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const disableFormSchema = z.object({
  code: z.string(),
})

export function TwoFactorDisableDialog() {
  const { t } = useLaravelReactI18n()

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

          toast.success(t('account.two_factor_disabled'), {
            description: t('account.two_factor_disabled_description'),
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
        <Button>{t('account.disable_two_factor')}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('account.disable_two_factor')}</DialogTitle>
          <DialogDescription>{t('account.disable_two_factor_warning')}</DialogDescription>
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
                  <FormLabel>{t('auth.2fa_code_label')}</FormLabel>
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
              {t('general.cancel')}
            </Button>
          </DialogClose>

          <Button
            loading={form.formState.isSubmitting}
            type="submit"
            form="disable-two-factor-form"
            variant="destructive"
          >
            {t('general.disable')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const enableFormSchema = z.object({
  code: z.string(),
})

type TwoFactorSettings = {
  qrCode: { __html: string }
  secret: string
}

export function TwoFactorEnableDialog({ onEnable }: { onEnable?: () => void }) {
  const { t } = useLaravelReactI18n()

  const { setFormServerErrors } = useFormValidation()

  const [open, setOpen] = useState(false)

  const [twoFactorSettings, setTwoFactorSettings] = useState<TwoFactorSettings | null>(null)

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

          toast.success(t('account.two_factor_enabled'), {
            description: t('account.two_factor_enabled_description'),
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

      toast.error(t('errors.generic'), {
        description: t('errors.generic_description'),
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>{t('account.enable_two_factor')}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('account.enable_two_factor')}</DialogTitle>
          <DialogDescription>{t('account.enable_two_factor_description')}</DialogDescription>
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
                  <FormLabel>{t('auth.2fa_code_label')}</FormLabel>
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
              {t('general.cancel')}
            </Button>
          </DialogClose>

          <Button
            loading={form.formState.isSubmitting}
            type="submit"
            form="confirm-two-factor-form"
          >
            {t('general.enable')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function TwoFactorRecoveryCodesDialog({ recentlyEnabled }: { recentlyEnabled?: boolean }) {
  const { t } = useLaravelReactI18n()

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

      toast.error(t('errors.generic'), {
        description: t('errors.generic_description'),
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">{t('account.view_recovery_codes')}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('account.recovery_codes')}</DialogTitle>
          <DialogDescription>{t('account.recovery_codes_description')}</DialogDescription>
        </DialogHeader>

        <ul className="mx-auto grid list-none grid-cols-2 gap-x-6">
          {!recoveryCodes &&
            Array.from({ length: 8 }).map((_, index) => (
              <li key={index} className="py-1">
                <Skeleton className="h-3 w-[72px]" />
              </li>
            ))}

          {recoveryCodes &&
            recoveryCodes.map((code) => (
              <li key={code} className="text-foreground font-mono text-xs/5">
                {code}
              </li>
            ))}
        </ul>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              {t('general.close')}
            </Button>
          </DialogClose>

          <Button onClick={handleCopyClick}>
            <span className="flex items-center gap-1">
              <CopyButtonIcon className="size-4" />

              {copied ? t('general.copied') : t('general.copy')}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function TwoFactorForm() {
  const { t } = useLaravelReactI18n()

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
      description={t('account.two_factor_authentication_description')}
      title={t('account.two_factor_authentication')}
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
