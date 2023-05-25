import { createStore } from 'vuex'

export default createStore({
  state: {
    token: localStorage.getItem('token-mcapital') || '',
    itemSelected: 'main'
  },
  mutations: {
    loginSuccess (state, data) {
      localStorage.setItem('token-mcapital', data.token)
      state.token = data.token
    },
    logout (state) {
      localStorage.removeItem('token-mcapital')
      state.token = ''
    },
    selectItem (state, item) {
      state.itemSelected = item
    },
  },
  actions: {

  }
})
