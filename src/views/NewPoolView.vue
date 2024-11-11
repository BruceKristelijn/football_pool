<template>
    <div class="flex flex-col gap-4">

        <div class="card bg-base-100 w-full shadow-xl self-center min-w-full">

            <transition name="fade">
                <div v-if="loading" class="card-body justify-center" :class="{ nomargin: loading }">
                    <div class="flex flex-col gap-2 w-80 m-10">
                        <div class="skeleton h-4 w-full"></div>
                        <div class="skeleton h-4 w-3/4"></div>
                        <div class="skeleton h-4 w-full"></div>
                        <div class="skeleton h-4 w-full"></div>
                        <div class="skeleton h-4 w-full"></div>
                    </div>
                </div>
            </transition>

            <transition name="fade">
                <div v-if="!loading" class="card-body justify-center min-w-80 w-full">
                    <!-- Pool name input -->
                    <label class="label">
                        <span class="label-text">Pool naam</span>
                    </label>
                    <span v-f="poolNameError">{{poolNameError}}</span>
                    <label class="input-group input-group-vertical w-full">
                        <input type="text" placeholder="A funny name" class="input input-bordered border-error  " v-model="poolName" />
                    </label>

                    <!-- Pool is private input -->
                    <div class="form-control">
                        <label class="cursor-pointer label">

                            <span class="label-text">Privé pool</span>
                            <input type="checkbox" checked="checked" class="checkbox checkbox-primary" v-model="poolPrivate" />
                            

                        </label>
                    </div>


                    <!-- Team selector -->
                    <label class="label">
                        <span class="label-text">Kies een team om op te focussen</span>
                    </label>
                    <label class="input-group input-group-vertical">
                        <select class="select select-bordered" v-model="poolTeam">  
                            <option selected>Feyenoord</option>
                        </select>
                    </label>

                    <!-- Submit -->
                    <button class="btn btn-primary" @click="submitPool" :disabled="submitting">Maak pool
                        <transition name="fade">
                            <span v-if="submitting" class="loading loading-spinner loading-md"></span>
                        </transition>
                    </button>

                </div>
            </transition>
            <!-- {{ match }} -->
        </div>
    </div>
</template>

<script>
    const createPath = window.origin + "/api/pool/create";

    export default {
        components: {
        },
        data() {
            return {
                loading: true,
                submitting: false,
                poolNameError: null,
                poolPrivateError: null,
                poolTeamError: null,
                poolName: "",
                poolPrivate: false,
                poolTeam: null
            }
        },
        computed: {

        },
        methods: {
            async fetchData() {
                await new Promise(resolve => setTimeout(resolve, 1000));
            },
            async submitPool(){
                console.log("submitting pool")
                if(this.submitting) return;
                this.submitting = true;

                const userData = this.$store.getters.userData;
                const resp = await fetch(createPath, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: this.poolName,
                        isPrivate: this.poolPrivate,
                        owner: userData
                    })
                })

                const data = await resp.json();
                
                // Redirect to /pool/:id
                this.$router.push({ path: "/pool/" + data.newPool.id, params: { id: data.newPool.id }})
            }
        },
        async created() {
            await this.fetchData();
            this.loading = false;
        }
    }
</script>

<style scoped>
    .nomargin {}

    .list-move,
    /* apply transition to moving elements */
    .list-enter-active,
    .list-leave-active {
        transition: all 0.2s ease;
    }

    .list-enter-from,
    .list-leave-to {
        opacity: 0;
        transform: translateX(30px);
    }

    /* ensure leaving items are taken out of layout flow so that moving
       animations can be calculated correctly. */
    .list-leave-active {
        position: absolute;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
        position: absolute;
    }
</style>