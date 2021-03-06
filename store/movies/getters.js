export default {
  list(state) {
    return state.list
  },
  sortedList(state) {
    return (sortBy = 'revenue') => {
      // TODO extend this getter with sorting by different types of fields
      const list = [...state.list].filter(a=>!a.deletedAt)
      const sortedList = list.sort(
        (a, b) => -parseInt(a[sortBy]) + parseInt(b[sortBy])
      )
      return sortedList
    }
  },
  current(state) {
    return state.current
  },
  findMovieByTitle(state) {
    return title => state.list.find(item => item.title === title)
  },
  findMovieById(state) {
    return id => state.list.find(item => item.id === id)
  }
}
