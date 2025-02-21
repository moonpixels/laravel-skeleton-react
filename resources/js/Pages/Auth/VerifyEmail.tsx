import { AuthForm, AuthFormFooter } from '@/Components/AuthForm'
import { Text } from '@/Components/Text'
import { Button } from '@/Components/UI/Button'
import { useUser } from '@/Contexts/UserContext'
import { GuestLayout } from '@/Layouts/GuestLayout'
import { Head, router } from '@inertiajs/react'
import { useLaravelReactI18n } from 'laravel-react-i18n'
import { toast } from 'sonner'

export default function VerifyEmail() {
  const { t } = useLaravelReactI18n()

  const { user } = useUser()

  function showEmailVerificationSentToast() {
    toast.success(t('auth.email_verification_email_sent'), {
      description: t('auth.email_verification_email_sent_description'),
    })
  }

  function handleResendEmailClick() {
    router.post(route('verification.send'), undefined, {
      onSuccess: () => {
        showEmailVerificationSentToast()
      },
    })
  }

  function handleLogoutClick() {
    router.post(route('logout'))
  }

  return (
    <GuestLayout>
      <Head title={t('auth.verify_email')} />

      <AuthForm description={t('auth.verify_email_description')} title={t('auth.verify_email')}>
        <div className="flex flex-col items-center gap-4 sm:flex-row-reverse">
          <Button className="w-full" onClick={handleResendEmailClick}>
            {t('auth.resend_email')}
          </Button>

          <Button className="w-full" variant="secondary" onClick={handleLogoutClick}>
            {t('auth.log_out')}
          </Button>
        </div>

        <AuthFormFooter>
          <Text as="p" size="sm" variant="muted">
            {t('auth.email_delivered_to', { email: user.email })}
          </Text>
        </AuthFormFooter>
      </AuthForm>
    </GuestLayout>
  )
}
