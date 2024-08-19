import { createApp } from 'vue'
import App from './App.vue'
import vue3GoogleLogin from 'vue3-google-login'
import './index.css'

const CLIENTID = "156760294250-q247s7ivs1cv9h6l1ocp9ctrovobme7c.apps.googleusercontent.com"

const app = createApp(App)

app.use(vue3GoogleLogin, {
    clientId: CLIENTID
})

app.mount('#app')
