<template>
  <div class="Accueil">
    <br>
    <b-container class="bv-example-row">
      <b-row>
        <b-col sm="12">
          <b-alert :value="alert" type="error">Aucun film trouvé !</b-alert>
        </b-col>
        <b-col sm="12">
          <b-card class="text-center" style="max-width: 800px; margin: auto;" v-if="!Listfilm.length">
            <b-card-title style="max-width: 20rem; margin: auto;" class="mb-2">Recherche un film</b-card-title>
            <b-card-text>
              <b-form @submit.prevent="submit">
                <b-form-input v-model="nom" placeholder="Fast and furious, tekken, intouchable..."/>
                <br>
                <b-button type="submit" variant="primary">Rechercher</b-button>
              </b-form>
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
    <div v-if="Listfilm.length">
      <h3>Résultat pour la recherche "{{ nom }}"</h3><br />
      <b-card class="text-center" style="max-width: 1000px; margin: auto;">
        <table>
          <thead>
            <tr>
              <th>Titre</th>
              <th>Résumé</th>
              <th>Ajouter</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(prod, index) in Listfilm" :key="index">
              <td>{{prod.title}}</td>
              <td>{{prod.overview}}</td>
              <td @click="goTodetail(prod.id)">
                <img style="max-width: 32px; cursor: pointer;" src="../assets/add.jpeg">
              </td>
            </tr>
          </tbody>
        </table>
        <h5>Vous n'avez pas trouver votre film ? Faite une <b-link style="color: #17a2b8 !important;" to="/ajouterFilm">nouvelle recherche</b-link> !</h5>
      </b-card> 
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      nom: "",
      id: "",
      alert: false,
      Listfilm: [],
      json: "",
      ListFav: []
    };
  },
  mounted() {
    if (localStorage.getItem("ListFav")) {
      try {
        this.ListFav = JSON.parse(localStorage.getItem("ListFav"));
      } catch (e) {
        localStorage.removeItem("ListFav");
      }
    }
  },
  methods: {
    submit() {
      if (isNaN(this.nom)) {
        axios
          .get(
            `https://api.themoviedb.org/3/search/movie?api_key=79f4cf54cc0396bfe9afeec97dd94234&language=en-US&query=${
              this.nom
            }`
          )
          .then(response => {
            this.json = response;
            this.Listfilm = [];
            if (response.data.page != 0) {
              for (let element of response.data.results) {
                //this.translate(element.id);
                let film = {
                  title: element.title,
                  overview: element.overview,
                  id: element.id,
                  Ajouter: "+"
                };
                this.Listfilm.push(film);
              }
            } else {
              this.alert = true;
            }
          })

      }
    },
    translate(id){
      axios.get(`https://api.themoviedb.org/3/movie/${id}/translations?api_key=79f4cf54cc0396bfe9afeec97dd94234`)
              .then(truc => {
                this.overview = truc;
                this.overview = truc.data.translations[42].data.overview;
              })
    },
    goTodetail(idFilm) {
      this.$router.push({ name: "details", params: { idFilm: idFilm } });
    },
    newSearch() {
      this.Listfilm = [];
    }
  },
  props: {
    msg: String
  }
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #17a2b8;
}
table {
  margin: 2em 2em 2em 2em;
}
td {
  height: 75px;
  border-bottom: 1px solid #17a2b8;
}
</style>

