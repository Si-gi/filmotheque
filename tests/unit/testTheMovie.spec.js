import TheMovie from '@/model/TheMovieDb.js'
import axios from 'axios';

describe('list films', () => {
    it('render json list',() => {
        expect(TheMovie.getFilms("Fast and furios"),toMatch(axios.get(`https://api.themoviedb.org/3/search/movie?api_key=79f4cf54cc0396bfe9afeec97dd94234&language=en-US&query=Fastandfurios`)) )
    })
})

describe('favoris', () => {
    it('render json list',() => {
        expect(TheMovie.readAll(),toMatch(this.$store.state.filmotheque))
    })
})

describe('add favoris', () => {
    it('render json list',() => {
        expect(TheMovie.addMovie(),toMatch(return))
    })
})
