<template>
  <div class="Accueil">
    <h1>{{ msg }}</h1>
    <b-container class="bv-example-row">
      <b-row>
        <b-col sm="12">
          <b-alert :value="alert" type="error">
            Aucun film trouvé !
          </b-alert>
        </b-col>
        <b-col sm="12">
          <b-card class="text-center">
            <b-card-title style="max-width: 20rem;" class="mb-2">
              Recherche un film
            </b-card-title>
            <b-card-text>
              <b-form @submit.prevent="submit">
                <b-form-input
                        v-model="nom"
                        placeholder="Entrez le nom et appuyez sur 'Entrée'"
                />
                <br />
                <b-button type="submit" variant="primary">Submit</b-button>
              </b-form>
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
{{ListFav}}
    <table>
      <thead>
      <tr>
        <th>Titre</th>
        <th>Résumé</th>
        <th>voir plus</th>
        <th>Ajouter</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(prod, index) in Listfilm" :key='index'>
        <td>
          {{prod.title}}
        </td>
        <td>
          {{prod.overview}}
        </td>
        <td  @click="goTodetail(prod.id)">
          voir plus
        </td>
        <td >
          <button @click="addToFav(prod.id)">+</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  //import axios from 'axios';
  import TheMovieDb from '@/model/TheMovieDb.js'
export default {
  data() {
    return {
      nom: "",
      alert: false,
      Listfilm: [],
      json: "",
      ListFav: [],
      newFav: null,
    };
  },
  mounted(){
    if(localStorage.getItem('ListFav')) {
      try {
        this.ListFav = JSON.parse(localStorage.getItem('ListFav'));
      } catch(e) {
        localStorage.removeItem('ListFav');
      }
    }
  },
  methods: {
    submit() {
      if (isNaN(this.nom)) {
       console.log(this.nom);
       console.log(this.Listfilm)
        this.Listfilm = TheMovieDb.getFilms(this.nom);
        console.log(this.Listfilm);
      }
      /*

         console.log("isNaN"); //https://api.themoviedb.org/3/movie/550?api_key=79f4cf54cc0396bfe9afeec97dd94234

                .then((response) => {
                  this.json = response;
                  this.Listfilm = [];
                  if (response.data.page != 0) {
                    for (let element of response.data.results) {
                      //   console.log(element.title);
                      let film = {
                        "title": element.title,
                        "overview": element.overview,
                        "id": element.id,
                        "Ajouter": "+",
                      };
                      this.Listfilm.push(film);
                    }
                  } else {
                    this.alert = true;
                  }
                })

      */
    },
    goTodetail(idFilm) {
      this.$router.push({name: 'details', params: {idFilm: idFilm}})
    },
    addToFav(newFav) {
      this.newFav= newFav;
      this.ListFav.push(this.newFav);
      this.newFav = '';
      this.saveFavs();
    },
    saveFavs() {
      let parsed = JSON.stringify(this.listsFav);
      localStorage.setItem('ListFav', parsed);
    },
  },
  props: {
    msg: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
  color: #42b983;
}
</style>

