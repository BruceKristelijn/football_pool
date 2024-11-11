<template>
    <div>
        Meedoen aan pool...
    </div>
</template>

<script>
    export default {
        name: "JoinPoolView",
        async created() {
            const poolId = this.$route.params.id;

            try {
                // Simulate an API call to join the pool
                await this.joinPool(poolId);

                // On success, navigate to the pool page
                this.$router.push({ path: `/pool/${poolId}`, query: { joined: true } });

                // Show alert for joining the pool
                alert('Joined pool');
            } catch (error) {
                // Handle the error, e.g., show an error message
                alert('Failed to join pool: ' + error.message);
            }
        },
        methods: {
            async joinPool(poolId) {
                // Join pool using the url /api/pool/join/
                const url = window.origin + "/api/pool/join/";
                const user = this.$store.getters.userData;
                const userData = this.$store.getters.userData;
                const resp = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: poolId,
                        user: userData
                    })
                })

                const data = await resp.json();
            }
        }
    }
</script>