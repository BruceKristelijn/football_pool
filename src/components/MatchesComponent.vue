<template>
    <div class="justify-center flex h-96 -full overflow-y-scroll overflow-x-visible" ref="container">
        <div role="status" class="my-10 w-80" v-if="loading">
            <div class="skeleton h-32 w-full mb-4"></div>
            <div class="skeleton h-32 w-full"></div>
        </div>

        <div v-else>
                <RouterLink v-for="match in matches" :key="match.id"  :to="'/match/' + match.id" class="card bg-base-200 my-4">
                    <div class="card-body flex flex-row w-80">
                        <div class="flex flex-col justify-center w-1/2">
                            <img :src="match.homeTeam.crest" alt="home team crest" class="w-10 h-10 mx-auto">
                            <p class="text-xl text-sm w-1/2 content-center mx-auto text-center">{{ match.homeTeam.tla }}
                            </p>
                        </div>

                        <div class="flex flex-col justify-center">
                            <div v-if="match.status == 'FINISHED'" class="flex flex-row gap-2 items-center">
                                <p class="text-xl">{{ match.score.fullTime.home }}</p>
                                <p class="text-xl">-</p>
                                <p class="text-xl">{{ match.score.halfTime.away }}</p>
                            </div>
                            <div v-if="match.status != 'FINISHED'" class="flex flex-row gap-2 items-center">
                                <p class="text-sm">{{ formatDate(match.utcDate) }}</p>
                            </div>
                            <div role="alert" class="alert alert-success">
                                <span>30</span>
                            </div>
                        </div>


                        <div class="flex flex-col justify-center w-1/2">
                            <img :src="match.awayTeam.crest" alt="away team crest" class="w-10 h-10 mx-auto">
                            <p class="text-xl text-sm w-3/4 content-center mx-auto text-center">{{ match.awayTeam.tla }}
                            </p>
                        </div>
                    </div>
                </RouterLink>
        </div>

    </div>
</template>

<script>
import { nextTick } from 'vue'
import { RouterLink } from 'vue-router';

export default {
    components: {
    },
    data() {
        return {
            loading: true
        }
    },
    methods: {
        async fetchData() {
            const url = `${window.location.origin}/api/matches`
            const response = await fetch(url)
            const data = await response.json()
            this.matches = data.matches.reverse();
            //this.matches;
            console.log(data)
        },
        scrollNextMatch() {
            //document.querySelector("#app > div > main > div > div > div").scrollTo(0,0)
            // Get container 
            const scrollview = this.$refs.container.children[0]

            // Get the first next match
            for (let i = this.matches.length - 1; i > 0; i--) {
                const match = this.matches[i]
                // console.log(match)
                // console.log(match.status)
                if (match.status != 'FINISHED') {
                    scrollview.children[i].scrollIntoView()
                    break
                }
            }
        },
        formatDate(utcDate) {
            const date = new Date(utcDate)
            const locale = "nl-nl"

            const day = date.toLocaleString(locale, { day: "2-digit" })
            const month = date.toLocaleString(locale, { month: "short" }).toUpperCase();
            return `${day} ${month}`
        }
    },
    async created() {
        this.loading = true
        await this.fetchData()
        this.loading = false
        await nextTick()

        this.scrollNextMatch()
    }
}
</script>