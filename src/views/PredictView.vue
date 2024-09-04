<template>
    <transition name="fade">
        <div v-if="loading" class="w-1/2">
            <div class="skeleton h-10 w-full mb-5"></div>
            <div class="skeleton h-10 w-full mb-5"></div>
            <div class="skeleton h-10 w-full"></div>
        </div>
    </transition>
    <transition name="fade">
        <div v-if="!loading">
            <PredictViewMatchComponent v-for="match in matches" class="mb-3" :match="match" />
        </div>
    </transition>
</template>

<script>
    import PredictViewMatchComponent from '../components/PredictViewMatchComponent.vue'

    export default {
        components: {
            PredictViewMatchComponent
        },
        data: function () {
            return {
                matches: [],
                loading: true
            }
        },
        methods: {
            async fetchData() {
                const url = `${window.location.origin}/api/matches`
                const user = this.$store.getters.userData;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user: user })
                });
                const data = await response.json()
                this.matches = data.reverse();
                this.loading = false;
            }
        },
        async created() {
            await this.fetchData()
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