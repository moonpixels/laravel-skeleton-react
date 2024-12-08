<script lang="ts" setup>
import { watch } from 'vue'
import GuestLayout from '@/Layouts/GuestLayout.vue'
import { Head, router } from '@inertiajs/vue3'
import { useUser } from '@/Composables/useUser'
import AuthForm from '@/Components/AuthForm.vue'
import { Button } from '@/Components/ui/button'
import { Text } from '@/Components/ui/text'
import { useToast } from '@/Components/ui/toast'
import { trans } from 'laravel-vue-i18n'

const props = defineProps<{
  status?: string
}>()

const { user } = useUser()

watch(props, () => {
  if (props.status === 'verification-link-sent') {
    useToast().toast({
      description: trans('auth.email_verification_email_sent_description'),
      title: trans('auth.email_verification_email_sent'),
      variant: 'successful',
    })
  }
})

function resendEmail() {
  router.post(route('verification.send'))
}

function logout() {
  router.post(route('logout'))
}
</script>

<template>
  <GuestLayout>
    <Head :title="$t('auth.verify_email')" />

    <AuthForm
      :description="$t('auth.verify_email_description')"
      :title="$t('auth.verify_email')"
    >
      <template #default>
        <div class="flex flex-col items-center gap-4 sm:flex-row-reverse">
          <Button class="w-full" @click="resendEmail">
            {{ $t('auth.resend_email') }}
          </Button>

          <Button class="w-full" variant="secondary" @click="logout">
            {{ $t('auth.log_out') }}
          </Button>
        </div>
      </template>

      <template #footer>
        <Text as="p" size="xs" variant="muted">
          {{ $t('auth.email_delivered_to', { email: user.email }) }}
        </Text>
      </template>
    </AuthForm>
  </GuestLayout>
</template>
