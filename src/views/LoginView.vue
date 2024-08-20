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
</template>

<script setup>
import { googleLogout, decodeCredential } from "vue3-google-login"
import { router } from "../routes"
</script>

<script>
const userApiEndPoint = `${window.location.origin}/api/user`

export default {
    components: {
    },
    data() {
        return {
            loading: false
        }
    },    
    methods: {
        callback: function (response) {
            this.loading = true;
            const userData = decodeCredential(response.credential)
            console.log("Handle the userData", userData)

            this.$store.commit("setUserData", userData)

            //this.$router.push({name:'Home'}); 
        }
    }
}
</script>