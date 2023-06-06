<template>
  <div id="UnFilm">
    <div id="cover">
      <b-img :src="film.UrlCover" rounded alt="Responsive image"/>
      <div v-for="x in 5-film.Note" v-bind:key="x" class="rate">
        <label></label>
      </div>
      <div v-for="x in film.Note" v-bind:key="x" class="rate">
        <label style="color: #17a2b8"></label>
      </div>
      <p v-if="film.Commentaire">{{ film.Commentaire.substring(0, 25) }}</p>
      <p v-else>Pas de commentaire</p>
    </div>
    <div style="float: right; margin: 0 25px 0 25px; max-width: 250px;">
      <img id="delete" v-on:click="remove(id, film.Nom)" src="../assets/delete.png" alt="Aucune affiche disponible pour ce film :(">
      <h4>{{ film.Nom }}</h4>
      <p style="text-align: center;">{{ film.Annee }}</p>
      <p>
        <u>Réalisateur:</u>
        {{ film.Realisateur }}
      </p>
      <p>
        <u>Acteurs principaux:</u>
        {{ film.ActeursPrincip }}
      </p>
      <p v-if="film.Synopsis.length >= 300">
        <u>Synopsis:</u>
        {{ film.Synopsis.substring(0,300) }}...
      </p>
      <p v-else>
        <u>Synopsis:</u>
        {{ film.Synopsis }}
      </p>
    </div>
  </div>
</template>

<script>
var db;
var request = window.indexedDB.open("Filmotheque", 1);
request.onerror = function(event) {
  alert("impossible d'accéder a la base de donnée");
};
request.onsuccess = function(event) {
  db = event.target.result;
};

export default {
  props: [
    "film",
    "id"
  ],
  methods: {
    remove(i, index) {
      //Remove from Store
      this.$store.commit("DELETE_PRODUIT", i); //ne fonctionne pas :(
      location.reload(); //Brutal
      //Remove from indexed DB
      var request = db
        .transaction("Filmotheque", "readwrite")
        .objectStore("Filmotheque")
        .delete(index);
    }
  }
};
</script>

<style scoped>
#UnFilm {
  width: 500px;
}

#delete {
  max-width: 32px;
  position: absolute;
  float: right;
  margin-left: 120px;
  cursor: pointer;
}
#cover {
  float: left;
}
#cover img {
  max-height: 300px;
  max-width: 200px;
}
@media screen and (max-width: 736px) {
  #cover {
    float: none;
  }
  h4 {
    margin-top: 10px;
  }
  .rate {
    margin-right: 300px;
  }
}
p {
  font-size: 14px;
}
.rate {
  margin-right: 20px;
}
.rate:not(:checked) > label {
  float: right;
  width: 1em;
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;
  font-size: 30px;
  color: #ccc;
}
.rate:not(:checked) > label:before {
  content: "★ ";
}
.rate:not(:checked) > label:hover {
  cursor: default;
}
</style>
