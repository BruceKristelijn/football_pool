import { store } from './store'
import vue3GoogleLogin from 'vue3-google-login'

export const GoogleLogin = vue3GoogleLogin
export const clientId = "156760294250-08scfgvqdc5ijsinn0r1gs7829ao9frr.apps.googleusercontent.com"



export async function validateAuth() {
    const userData = store.getters.userData;
    if (!userData) {
        console.log('No user data found');
        return false;
    }

    const credential = userData.credential;
    if (!credential) {
        console.log('No credential found');
        return false;
    }

    try {
        const resp = await fetch(window.origin + '/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ credential }),
        })

        if (resp.status === 401) {
            console.log('Unauthorized');
            return false;
        }
        
        const response = await resp.json();

        if (response.isAdmin)
            store.commit('setIsAdmin', response.isAdmin);

        return true;
    } catch (error) {
        console.error('Error validating token:', error);
        this.$store.commit("setUserData", null);
        return false;
    }
}