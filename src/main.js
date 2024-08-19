import { createApp } from 'vue'

import { router } from './routes'
import { GoogleLogin, clientId } from './auth'
import App from './App.vue'
import './index.css'

const app = createApp(App)

app.use(GoogleLogin, {
    clientId: clientId
})
app.use(router)

app.mount('#app')
