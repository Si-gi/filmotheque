<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <Accueil msg="Welcome to Your Vue.js App"/>

  </div>
</template>

<script>
// @ is an alias to /src
import Accueil from '@/components/Accueil.vue'

export default {
  name: 'home',
  components: {
    Accueil
  }
}
</script>
