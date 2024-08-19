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
    <NavBarComponent />
    <main class="flex justify-center my-5">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
</style>