<template>
    <div class="flex flex-col">
        <div class="card bg-base-100 w-80 shadow-xl">
            <div v-if="loading" class="card-body">
                <div class="skeleton h-32 w-full"></div>
                <div class="skeleton h-4 w-full"></div>
                <div class="skeleton h-4 w-full"></div>
            </div>

            <div v-else class="card-body justify-center">
                <!-- Competition  -->
                <div class="flex flex-row gap-2 justify-center">
                    <!-- <img :src="match.area.flag" alt="Competition logo" class="w-10 h-10" /> -->
                    <img :src="match.competition.emblem" alt="Competition logo" class="w-10 h-10" />

                    <h2 class="card-title">
                        {{ match.competition.name }}
                    </h2>
                </div>

                <!-- Countdown -->
                <div v-if="match_state == 0">
                    <div class="flex gap-5 justify-center">
                        <span class="badge">
                            {{ time_left }}
                        </span>
                    </div>
                </div>

                <!-- Crests & Scorecards -->
                <div class="card-body justify-center">
                    <div class="flex flex-row gap-2 justify-center">
                        <img :src="match.homeTeam.crest" alt="Home team logo" class="w-10 h-10" />
                        <h3 v-if="match_state == 0">VS</h3>
                        <div v-else>
                            <h5>{{ match.score.halfTime.home }} - {{ match.score.halfTime.away }}</h5>
                            <h3>{{ match.score.fullTime.home }} - {{ match.score.fullTime.away }}</h3>
                        </div>
                        <img :src="match.awayTeam.crest" alt="Away team logo" class="w-10 h-10" />
                    </div>
                </div>
            </div>




            {{ match }}


            <!-- <div class="card bg-base-100 w-80 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title">Other matches</h2>
                    <MatchesComponent />
                </div>
            </div> -->
        </div>
    </div>
</template>

<script>
import MatchesComponent from '../components/MatchesComponent.vue'

export default {
    components: {
        MatchesComponent
    },
    data() {
        return {
            loading: true,
            time_left: "",
            match_state: 0 // 0 = planned, 1 = live, 2 = finished
        }
    },
    computed: {

    },
    methods: {
        async fetchData() {
            const url = `${window.location.origin}/api/match?id=${this.$route.params.id}`
            const response = await fetch(url)
            const data = await response.json()
            this.match = data;
            console.log(data);
            this.loading = false;
        },
        get_time_left() {
            const date = new Date(this.match.utcDate);
            const now = Date.now();

            const diff = date - now;

            if (diff < 0) {
                return "";
            } else {
                const days = Math.floor(diff / 1000 / 60 / 60 / 24);
                const hours = Math.floor(diff / 1000 / 60 / 60) % 24;
                const minutes = Math.floor(diff / 1000 / 60) % 60;
                const seconds = Math.floor(diff / 1000) % 60;

                return `${days}d ${hours}h ${minutes}m ${seconds}s`;
            }
        }
    },
    async created() {
        await this.fetchData()

        // Find state
        this.match_state = this.match.status == "FINISHED" ? 2 : this.match.status == "LIVE" ? 1 : 0;

        // Setup time left countdown
        this.time_left = this.get_time_left()
        setInterval(() => {
            this.time_left = this.get_time_left()
        }, 1000)
    }
}
</script>