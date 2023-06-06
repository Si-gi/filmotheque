import Vue from 'vue'
import Router from 'vue-router'
import AjouterFilm from './views/AjouterFilm.vue'
import details from './components/details.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/ajouterFilm',
      name: 'AjouterFilm',
      component: AjouterFilm
    },
    {
      path: '/ListeFilm',
      name: 'ListeFilm',
      component: () => import('./views/ListeFilm.vue')
    },
    {
      path: '/details/:idFilm',
      name: 'details',
      component: details
    },
    {
      path: '/',
      name: 'Accueil',
      component: () => import('./views/Accueil.vue')
    }
  ]
})
