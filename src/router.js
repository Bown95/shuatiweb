import Vue from "vue";
import Router from "vue-router";
import login from "@/views/Login.vue"; //登录
import settings from "@/views/Settings.vue"; //登录
import personal from "@/views/Personal.vue"; // 个人中心
import exercise_unfinished from "@/views/exercise_unfinished.vue"; // 刷题未完成
import exercise_accomplish from "@/views/exercise_accomplish.vue"; // 刷题已完成
import personal_details from "@/views/Personal/personal_details.vue"; //我的信息
import personal_record from "@/views/Personal/personal_record.vue"; //我的记录
import personal_mistakes from "@/views/Personal/personal_mistakes.vue"; //我的错题
import personal_password from "@/views/Personal/personal_password.vue"; //更改密码
// import Home from '@/views/Home.vue'    //主页

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "login",
      component: login
    },
    {
      path: "/settings",
      name: "settings",
      component: settings
    },
    {
      path: "/personal",
      name: "personal",
      component: personal,
      children: [
        // 子路由
        {
          path: "/personal/personal_details",
          name: "personal_details",
          component: personal_details
        },
        {
          path: "/personal/personal_record",
          name: "personal_record",
          component: personal_record
        },
        {
          path: "/personal/personal_mistakes",
          name: "personal_mistakes",
          component: personal_mistakes
        },
        {
          path: "/personal/personal_password",
          name: "personal_password",
          component: personal_password
        }
      ]
    },
    {
      path: "/exercise_unfinished",
      name: "exercise_unfinished",
      component: exercise_unfinished
    },
    {
      path: "/exercise_accomplish",
      name: "exercise_accomplish",
      component: exercise_accomplish
    }
  ]
});
