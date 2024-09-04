import { createMemoryHistory, createWebHistory, createRouter } from 'vue-router'
import { validateAuth } from './auth'

import HomeView from './views/HomeView.vue'
import AccountView from './views/AccountView.vue'
import LoginView from './views/LoginView.vue'
import MatchView from './views/MatchView.vue'
import NewPoolView from './views/NewPoolView.vue'
import JoinPoolView from './views/JoinPoolView.vue'
import PoolView from './views/PoolView.vue'
import PredictView from './views/PredictView.vue'
import AdminView from './views/AdminView.vue'

const routes = [
    { name: "Home", path: '/', component: HomeView },
    { path: '/account', component: AccountView },
    { path: '/predict', component: PredictView },
    { name: "Login", path: '/login', component: LoginView },
    { path: '/match/:id', component: MatchView },
    { path: '/pool/new', component: NewPoolView },
    { path: '/pool/:id', component: PoolView },
    { path: '/pool/:id/join', component: JoinPoolView },
    { path: '/admin', component: AdminView },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, from) => {
    const isAuthenticated = await validateAuth()
    if (
        // make sure the user is authenticated
        !isAuthenticated &&
        // ❗️ Avoid an infinite redirect
        to.name !== 'Login'
    ) {
        // redirect the user to the login page with the original URL as a parameter
        return { name: 'Login', query: { redirect: to.fullPath } }
    }
})