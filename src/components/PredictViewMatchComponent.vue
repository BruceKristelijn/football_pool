<template>
    <div class="collapse collapse-arrow bg-base-200">
        <input type="radio" name="my-accordion-2" />
        <div class="collapse-title text-xl font-medium flex flex-row">
            <div class="flex-1">Match</div>
            <!-- <div class="flex-none">1 - 0</div> -->
            <font-awesome-icon style="color:var(--fallback-er,oklch(var(--er)/var(--tw-bg-opacity)));" class="mt-1"
                :icon="['fas', 'exclamation']" />
        </div>
        <div class="collapse-content">
            <h2 class="text-center"><b>Ruststand</b></h2>
            <div class="gap-2 justify-center flex flex-row items-center mx-10">

                <label class="form-control flex flex-col w-full max-w-xs ">
                    Home
                    <input type="number" placeholder="" class="input input-bordered w-full my-1"
                        v-model="prediction.halftime.home" @change="validateMatchPrediction"
                        :disabled="match_state != 0" />
                </label>
                <span class="w-1/2">-</span>
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
                <span class="w-1/2">-</span>
                <label class="form-control flex flex-col w-full max-w-xs">
                    Away
                    <input type="number" placeholder="" class="input input-bordered w-full my-1"
                        v-model="prediction.final.away" @change="validateMatchPrediction"
                        :disabled="match_state != 0" />
                </label>
            </div>


            <!-- Submit button -->
            <button class="btn btn-primary block mt-10 mx-auto" :disabled="isMatchPredictionLoading"
                @click="saveMatchPrediction" v-if="match_state == 0">
                Save
                <span class="loading loading-spinner loading-md" v-if="isMatchPredictionLoading"></span>
            </button>

            <!-- Score card -->
            <div v-else>
                Prediction score: <br>
                <ScoreBadgeComponent score="30" />
                <ScoreBadgeComponent score="-30" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    async created() {
    },
    methods: {
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
            isMatchPredictionLoading: false
        }
    },
}
</script>