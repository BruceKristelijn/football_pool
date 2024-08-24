import VuexPersistence from 'vuex-persist'
import { createStore } from 'vuex'

const vuexLocal = new VuexPersistence({
    storage: window.localStorage
})

// Create a new store instance.
export const store = createStore({
    state() {
        return {
            userData: null
        }
    },
    mutations: {
        setUserData(state, payload) {
            state.userData = payload
        }
    },
    getters: {
        userData(state) {
            return state.userData
        }
    },
    plugins: [vuexLocal.plugin]
})