<template>
    <div class="navbar bg-base-100">
        <div class="navbar-start">
            <div class="dropdown">
                <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                </div>
                <ul tabindex="0"
                    class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                    <li>
                        <RouterLink to="/">
                            <font-awesome-icon :icon="['fas', 'house']" />
                            Voorpagina
                        </RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/predict">
                            <font-awesome-icon :icon="['fas', 'dice']" />
                            Voorspellen
                        </RouterLink>
                    </li>

                    <li>
                        <RouterLink to="/pool/new">
                            <font-awesome-icon :icon="['fas', 'plus']" />
                            Nieuwe poule maken
                        </RouterLink>
                    </li>

                    <li>
                        <RouterLink v-if="$store.getters.isAdmin" to="/admin">
                            <font-awesome-icon :icon="['fas', 'plus']" />
                            Update matches
                        </RouterLink>
                    </li>

                    <li class="mt-3 pointer-events-none">
                        <b>Mijn poules:</b>
                    </li>


                    <li v-if="!isLoadingUserPools" v-for="pool in userPools">
                        <PoolButtonNavBarComponent :pool="pool"></PoolButtonNavBarComponent>
                    </li>

                    <li v-if="isLoadingUserPools" class="flex flex-row align-middle p2">
                        <div class="skeleton h-4 w-20 m-1 ml-2 mt-2.5"></div>
                        <div class="avatar-group -space-x-6 rtl:space-x-reverse">
                            <div class="avatar">
                                <div class="w-6">
                                    <div class="skeleton h-6 w-6 shrink-0 rounded-full"></div>
                                </div>
                            </div>
                            <div class="avatar">
                                <div class="w-6">
                                    <div class="skeleton h-6 w-6 shrink-0 rounded-full"></div>
                                </div>
                            </div>
                            <div class="avatar">
                                <div class="w-6">
                                    <div class="skeleton h-6 w-6 shrink-0 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="flex-none gap-2" v-if="userData != null">
            <div class="dropdown dropdown-end">
                <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                    <div class="w-10 rounded-full">
                        <img alt="Tailwind CSS Navbar component" :src="userData.user.user.image_url" />
                    </div>
                </div>
                <ul tabindex="0"
                    class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                    <li>
                        <RouterLink to="/login">Logout</RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import PoolButtonNavBarComponent from './PoolButtonNavBarComponent.vue';

    export default {
        components: {
            PoolButtonNavBarComponent
        },
        methods: {
            async getUserPools() {
                this.isLoadingUserPools = true;
                const user = this.$store.getters.userData;
                const response = await fetch(`${window.origin}/api/pool/list`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ owner: user })
                })

                const json = await response.json();
                this.userPools = json.pools;
                this.isLoadingUserPools = false;
            },
            onStoreMutation(mutation, state) {
                console.log(mutation.type)
                console.log(mutation.payload)

                if (mutation.type === 'setUserData') {
                    this.userData = mutation.payload;
                    this.getUserPools();
                }
            }
        },
        data: function () {
            return {
                isLoadingUserPools: true,
                userData: undefined,
                userPools: []
            }
        },
        async created() {
            if (this.$store.getters.userData) {
                this.userData = this.$store.getters.userData;
                await this.getUserPools();
            }

            this.unSubscribe = this.$store.subscribe(this.onStoreMutation);
        },
        beforeDestroy() {
            if (this.unSubscribe)
                this.unSubscribe();
        }
    }
</script>