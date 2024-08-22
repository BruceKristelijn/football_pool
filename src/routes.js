import { createMemoryHistory, createWebHistory, createRouter } from 'vue-router'

import HomeView from './views/HomeView.vue'
import AccountView from './views/AccountView.vue'
import LoginView from './views/LoginView.vue'
import MatchView from './views/MatchView.vue'
import PoolView from './views/PoolView.vue'

const routes = [
    { name: "Home", path: '/', component: HomeView },
    { path: '/account', component: AccountView },
    { path: '/login', component: LoginView },
    { path: '/match/:id', component: MatchView },
    { path: '/pool/:id', component: PoolView },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})