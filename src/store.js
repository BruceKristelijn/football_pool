import VuexPersistence from 'vuex-persist'
import { createStore } from 'vuex'

const vuexLocal = new VuexPersistence({
    storage: window.localStorage
})

// Create a new store instance.
export const store = createStore({
    state() {
        return {
            userData: null,
            isAdmin: false
        }
    },
    mutations: {
        setUserData(state, payload) {
            state.userData = payload
        },
        setIsAdmin(state, payload) {
            state.isAdmin = payload
        }
    },
    getters: {
        userData(state) {
            return state.userData
        },
        isAdmin(state){
            return state.isAdmin
        }
    },
    plugins: [vuexLocal.plugin]
})