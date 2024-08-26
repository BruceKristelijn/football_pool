<template>
    <div>
        <PredictViewMatchComponent class="mb-3" :match="{}" />
        <PredictViewMatchComponent class="mb-3" :match="{}" />
        <PredictViewMatchComponent class="mb-3" :match="{}" />
        <PredictViewMatchComponent class="mb-3" :match="{}" />
    </div>
</template>

<script>
import PredictViewMatchComponent from '../components/PredictViewMatchComponent.vue'

export default {
    async created() {
    },
    components: {
        PredictViewMatchComponent
    },
    methods: {
    }
}
</script>