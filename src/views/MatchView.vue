<template>
    <div class="flex flex-col">
        <div class="card bg-base-100 w-80 shadow-xl">
            <div class="card-body">
                <h2 class="card-title">Other matches</h2>
                <MatchesComponent />
            </div>

            <div class="card bg-base-100 w-80 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title">Other matches</h2>
                    <MatchesComponent />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import MatchesComponent from '../components/MatchesComponent.vue'

export default {
    components: {
        MatchesComponent
    }
}
</script>