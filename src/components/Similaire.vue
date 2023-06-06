<template>
<div>
    <p>test</p>
    <div v-for="film in Listfilm">
        {{prod.title}}
        <img :src="film.img">
    </div>
</div>
</template>
<script>
    import axios from 'axios';
    export default {
        data() {
            return {
                alert: false,
                Listfilm: [],
                json: "",
            };
        },
        mounted: {
            function() {
                this.getFilms();
            }
        },
        methods: {
            getFilms() {
                axios.get(`https://api.themoviedb.org/3/movie/${this.$route.params.idFilm}/similar?api_key=79f4cf54cc0396bfe9afeec97dd94234&language=en-US&page=1`)
                    .then((response) => {
                        this.json = response;
                        this.Listfilm = [];
                        if (response.data.page != 0) {
                            for (let element of response.data.results) {
                                //   console.log(element.title);
                                let film = {
                                    "img": "http://image.tmdb.org/t/p/w185"+element.backdrop_path,
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
            }
        },
    }
</script>

<style scoped>

</style>