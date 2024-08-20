import { createMemoryHistory, createWebHistory, createRouter } from 'vue-router'

import HomeView from './views/HomeView.vue'
import AccountView from './views/AccountView.vue'
import LoginView from './views/LoginView.vue'

const routes = [
    { name: "Home", path: '/', component: HomeView },
    { path: '/account', component: AccountView },
    { path: '/login', component: LoginView },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})