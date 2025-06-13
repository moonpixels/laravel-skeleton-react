import { AuthForm, AuthFormFooter } from '@/components/auth-form'
import { Text } from '@/components/text'
import { Button } from '@/components/ui/button'
import { useUser } from '@/contexts/user-context'
import { GuestLayout } from '@/layouts/guest-layout'
import { router } from '@inertiajs/react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function VerifyEmail() {
  const { t } = useTranslation()

  const { user } = useUser()

  function showEmailVerificationSentToast() {
    toast.success(t('email_verification_email_sent'), {
      description: t('email_verification_email_sent_description'),
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
    <GuestLayout title={t('verify_email')}>
      <AuthForm
        description={t('verify_email_description')}
        title={t('verify_email')}
      >
        <div className="flex flex-col items-center gap-4 sm:flex-row-reverse">
          <Button className="w-full" onClick={handleResendEmailClick}>
            {t('resend_email')}
          </Button>

          <Button
            className="w-full"
            variant="secondary"
            onClick={handleLogoutClick}
          >
            {t('log_out')}
          </Button>
        </div>

        <AuthFormFooter>
          <Text as="p" size="sm" variant="muted">
            {t('email_delivered_to', { email: user.email })}
          </Text>
        </AuthFormFooter>
      </AuthForm>
    </GuestLayout>
  )
}
