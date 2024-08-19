import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from './views/HomeView.vue'
import AccountView from './views/AccountView.vue'
import LoginView from './views/LoginView.vue'

const routes = [
    { path: '/', component: HomeView },
    { path: '/account', component: AccountView },
    { path: '/login', component: LoginView },
]

export const router = createRouter({
    history: createMemoryHistory(),
    routes,
})