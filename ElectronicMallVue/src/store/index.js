/*
 * @Description: 
 * @Author: Rabbiter
 * @Date: 2023-03-26 15:27:05
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    baseApi: process.env.VUE_APP_RESOURCE_BASE_URL || "/api",
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
