import { IconGithub } from '@/components/icons/icon-github'
import { Text } from '@/components/text'
import { format } from 'date-fns'
import { useLaravelReactI18n } from 'laravel-react-i18n'

export function AppFooter() {
  const { t } = useLaravelReactI18n()

  const socials = [
    {
      name: t('general.github'),
      href: 'https://github.com/moonpixels',
      icon: IconGithub,
    },
  ]

  return (
    <footer className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-between gap-6 border-t pt-10 sm:flex-row">
        <Text size="xs" variant="muted">
          {t('general.copyright_notice', { year: format(new Date(), 'y') })}
        </Text>

        <div className="flex gap-4">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              className="group -m-2.5 flex size-10 items-center justify-center"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="sr-only">{t('general.follow_us', { name: social.name })}</span>

              <social.icon className="text-muted-foreground group-hover:text-foreground size-5 transition" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
