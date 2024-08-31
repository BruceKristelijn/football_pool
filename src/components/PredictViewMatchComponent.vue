<template>
    <div class="collapse collapse-arrow bg-base-200">
        <input type="radio" name="my-accordion-2" />
        <div class="collapse-title text-xl font-medium flex flex-row">
            <div class="flex-1">
                <div class="flex flex-row w-1/3">
                    <div class="w-1/4">
                        <img :src="match.homeTeam.crest" alt="home team crest" class="w-5 h-5">
                    </div>

                    <div class="w-1/4">
                        <img :src="match.awayTeam.crest" alt="away team crest" class="w-5 h-5">
                    </div>

                    <p class="text-sm">{{ formatDate(match.utcDate) }}</p>
                </div>
            </div>

            <!-- Final Score display -->
            <div v-if="match_state == 2" class="flex-none badge p-2">
                <p class="text-sm">
                    {{ match.score.fullTime.home }} - {{ match.score.fullTime.away }}
                </p>
            </div>

            <!-- Points earned display -->
            <div v-if="match_state == 2" class="flex-none">
                <ScoreBadgeComponent :score="match.user_score || 0" />
            </div>

            <!-- <div class="flex-none">1 - 0</div> -->
            <font-awesome-icon v-if="match.prediction == null && match.status == 'TIMED'"
                style="color:var(--fallback-er,oklch(var(--er)/var(--tw-bg-opacity)));" class="mt-1"
                :icon="['fas', 'exclamation']" />
        </div>
        <div class="collapse-content">

            <!-- Form error display -->
            <TransitionGroup name="list" tag="div">
                <div v-for="error in predictionFormErrors" role="alert" :key="error"
                    class="alert alert-error mb-2 w-3/4 mx-auto p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0 stroke-current" fill="none"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                        {{ error }}
                    </span>
                </div>
            </TransitionGroup>

            <h2 class="text-center"><b>Ruststand</b></h2>
            <div class="gap-2 justify-center flex flex-row items-center mx-10">

                <label class="form-control flex flex-col w-full max-w-xs ">
                    Home
                    <input type="number" placeholder="" class="input input-bordered w-full my-1"
                        v-model="prediction.halftime.home" @change="validateMatchPrediction"
                        :disabled="match_state != 0" />
                </label>
                <label class="form-control flex flex-col w-full max-w-xs">Away
                    <input type="number" placeholder="" class="input input-bordered w-full my-1"
                        v-model="prediction.halftime.away" @change="validateMatchPrediction"
                        :disabled="match_state != 0" />
                </label>
            </div>

            <h2 class="text-center"><b>Eindstand</b></h2>
            <div class="gap-2 justify-center flex flex-row items-center mx-10">

                <label class="form-control flex flex-col w-full max-w-xs">
                    Home
                    <input type="number" placeholder="" class="input input-bordered w-full my-1"
                        v-model="prediction.final.home" @change="validateMatchPrediction"
                        :disabled="match_state != 0" />
                </label>
                <label class="form-control flex flex-col w-full max-w-xs">
                    Away
                    <input type="number" placeholder="" class="input input-bordered w-full my-1"
                        v-model="prediction.final.away" @change="validateMatchPrediction"
                        :disabled="match_state != 0" />
                </label>
            </div>


            <!-- Submit button -->
            <button class="btn btn-primary block mt-10 mx-auto" :disabled="isMatchPredictionLoading || predictionFormErrors.length > 0"
                @click="saveMatchPrediction" v-if="match_state == 0">
                Save
                <span class="loading loading-spinner loading-md" v-if="isMatchPredictionLoading"></span>
            </button>

            <!-- Score card -->
            <div v-else>
                Prediction score: <br>
            </div>
        </div>
    </div>
</template>

<script>
     import ScoreBadgeComponent from './ScoreBadgeComponent.vue';

    export default {
        components: {
            ScoreBadgeComponent
        },
        async created() {
            if (this.match.prediction != null) {
                console.log(this.match.prediction)
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
            }
            this.match_state = this.match.status == "FINISHED" ? 2 : this.match.status == "LIVE" ? 1 : 0;
        },
        methods: {
            formatDate(utcDate) {
                const date = new Date(utcDate)
                const locale = "nl-nl"

                const day = date.toLocaleString(locale, { day: "2-digit" })
                const month = date.toLocaleString(locale, { month: "short" }).toUpperCase();
                return `${day} ${month}`
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
                console.log(this.prediction)
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
                this.prediction = {
                    halftime: {
                        home: data.halftimeScoreHome,
                        away: data.halftimeScoreAway
                    },
                    final: {
                        home: data.fulltimeScoreHome,
                        away: data.fulltimeScoreAway
                    }
                }
                console.log(this.prediction)
                this.isMatchPredictionLoading = false;
            },
        },
        props: {
            match: {
                type: Object,
                required: true
            }
        },
        data: function () {
            return {
                prediction: {
                    halftime: {
                        home: 0,
                        away: 0
                    },
                    final: {
                        home: 0,
                        away: 0
                    }
                },
                match_state: 0,
                isMatchPredictionLoading: false,
                predictionFormErrors: []
            }
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