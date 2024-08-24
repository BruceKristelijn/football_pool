<template>
    <RouterLink :to="'/pool/' + pool.id">
        {{ pool.name }}
        <div class="avatar-group -space-x-6 rtl:space-x-reverse">
            <div class="avatar" v-for="user in pool.users">
                <div class="w-8">
                    <img :src="user.image_url" />
                </div>
            </div>
        </div>
    </RouterLink>
</template>

<script>
    export default {
        props: ['pool'],
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