<template>
    <div class="flex flex-col gap-4">

        <div class="card bg-base-100 w-full shadow-xl self-center">

            <transition name="fade">
                <div v-if="loading" class="card-body justify-center items-center" :class="{ nomargin: loading }">
                    <div class="flex flex-col gap-2 w-80 m-10">
                        <div class="skeleton h-4 w-full"></div>
                        <div class="skeleton h-4 w-full"></div>
                        <div class="skeleton h-4 w-full"></div>
                        <div class="skeleton h-4 w-full"></div>
                        <div class="skeleton h-4 w-full"></div>
                    </div>
                </div>
            </transition>

            <!-- <transition name="fade">
                
                <div v-if="!loading && pool != null && $store.getters.userData.user.user.id == pool.ownerId" class="card-body justify-center items-center w-full">
                    Admin settings
                </div>
            </transition> -->

            <transition name="fade">
                <div v-if="!loading && pool != null" class="card-body justify-center items-center w-full">
                    <div class="overflow-x-auto">
                        <div class="flex flex-row place-content-around">
                            <h2>Poule stand</h2>
                            <button class="btn btn-sm btn-neutral" @click="openAddPlayerModal">
                                <font-awesome-icon :icon="['fas', 'plus']" />
                                Voeg speler toe
                            </button>
                        </div>
                        <table class="table">
                            <!-- head -->
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Naam</th>
                                    <th>Punten</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- row 1 -->
                                <tr v-for="user in pool.users">
                                    <td>
                                        <div class="avatar">
                                            <div class="h-12 w-12 rounded-full">
                                                <img :src="user.image_url" alt="Avatar Tailwind CSS Component" />
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="flex items-center gap-3">
                                            <div>
                                                <div class="font-bold">{{ user.display_name }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <ScoreBadgeComponent :score="user.score" />
                                    </td>

                                    <td
                                        v-if="user.id != pool.ownerId && $store.getters.userData.user.user.id == pool.ownerId">
                                        <button class="btn btn-sm" @click="kickPlayer(user)">
                                            <font-awesome-icon :icon="['fas', 'trash-alt']" />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </transition>

            <transition name="fade">
                <div v-if="!loading && pool == null" class="card-body justify-center items-center w-full">
                    <div role="alert" class="alert alert-error">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Error! Poule kan niet gevonden worden.</span>
                    </div>
                </div>
            </transition>
        </div>

        <div class="card bg-base-100 w-full shadow-xl self-center">
            <div class="card-body">
                <MatchesComponent />
            </div>
        </div>
    </div>

    <dialog id="addPlayerModal" class="modal">
        <div class="modal-box">
            <h3 class="text-lg font-bold">Nodig een speler uit voor de pool</h3>
            <p class="py-4">{{ modalError }}</p>

            <div v-if="copied" role="alert" class="alert alert-success mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Link is gekopieerd!</span>
            </div>

            <button class="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg w-full" @click="copyPoolInviteUrl"><span
                    class="bg-base-300 p-2 text-sm rounded-sm w-3/4 mr-5">{{ pool_invite_url }}</span>
                <font-awesome-icon :icon="['fas', 'copy']" /></button>
        </div>
        <form method="dialog" class="modal-backdrop">
        </form>
    </dialog>

    <!-- Open the modal using ID.showModal() method -->
    <dialog id="remove_player_modal" class="modal">
        <div class="modal-box">
            <h3 class="text-lg font-bold" v-if="to_remove">Wil je {{to_remove.display_name}} uit de poule verwijderen?
            </h3>
            <div class="modal-action">
                <form method="dialog">
                    <!-- if there is a button in form, it will close the modal -->
                    <button class="btn btn-primary" @click="removePlayer()">Ja</button>
                </form>
                <form method="dialog">
                    <button class="btn btn-decondary">Nee</button>
                </form>
            </div>
        </div>
    </dialog>
</template>

<script>
    import MatchesComponent from '../components/MatchesComponent.vue'
    import ScoreBadgeComponent from '../components/ScoreBadgeComponent.vue';

    export default {
        components: {
            MatchesComponent,
            ScoreBadgeComponent
        },
        data() {
            return {
                loading: true,
                copied: false,
                pool: null,
                to_remove: null,
                pool_invite_url: "http://localhost:3000/pool/0",
                Pool_just_joined: this.$route.query.joined === 'true'
            }
        },
        computed: {

        },
        methods: {
            async fetchData() {
                // Get the pool users
                const url = window.origin + "/api/pool/get_scores";
                const user = this.$store.getters.userData;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ requestee: user, id: this.$route.params.id })
                })
                const json = await response.json();
                this.pool = json.pool;

                // Sort users by score
                this.pool.users.sort((a, b) => (a.score < b.score) ? 1 : -1);

                this.loading = false;
            },
            openAddPlayerModal() {
                console.log("openAddPlayerModal")
                addPlayerModal.showModal();
            },
            copyPoolInviteUrl() {
                console.log("copyPoolInviteUrl")
                navigator.clipboard.writeText(this.pool_invite_url);
                this.copied = true;
            },
            kickPlayer(user) {
                this.to_remove = user;
                remove_player_modal.showModal();
            },
            async removePlayer() {
                try {
                    console.log("removePlayer");
                    const url = window.origin + "/api/pool/kick";
                    const user = this.$store.getters.userData;
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ owner: user, id: this.$route.params.id, user: this.to_remove })
                    });
                    const json = await response.json();
                    this.pool = json.pool;
                    this.to_remove = null;
                } catch (error) {
                    console.error("Error removing player:", error);
                    // Handle error here
                }
            }
        },
        async created() {
            console.log(this.$store.getters.userData.user.user.id)
            await this.fetchData()
            this.pool_invite_url = window.origin + "/pool/" + this.$route.params.id + "/join";
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