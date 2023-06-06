<template>
  <div class="product">
    <br />
    <h5 v-if="filmotheque.length < 1">Aucun film dans votre filmothèque !</h5>
    <div id="table" v-for="(data, index) in filmotheque" :key="index">
      <UnFilm :film="data" :id="index" />
    </div>
    <br>
  </div>
</template>

<script>
import UnFilm from './UnFilm.vue'

const filmothequeBase = [];
var db;
var request = window.indexedDB.open("Filmotheque", 1);
request.onerror = function(event) {
  alert("impossible d'accéder a la base de donnée");
};
request.onsuccess = function(event) {
  db = event.target.result;
};
request.onupgradeneeded = function(event) {
  const db = event.target.result;
  const objectStore = db.createObjectStore("Filmotheque", { keyPath: "Nom" });
  objectStore.transaction.oncomplete = function(event) {
    let customerObjectStore = db
      .transaction("Filmotheque", "readwrite")
      .objectStore("Filmotheque");
    for (let item in filmothequeBase) {
      customerObjectStore.add(filmothequeBase[item]);
    }
  };
};

export default {
  components: {
    UnFilm
  },
  data() {
    return {
      filmotheque: []
    };
  },
  created() {
    this.filmotheque = this.$store.getters.lafilmotheque;
    console.log(this.filmotheque);
  },
  mounted() {
    this.readAll();
  },
  methods: {
    readAll() {
      let vm = this;
      if (vm.$store.state.filmotheque.length > 0){
        return;
      }
      try {
        const objectStore = db
          .transaction("Filmotheque", "readwrite")
          .objectStore("Filmotheque");
        if (objectStore) {
          objectStore.openCursor().onsuccess = function(event) {
            const cursor = event.target.result;
            if (cursor) {
              if (vm.$store.state.filmotheque) {
                vm.$store.state.filmotheque.push({
                  Nom: cursor.value.Nom,
                  UrlCover: cursor.value.UrlCover,
                 // Annee: cursor.value.Annee,
                  Synopsis: cursor.value.Synopsis,
                 Realisateur: cursor.value.Realisateur,
                 ActeursPrincip: cursor.value.ActeursPrincip,
                  Note: cursor.value.Note,
                  Commentaire: cursor.value.Commentaire
                });
              }

              cursor.continue();
            }
          };
        }
      } catch (e) {
        vm.retryDisp()
      }
    },
    retryDisp() {
      var vm = this
      if( ++vm.retryCount > 5 ) {
        console.log('Cannot open the database after 5 retries');
        vm.readAll();
      }
      setTimeout(function(){ vm.readAll() }, 100);
    }
  }
};
</script>

<style scoped>
#table {
  border: 2px solid #17a2b8;
  border-radius: 5px;
  display: inline-block;
  height: 420px;
  margin: 0 2em 2em 2em;
  font-size: 18px;
  padding: 15px;
}
@media screen and (max-width: 736px) {
  #table{
    height: auto;
  }
}
</style>
