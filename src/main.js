import { createApp } from 'vue'

import { router } from './routes'
import { store } from './store'
import { GoogleLogin, clientId } from './auth'
import App from './App.vue'
import './index.css'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faHouse, faPlus, faDice, faCopy, faTrashCan } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faHouse, faPlus, faDice, faCopy, faTrashCan)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(GoogleLogin, {
    clientId: clientId
})
app.use(store)
app.use(router)

app.mount('#app')
