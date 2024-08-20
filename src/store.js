import { createStore } from 'vuex'

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
    }
})