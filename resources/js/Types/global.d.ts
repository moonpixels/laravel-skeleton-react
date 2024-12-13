import { PageProps as InertiaPageProps } from '@inertiajs/core'
import { AxiosInstance, AxiosStatic } from 'axios'
import { route as ziggyRoute } from 'ziggy-js'
import { PageProps as AppPageProps } from './'

declare global {
  interface Window {
    axios: AxiosInstance
    Pusher: typeof Pusher
    Echo: typeof Echo
  }

  const axios: AxiosStatic
  const Pusher: typeof Pusher
  const Echo: typeof Echo
  const route: typeof ziggyRoute
}

declare module '@inertiajs/core' {
  interface PageProps extends InertiaPageProps, AppPageProps {}
}
