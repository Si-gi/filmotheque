<template>
  <div class="details">
    <div v-if="!success" class="container">
      <div id="cover">
        <b-img :src="image" rounded alt="aucune affiche disponible"/>
      </div>
      <div style="float: right; margin: 0 25px 0 25px; max-width: 400px;">
        <h4>{{ title }}</h4>
        <p>{{ annee }}</p>
        <p>
          <u>Réalisateur:</u>
          {{ realisateur }}
        </p>
        <p>
          <u>Acteurs principaux:</u>
          {{ acteur }}
        </p>
        <p>
          <u>Synopsis:</u>
          {{ overview }}
        </p>
      </div>
      <b-form @submit.prevent="addMovie">
        <b-form-input v-model="commentaire" placeholder="Commentaire (facultatif)" type="text"/>
        <div class="rate">
          <input type="radio" id="star5" name="rate" value="5">
          <label v-on:click="note = 5" for="star5">5 stars</label>
          <input type="radio" id="star4" name="rate" value="4">
          <label v-on:click="note = 4" for="star4">4 stars</label>
          <input type="radio" id="star3" name="rate" value="3">
          <label v-on:click="note = 3" for="star3">3 stars</label>
          <input type="radio" id="star2" name="rate" value="2">
          <label v-on:click="note = 2" for="star2">2 stars</label>
          <input type="radio" id="star1" name="rate" value="1">
          <label v-on:click="note = 1" for="star1">1 star</label>
        </div><br />
        <b-button style="margin-right: 10px;" type="submit" variant="primary">Ajouter ce film a ma filmothèque</b-button>
        <b-button variant="danger" v-on:click="noGoodMovie" to="/ajouterFilm">Annuler</b-button>
      </b-form>
    </div>
    <h5 v-if="success" type="error" style="margin-top: 5em;">Votre film a bien été ajouté ! Rendez-vous dans l'onglet "votre filmothèque" !</h5>

  </div>

</template>

<script>
import axios from "axios";

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
  name: "details",
  data() {
    return {
      title: "",
      image: "",
      reponse: "",
      overview: "",
      annee: "",
      alert: false,
      checkFilm: false,
      film: "",
      commentaire: "",
      note: 0,
      success: false,
      filmotheque: [],
      acteur: "",
      realisateur: "",
    };
  },
  mounted: function() {
    this.getData();
    this.getCrew();
  },
  methods: {
    getData() {
      axios
        .get(
          `https://api.themoviedb.org/3/movie/${
            this.$route.params.idFilm
          }?api_key=79f4cf54cc0396bfe9afeec97dd94234&language=en-US`
        )
        .then(response => {
          this.reponse = response;
          this.title = response.data.original_title;
          this.image = "http://image.tmdb.org/t/p/w185" + response.data.poster_path;
          this.overview = response.data.overview;
          this.annee = response.data.release_date;
          //this.realisateur = response.data.;
          //this.note = response.data.vote_average;
        })
      axios.get(`https://api.themoviedb.org/3/movie/${this.$route.params.idFilm}/translations?api_key=79f4cf54cc0396bfe9afeec97dd94234`)
              .then(reponse => {
                if(reponse.data.translations[42].name=="Français"){
                  this.overview = reponse.data.translations[42].data.overview;
                }
              })
    },
    getCrew(){
      axios.get(
              `https://api.themoviedb.org/3/movie/${
                      this.$route.params.idFilm
                      }/credits?api_key=79f4cf54cc0396bfe9afeec97dd94234`
      ).then(response => {
        this.acteur = response.data.cast[0].name;
        this.realisateur = response.data.crew[0].name;
      })
    },
    submit() {
      this.checkFilm = true;
    },
    noGoodMovie() {
      this.success = false;
      this.titre = "";
      this.commentaire = "";
      this.note = 0;
      this.checkFilm = false;
    },
    addMovie() {
      //Ajout dans l'indexed DB
      let request = new Promise((resolve, reject) => {
        let request = db
          .transaction("Filmotheque", "readwrite")
          .objectStore("Filmotheque")
          .add({
            Nom: this.title,
            UrlCover: this.image,
            Annee: this.annee,
            Synopsis: this.overview,
            Realisateur: this.realisateur,
            ActeursPrincip: this.acteur,
            Note: this.note,
            Commentaire: this.commentaire
          });
        request.onerror = function(event) {
          alert("Erreur ! :( Ce film est déja présent dans votre filmothèque ! Retour a la page d'accueil.");
          location.replace("../");
        };
      });
      //Ajout dans le store
      this.$store.state.filmotheque.push({
        Nom: this.title,
        UrlCover: this.image,
        Annee: this.annee,
        Synopsis: this.overview,
        Realisateur: this.realisateur,
        ActeursPrincip: this.acteur,
        Note: this.note,
        Commentaire: this.commentaire
      });
      this.success = true;
      this.title = "";
      this.commentaire = "";
      this.note = 0;
      this.checkFilm = false;
      return;
    }
  }
};
</script>

<style scoped>
.container {
  margin-top: 2em;
  width: 700px;
}
#cover {
  float: left;
  margin-bottom: 1em;
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
  width: 200px;
  height: 46px;
  margin: auto;
}
.rate:not(:checked) > input {
  position: absolute;
  top: -9999px;
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
.rate > input:checked ~ label {
  color: #ffc700;
}
.rate:not(:checked) > label:hover,
.rate:not(:checked) > label:hover ~ label {
  color: #deb217;
}
.rate > input:checked + label:hover,
.rate > input:checked + label:hover ~ label,
.rate > input:checked ~ label:hover,
.rate > input:checked ~ label:hover ~ label,
.rate > label:hover ~ input:checked ~ label {
  color: #c59b08;
}

/* Modified from: https://github.com/mukulkant/Star-rating-using-pure-css */
</style>