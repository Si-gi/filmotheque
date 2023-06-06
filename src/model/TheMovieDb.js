import axios from 'axios';

export default class TheMovieDb {



    static getFilms(nom) {
        if (isNaN(nom)) {
            axios.get(`https://api.themoviedb.org/3/search/movie?api_key=79f4cf54cc0396bfe9afeec97dd94234&language=en-US&query=${nom}`)
                .then((response) => {
                    //let json = response;
                    let Listfilm = [];
                    console.log(Listfilm)
                    if (response.data.page != 0) {
                        for (let element of response.data.results) {
                            //   console.log(element.title);
                            let film = {
                                "title": element.title,
                                "overview": element.overview,
                                "id": element.id,
                                "Ajouter": "+",
                            };
                            Listfilm.push(film);
                        }
                    } else {
                        let alerte = true;
                        return alerte
                    }
                })
        }
    }

    static readAll() {
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
                                // Realisateur: cursor.value.Realisateur,
                                // ActeursPrincip: cursor.value.ActeursPrincip,
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
    }
    static addMovie() {
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
                    //Realisateur: "this.film.Realisateur",
                    //ActeursPrincip: "this.film.ActeursPrincip",
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
            //Realisateur: "this.filmRealisateur",
            //ActeursPrincip: "this.film.ActeursPrincip",
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