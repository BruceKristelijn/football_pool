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

            <transition name="fade">
                <div v-if="!loading" class="card-body justify-center items-center w-full">
                    <div class="overflow-x-auto">
                        <h2>Poule stand</h2>
                        <table class="table">
                            <!-- head -->
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Naam</th>
                                    <th>Punten</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- row 1 -->
                                <tr>
                                    <td>
                                        <div class="avatar">
                                                <div class="h-12 w-12 rounded-full">
                                                    <img src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                                                        alt="Avatar Tailwind CSS Component" />
                                                </div>
                                            </div>
                                    </td>
                                    <td>
                                        <div class="flex items-center gap-3">
                                            <div>
                                                <div class="font-bold">Voornaam Achternaam</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <ScoreBadgeComponent score="30" />
                                    </td>
                                </tr>                                
                            </tbody>
                        </table>
                    </div>
                </div>
            </transition>
            <!-- {{ match }} -->
        </div>

        <div class="card bg-base-100 w-full shadow-xl self-center">
            <div class="card-body">
                <MatchesComponent />
            </div>
        </div>
    </div>
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
        }
    },
    computed: {

    },
    methods: {
        async fetchData() {
            // Fake 1 sec await
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.loading = false;
        },
    },
    async created() {
        await this.fetchData()
    }
}
</script>

<style scoped></style>