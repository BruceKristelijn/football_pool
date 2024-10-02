<template>
    <div class="flex flex-col">
        <div class="card bg-base-100 shadow-xl self-center">

            <transition name="fade" v-if="loading" class="card-body justify-center items-center" :class="{nomargin: !loading}">
                    <div class="flex flex-col gap-2 w-80 m-10">
                        <div class="skeleton h-32 w-full"></div>
                        <div class="skeleton h-4 w-full"></div>
                        <div class="skeleton h-4 w-full"></div>
                    </div>
            </transition>

            <transition name="fade">
                <div v-if="!loading" class="card-body justify-center items-center">
                    <!-- Competition  -->
                    <div class="flex flex-row gap-2 justify-center items-center">
                        <!-- <img :src="match.area.flag" alt="Competition logo" class="w-10 h-10" /> -->
                        <img :src="match.competitionEmblem" alt="Competition logo" class="w-10 h-10" />

                        <h2 class="card-title">
                            {{ match.competitionName }}
                        </h2>
                    </div>

                    <!-- Location card -->
                    <div class="badge badge-primary">
                        <p class="font-sm">
                            <!-- {{ match.venue }} -->
                            TODO: Add venue support
                        </p>
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
                    <div class="card-body justify-center badge">
                        <div class="flex flex-row gap-2 justify-center">
                            <img :src="match.homeTeamCrest" alt="Home team logo" class="w-10 h-10" />
                            <h3 v-if="match_state == 0">VS</h3>
                            <div v-else>
                                <h5>{{ match.halfTimeHome }} - {{ match.halfTimeAway }}</h5>
                                <h3>{{ match.fullTimeHome }} - {{ match.fullTimeAway }}</h3>
                            </div>
                            <img :src="match.awayTeamCrest" alt="Away team logo" class="w-10 h-10" />
                        </div>
                    </div>

                    <!-- Prediction card -->
                    <div class="card bg-base-200 shadow-xl text-center mt-5">
                        <div class="card-body my-0">
                            <h1>Voorspelling</h1>
                            <h2>Stand bij rust</h2>

                            <!-- Form sucess display -->
                            <transition name="list">
                                <div class="alert alert-success mb-2 w-3/4 mx-auto p-2"
                                    v-if="showPredictionFormSuccess">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0 stroke-current"
                                        fill="none" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>
                                        Prediction saved!
                                    </span>
                                </div>
                            </transition>

                            <!-- Form error display -->
                            <TransitionGroup name="list" tag="div">
                                <div v-for="error in predictionFormErrors" role="alert" :key="error"
                                    class="alert alert-error mb-2 w-3/4 mx-auto p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0 stroke-current"
                                        fill="none" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>
                                        {{ error }}
                                    </span>
                                </div>
                            </TransitionGroup>

                            <div class="gap-2 justify-center flex flex-row items-center mx-10">

                                <label class="form-control flex flex-col w-full max-w-xs ">
                                    Home
                                    <input type="number" placeholder="" class="input input-bordered w-full my-1"
                                        v-model="prediction.halftime.home" @change="validateMatchPrediction"
                                        :disabled="match_state != 0" />
                                </label>
                                <label class="form-control flex flex-col w-full max-w-xs text-center" style="align-items: center;">
                                    <ScoreBadgeComponent :score="match.user_score.explainer.firstHalf" />
                                    <span class="w-1/2">-</span>
                                </label>
                                <label class="form-control flex flex-col w-full max-w-xs">Away
                                    <input type="number" placeholder="" class="input input-bordered w-full my-1"
                                        v-model="prediction.halftime.away" @change="validateMatchPrediction"
                                        :disabled="match_state != 0" />
                                </label>
                            </div>

                            <h2>Eindstand</h2>
                            <div class="gap-2 justify-center flex flex-row items-center mx-10">

                                <label class="form-control flex flex-col w-full max-w-xs">
                                    Home
                                    <input type="number" placeholder="" class="input input-bordered w-full my-1"
                                        v-model="prediction.final.home" @change="validateMatchPrediction"
                                        :disabled="match_state != 0" />
                                </label>
                                <label class="form-control flex flex-col w-full max-w-xs text-center" style="align-items: center;">
                                    <ScoreBadgeComponent :score="match.user_score.explainer.secondHalf" />
                                    <span class="w-1/2">-</span>
                                </label>
                               
                                <label class="form-control flex flex-col w-full max-w-xs">
                                    Away
                                    <input type="number" placeholder="" class="input input-bordered w-full my-1"
                                        v-model="prediction.final.away" @change="validateMatchPrediction"
                                        :disabled="match_state != 0" />
                                </label>
                            </div>

                            <!-- Submit button -->
                            <button class="btn btn-primary mt-4 w-3/4 mx-auto" :disabled="isMatchPredictionLoading"
                                @click="saveMatchPrediction" v-if="match_state == 0">
                                Save
                                <span class="loading loading-spinner loading-md" v-if="isMatchPredictionLoading"></span>
                            </button>

                            <!-- Score card -->
                            <div v-else>
                                Prediction score: <br>
                                <button v-if="match.user_score.explainer.multiplier < 1" class="btn btn-danger btn-sx mr-2" :disabled="true">
                                    x{{match.user_score.explainer.multiplier}}
                                </button>
                                <ScoreBadgeComponent :score="match.user_score.score" />
                            </div>

                        </div>
                    </div>
                </div>
            </transition>
            <!-- {{ match }} -->
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
                match: undefined,
                loading: true,
                time_left: "",
                match_state: 0, // 0 = planned, 1 = IN_PLAY, 2 = finished
                isMatchPredictionLoading: false,
                predictionFormErrors: [],
                showPredictionFormSuccess: false,
                prediction: {
                    halftime: {
                        home: 0,
                        away: 0
                    },
                    final: {
                        home: 0,
                        away: 0
                    },
                }
            }
        },
        computed: {

        },
        methods: {
            async fetchData() {
                const url = `${window.location.origin}/api/match?id=${this.$route.params.id}`
                const user = this.$store.getters.userData;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user: user })
                });
                const data = await response.json()
                this.match = data;
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
            },
            validateMatchPrediction() {
                this.predictionFormErrors = [];
                const values = [this.prediction.halftime.home, this.prediction.halftime.away, this.prediction.final.home, this.prediction.final.away]

                // All numeric
                if (values.some(isNaN)) {
                    this.predictionFormErrors.push("All fields must be numeric")
                }

                // Check if final score is higher than halftime score
                if (this.prediction.final.home < this.prediction.halftime.home || this.prediction.final.away < this.prediction.halftime.away) {
                    this.predictionFormErrors.push("Final score must be higher than halftime score");
                }

                // Check if any score is negative
                if (values.some(v => v < 0)) {
                    this.predictionFormErrors.push("Scores cannot be negative")
                }
            },
            async saveMatchPrediction() {
                if (this.predictionFormErrors.length > 0) return;

                this.isMatchPredictionLoading = true;

                const url = `${window.location.origin}/api/predict?id=${this.match.id}`
                const user = this.$store.getters.userData;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user: user, new_prediction: this.prediction })
                });
                const data = await response.json()
                console.log(data)


                this.isMatchPredictionLoading = false;
                this.showPredictionFormSuccess = true;

                await new Promise(resolve => setTimeout(resolve, 2000))
                this.showPredictionFormSuccess = false;
            }
        },
        async created() {
            await this.fetchData()

            if (this.match.prediction != undefined)
                this.prediction = {
                    halftime: {
                        home: this.match.prediction.halftimeScoreHome,
                        away: this.match.prediction.halftimeScoreAway
                    },
                    final: {
                        home: this.match.prediction.fulltimeScoreHome,
                        away: this.match.prediction.fulltimeScoreAway
                    }
                }

            // Find state
            this.match_state = this.match.status == "FINISHED" ? 2 : this.match.status == "IN_PLAY" ? 1 : 0;

            // Setup time left countdown
            this.time_left = this.get_time_left()

            // Await 2 seconds
            setInterval(() => {
                this.time_left = this.get_time_left()
            }, 1000)
        }
    }
</script>

<style scoped>
    .nomargin {
        margin-bottom: -2000px;
    }

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