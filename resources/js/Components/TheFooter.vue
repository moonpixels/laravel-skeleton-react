<script lang="ts" setup>
import { computed } from 'vue'
import { trans } from 'laravel-vue-i18n'
import dayjs from 'dayjs'
import IconGithub from '@/Components/Icons/IconGithub.vue'
import { Text } from '@/Components/ui/text'

const socials = computed(() => {
  return [
    {
      name: trans('general.github'),
      href: 'https://github.com/moonpixels',
      icon: IconGithub,
    },
  ]
})
</script>

<template>
  <footer class="px-4 py-10 sm:px-6 lg:px-8">
    <div
      class="flex flex-col items-center justify-between gap-6 border-t pt-10 sm:flex-row"
    >
      <Text size="xs" variant="muted">
        {{
          $t('general.copyright_notice', { year: dayjs().year().toString() })
        }}
      </Text>

      <div class="flex gap-4">
        <a
          v-for="social in socials"
          :key="social.name"
          :href="social.href"
          class="group -m-2.5 flex size-10 items-center justify-center"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span class="sr-only">
            {{ $t('general.follow_us', { name: social.name }) }}
          </span>

          <component
            :is="social.icon"
            class="size-5 text-muted-foreground transition group-hover:text-foreground"
          />
        </a>
      </div>
    </div>
  </footer>
</template>
