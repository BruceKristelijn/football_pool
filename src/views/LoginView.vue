<template>
    <section class="bg-gray-50 dark:bg-gray-900 absolute inset-x-0 inset-y-0">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div
                class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1
                        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Sign in
                    </h1>
                    <form class="space-y-4 md:space-y-6" action="#">
                        <div class="flex items-center justify-between">
                            <GoogleLogin :callback="callback" class="allign-center" prompt />
                            <span v-if="loading" class="loading loading-spinner loading-lg"></span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <dialog id="login_error_modal" class="modal">
        <div class="modal-box">
          <h3 class="text-lg font-bold">Hello!</h3>
          <p class="py-4">{{ modalError }}</p>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button>OK</button>
        </form>
      </dialog>
</template>

<script setup>
import { googleLogout, decodeCredential, googleSdkLoaded  } from "vue3-google-login"
import { router } from "../routes"
</script>

<script>
const userApiEndPoint = `${window.location.origin}/api/user`

export default {
    components: {
    },
    data() {
        return {
            loading: false,
            modalError: "An error occurred while trying to login. Please try again later."
        }
    },    
    methods: {
        callback: async function (response) {
            this.loading = true;
            let body = {};

            try {
                const resp = await fetch(userApiEndPoint, {
                    method: 'POST',
                    //headers: { 'Content-Type': 'application/json'},
                    body: response.credential
                });
                if (resp.ok) {
                    body = await resp.json();
                    
                } else {
                    console.error(resp)
                    // Handle error response
                    if (resp.status === 500) {
                        this.modalError = "An error occurred while trying to login. Please try again later."
                    } else if (resp.status === 401) {
                        this.modalError = "Unauthorized. Please try again later."
                    } else {
                        this.modalError = "An error occurred while trying to login. Please try again later."
                    }
                    
                    login_error_modal.showModal();
                    return;
                }
            } catch (error) {
                this.modalError = "An error occurred while trying to login. Please try again later."
                login_error_modal.showModal();
                return;
            }

            console.log(body)
            this.$store.commit("setUserData", {credential: response.credential, user: JSON.parse(body)})
            this.$nextTick(() => {
                //console.log(this.$store.state.userData)
                console.log(this.$store.getters.userData)
            })

            // Get redirect from path
            const redirect = this.$route.query.redirect

            if(redirect) {
                this.$router.push({path: redirect})
            } else {
            this.$router.push({name:'Home'}); 
            }
        }
    },
    created() {
        this.$store.commit("setUserData", undefined);
    }
}
</script>