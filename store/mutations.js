export default {
  setList (state, list) {
    const key = Object.keys(list)[0];
    if (list.module) {
      state[list.module][key] = list[Object.keys(list)[0]];
    } else {
      state[key] = list[Object.keys(list)[0]];
    }
  }
}
