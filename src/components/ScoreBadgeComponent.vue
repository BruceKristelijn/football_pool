<template>
    <div class="badge p-4" :class="class">
        <p class="font-bold text-lg text-base-100 inline-flex">
            <span v-if="score > 0">+</span>
            <span v-else>-</span>
            {{ Math.abs(score) }}
        </p>
    </div>
</template>

<script>
    export default {
        props: ['score'],
        computed: {
            class() {
                return {
                    'badge-success': this.score > 0,
                    'badge-error': this.score < 0
                }
            }
        }
    }
</script>