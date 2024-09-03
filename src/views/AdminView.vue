<template>
    <div class="flex flex-col gap-4">

        <div class="card bg-base-100 w-full shadow-xl self-center">
            <input type="text" placeholder="API Key" class="input input-bordered w-full max-w-xs m-5" v-model="api_key"/>
            <button class="btn" @click="saveApikeyToLocalStorage">
                Save
                <span class="loading loading-spinner loading-md" v-if="isSavingApiKey"></span>
            </button>
        </div>

        <div class="card bg-base-100 w-full shadow-xl self-center">
            <button class="btn btn-success" :disabled="isLoadingMatches" @click="fetchData">
                Retrieve matches
                <span class="loading loading-spinner loading-md" v-if="isLoadingMatches"></span>
            </button>
        </div>
  </div>
</template>

<script>
    // Admin panel for refreshing and updating the matches and scores into the database 
    // since the APi is too slow to run on Vercel serverless functions
    const api_key_key = 'adminview/api_key'
    const matches_endpoint = 'https://api.sportsdata.io/v3/soccer/scores/json/Matches'

    export default {
        components: {
        },
        data() {
            return {
                api_key: '',
                isSavingApiKey: false,
                isLoadingMatches: false,
            }
        },
        computed: {

        },
        methods: {
            async saveApikeyToLocalStorage() {
                this.isSavingApiKey = true;
                localStorage.setItem(api_key_key, this.api_key);
                // Wait .5s to show the loading spinner
                await new Promise(resolve => setTimeout(resolve, 500));
                this.isSavingApiKey = false;
            },
            async fetchData() {
                this.isLoadingMatches = true;

                // Get matches from the API
                const matches_res = await fetch(`${window.origin}/api/teams/675/matches`, {
                    headers: {
                        'X-Auth-Token': this.api_key
                    }
                });
                const data = await matches_res.json();
                
                // Save the matches to the database using API
                const save_matches_res = await fetch(`${window.origin}/api/matches`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({matches: data, user: this.$store.getters.userData})
                });

                this.isLoadingMatches = false;
            },
        },
        async created() {
            this.api_key = localStorage.getItem(api_key_key);
          }
    }
</script>

<style scoped>
</style>