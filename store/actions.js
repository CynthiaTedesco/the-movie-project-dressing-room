import Cookie from 'js-cookie'

export default {
  async nuxtServerInit(vuexContext, context) {
    let movies = await context.app.$axios.$get('/movies')
    movies = await Promise.all(movies.map(movie => {
      return context.app.$axios.$get(`/movies/${movie.id}`);
    }));
    await vuexContext.commit('movies/setMovies', movies)
  },
  authenticateUser(vuexContext, authData) {
    let authUrl = '/login'
    //   'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' +
    //   process.env.fbAPIKey
    // if (!authData.isLogin) {
    // authUrl =
    //   'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' +
    //   process.env.fbAPIKey
    // }
    return this.$axios
      .$post(authUrl, {
        username: authData.username,
        password: authData.password
      })
      .then(result => {
        if (result.token) {
          vuexContext.commit('setToken', result.token)
          localStorage.setItem('token', result.token)
          localStorage.setItem(
            'tokenExpiration',
            new Date().getTime() + Number.parseInt(result.expiresIn) * 1000
          )
          Cookie.set('jwt', result.token)
          Cookie.set(
            'expirationDate',
            new Date().getTime() + Number.parseInt(result.expiresIn) * 1000
          )
        }
      })
      .catch(e => console.log(e))
  },
  initAuth(vuexContext, req) {
    let token
    let expirationDate
    if (req) {
      if (!req.headers.cookie) {
        return
      }
      const jwtCookie = req.headers.cookie
      .split(';')
      .find(c => c.trim().startsWith('jwt='))
      if (!jwtCookie) {
        return
      }
      token = jwtCookie.split('=')[1]
      expirationDate = req.headers.cookie
        .split(';')
        .find(c => c.trim().startsWith('expirationDate='))
        .split('=')[1]
    } else {
      token = localStorage.getItem('token')
      expirationDate = localStorage.getItem('tokenExpiration')
    }
    if (new Date().getTime() > +expirationDate || !token) {
      console.log('No token or invalid token')
      vuexContext.dispatch('logout')
      return
    }
    vuexContext.commit('setToken', token)
  },
  logout(vuexContext) {
    vuexContext.commit('clearToken')
    Cookie.remove('jwt')
    Cookie.remove('expirationDate')
    if (process.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('tokenExpiration')
    }
  }
}
