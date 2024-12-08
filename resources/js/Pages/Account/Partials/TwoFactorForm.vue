<script lang="ts" setup>
import { nextTick, useTemplateRef, watch } from 'vue'
import SettingsGrid from '@/Components/SettingsGrid.vue'
import TwoFactorDialogDisable from '@/Pages/Account/Partials/TwoFactorDialogDisable.vue'
import TwoFactorDialogEnable from '@/Pages/Account/Partials/TwoFactorDialogEnable.vue'
import TwoFactorDialogRecoveryCodes from '@/Pages/Account/Partials/TwoFactorDialogRecoveryCodes.vue'
import { useUser } from '@/Composables/useUser'

const { twoFactorEnabled } = useUser()

type RecoveryCodesModal = InstanceType<typeof TwoFactorDialogRecoveryCodes>

const recoveryCodesModal =
  useTemplateRef<RecoveryCodesModal>('recoveryCodesModal')

watch(twoFactorEnabled, async (enabled, previous) => {
  if (enabled && !previous) {
    await nextTick()
    showTwoFactorRecoveryCodes()
  }
})

function showTwoFactorRecoveryCodes() {
  if (!recoveryCodesModal.value) return

  recoveryCodesModal.value.open = true
}
</script>

<template>
  <SettingsGrid
    :description="$t('account.two_factor_authentication_description')"
    :title="$t('account.two_factor_authentication')"
  >
    <div class="flex h-full items-center">
      <div v-if="twoFactorEnabled" class="flex flex-wrap gap-2">
        <TwoFactorDialogRecoveryCodes ref="recoveryCodesModal" />
        <TwoFactorDialogDisable />
      </div>

      <TwoFactorDialogEnable v-else />
    </div>
  </SettingsGrid>
</template>
