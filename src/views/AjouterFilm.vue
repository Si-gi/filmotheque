<template>
  <div class="home">
    <searchFilm />
  </div>
</template>

<script>
// @ is an alias to /src
import searchFilm from '@/components/searchFilm.vue'

export default {
  name: 'home',
  components: {
    searchFilm
  }
}
</script>
