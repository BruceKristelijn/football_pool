import VuexPersistence from 'vuex-persist'
import { createStore } from 'vuex'

const vuexLocal = new VuexPersistence({
    storage: window.localStorage
})

// Create a new store instance.
export const store = createStore({
    state() {
        return {
            userdata: null
        }
    },
    mutations: {
        setUserData(state, userdata) {
            state.userdata = userdata
        }
    },
    plugins: [vuexLocal.plugin]
})