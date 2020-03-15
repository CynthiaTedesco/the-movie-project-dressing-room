export default {
  async getMovieByTitle ({ commit, getters }, title) {
    const movie = getters.findMovieByTitle(title);
    const currentMovie = getters.current;
    if (!currentMovie || (currentMovie && movie.id !== currentMovie.id)) {
      try {
        const fullMovie = await this.$axios.$get(`/movies/${movie.id}`);
        commit('setCurrent', fullMovie);
      } catch (e) {
        commit('setCurrent', null);
      }
    }
  },
}
