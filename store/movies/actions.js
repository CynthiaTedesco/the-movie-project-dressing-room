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
  }
}
