export default {
  async getMovieByTitle({ commit, getters }, title) {
    const movie = getters.findMovieByTitle(title)
    const currentMovie = getters.current
    if (!currentMovie || (currentMovie && movie.id !== currentMovie.id)) {
      try {
        const fullMovie = await this.$axios.$get(`/movies/${movie.id}`)
        commit('setCurrent', fullMovie)
      } catch (e) {
        commit('setCurrent', null)
      }
    }
  },
  deleteMovie({ dispatch }, id) {
    return this.$axios.delete(`/movies/${id}`).then(() => {
      return dispatch('updateListAfterRemoval', id)
    })
  },
  async updateListAfterRemoval({ commit, getters }, removed) {
    const updatedMovies = getters['list'].filter(m => m.id !== removed)
    commit('setMovies', updatedMovies)
  },
  async updateListAfterUpdate({ commit, getters } ,updatedMovie){
    const updatedMovies = getters['list'].map(m => {
      if(m.id===updatedMovie.id){
        m = updatedMovie;
        //FIX missing associations in updatedMovie
        // poster
        // story_origin
        // type
        // set_in_place
        // set_in_time
        // genres
        // producers
        // languages
        // restrictions
        // characters
        // directors
        // writers

      }
      return m;
    });
    commit('setMovies', updatedMovies)
    return updatedMovie;
  },
  updateMovie({ dispatch }, {id, updates}){
    return this.$axios.post(`/movies/${id}`, updates).then(({data}) => {
      return dispatch('updateListAfterUpdate', data.updated)
    })
  }
}
