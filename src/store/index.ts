import Vuex from "vuex";

const store = new Vuex.Store({
  state: {
    token: "",
    isAuthenticated: false,
  },
  mutations: {
    initializeStore(state) {
      if (!localStorage.getItem("token")) {
        state.token = "";
        state.isAuthenticated = false;
      } else {
        state.token = localStorage.getItem("token") || "";
        state.isAuthenticated = true;
      }
    },
    setToken(state, token) {
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem("token", token);
    },
    logout(state) {
      state.token = "";
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
    isLoggedIn(state, router) {
      if (
        localStorage.getItem("token") === "" ||
        !localStorage.getItem("token")
      ) {
        router.push("/");
      }
    },
  },
  actions: {},
  modules: {},
});

export default store;
