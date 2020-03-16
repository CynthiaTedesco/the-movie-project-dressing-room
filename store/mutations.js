export default {
  setToken(state, token) {
    console.log('setToken', token)
    state.token = token
  },
  clearToken(state) {
    state.token = null
  }
}
