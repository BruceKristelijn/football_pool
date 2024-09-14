<template>
    <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Opkomende matches</h2>
          <MatchesComponent />
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