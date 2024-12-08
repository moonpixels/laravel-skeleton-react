import { AxiosInstance } from 'axios'

import { route as ziggyRoute } from 'ziggy-js'
import Echo from 'laravel-echo'

import Pusher from 'pusher-js'
import { SharedData } from '@/Types/index'

declare global {
  interface Window {
    axios: AxiosInstance
    Pusher: typeof Pusher
    Echo: Echo
  }

  const route: typeof ziggyRoute
  const axios: AxiosInstance
}

declare module 'vue' {
  interface ComponentCustomProperties {
    route: typeof ziggyRoute
  }
}

declare module '@inertiajs/core' {
  interface PageProps extends InertiaPageProps, SharedData {}
}
