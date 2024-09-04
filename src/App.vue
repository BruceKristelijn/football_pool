<script>
import NavBarComponent from './components/NavBarComponent.vue'

export default {
  components: {
    NavBarComponent
  }
}
</script>

<template>
  <div class="bg-gray-50 absolute inset-y-0 inset-x-0">
    <NavBarComponent v-if="$store.getters.userData != undefined" />
    <main class="flex justify-center my-5">
      <RouterView class="w-3/4" />
    </main>
  </div>
</template>

<style scoped>
</style>