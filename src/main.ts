import 'vuetify/styles/main.css'
import '@mdi/font/css/materialdesignicons.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { md3 } from 'vuetify/blueprints'

const vuetify = createVuetify({
  components,
  directives,
  theme: { defaultTheme: 'dark' },
  blueprint: md3,
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
