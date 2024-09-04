import { store } from './store'
import vue3GoogleLogin from 'vue3-google-login'

export const GoogleLogin = vue3GoogleLogin
export const clientId = "156760294250-08scfgvqdc5ijsinn0r1gs7829ao9frr.apps.googleusercontent.com"



export async function validateAuth() {
    const userData = store.getters.userData;
    if (!userData) {
        return false;
    }

    const credential = userData.credential;
    if(!credential) {
        return false;
    }

    const resp = await fetch(window.origin + '/api/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential }),
    })
    const response = await resp.json();
    console.log(response);
    if (response.error)
        return false;

    return true;
}