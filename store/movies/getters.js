export default {
  list (state) {
    return state.list;
  },
  sortedList (state) {
    return (sortBy = 'order') => {
      // TODO extend this getter with sorting by different types of fields
      const list = [ ...state.list ];
      const sortedList = list.sort((a, b) => a[sortBy] - b[sortBy]);
      return sortedList;
    }
  },
  current (state) {
    return state.current;
  },
  findMovieByTitle (state) {
    return (title) => (
      state.list.find(item => item.title === title)
    )
  },
  findMovieById (state) {
    return (id) => (
      state.list.find(item => item.id === id)
    )
  }
}
