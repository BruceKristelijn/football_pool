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
    <main class="justify-center my-5 px-3">
      <RouterView class="" />
    </main>
  </div>
</template>

<style scoped>
</style>