import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate"; //插件 用来解决F5 刷新后 VUEX 数据的丢失

Vue.use(Vuex);

// export default new Vuex.Store({
//   state: {

//   },
//   mutations: {

//   },
//   actions: {

//   }
// })

const state = {
  //要设置的全局访问的state对象
  user: {}, // 用户信息
  is_paper: true, // 从哪个页面跳进来
  paper: {}, // 刷题试卷信息
  userpaper: {}, // 刷题试卷信息
  questions: {}, // 试卷
  generateType: 1 // 默认类型   同步
  //要设置的初始属性值
};
const getters = {
  //实时监听state值的变化(最新状态)  //方法名随意,主要是来承载变化的showFooter的值
  get_user(state) {
    // 登录信息
    return state.user;
  },
  get_is_paper(state) {
    return state.is_paper;
  },
  get_paper(state) {
    return state.paper;
  },
  get_userpaper(state) {
    return state.userpaper;
  },
  get_question(state) {
    return state.questions;
  },
  get_generateType(state) {
    return state.generateType;
  }
};
const mutations = {
  // 保存 用户信息
  loginuser(state, payload) {
    // 登录信息
    state.user = payload;
  },
  ispaper(state, payload) {
    // 试卷试题
    state.is_paper = payload;
  },
  paper(state, payload) {
    // 试卷试题
    state.paper = payload;
  },
  userpaper(state, payload) {
    // 试卷信息
    state.userpaper = payload;
  },
  question(state, payload) {
    // 试卷试题
    state.questions = payload;
  },
  generate(state, payload) {
    // 试卷试题
    state.generateType = payload;
  },
  error(state) {
    // 恢复默认值
    state.user = {}; // 用户信息
    state.is_paper = true; // 从哪个页面跳进来
    state.paper = {}; // 刷题试卷信息
    state.userpaper = {}; // 刷题试卷信息
    state.questions = {}; // 试卷
  }
};
const store = new Vuex.Store({
  state,
  getters,
  mutations,
  plugins: [createPersistedState()] // 插件
});

export default store;
