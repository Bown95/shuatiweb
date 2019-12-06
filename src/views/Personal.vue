<template>
  <div class="information">
    <div class="header">
      <div class="header_left">
        <img :src="logo" alt />
        <p>星火刷题</p>
      </div>
      <drmenu></drmenu>
    </div>
    <div class="article">
      <div>
        <div class="nav">
          <div class="nav_portrait">
            <div>
              <img
                :src="headportrait"
                v-if="
                  this.getuser.headurl != null && this.getuser.headurl != 'null'
                "
              />
              <img :src="userlogo" v-else />
            </div>
            <div>
              <p>{{ username }}</p>
            </div>
          </div>
          <div class="nav_form">
            <div :class="{ bule: tabIndex == 0 }" @click="getnav(0)">
              <img :src="details_i" v-if="tabIndex != 0" />
              <img :src="details_s" v-else />
              <span>我的信息</span>
            </div>
            <div :class="{ bule: tabIndex == 1 }" @click="getnav(1)">
              <img :src="record_i" v-if="tabIndex != 1" />
              <img :src="record_s" v-else />
              <span>我的记录</span>
            </div>
            <div :class="{ bule: tabIndex == 2 }" @click="getnav(2)">
              <img :src="mistakes_i" v-if="tabIndex != 2" />
              <img :src="mistakes_s" v-else />
              <span>我的错题</span>
            </div>
            <div :class="{ bule: tabIndex == 3 }" @click="getnav(3)">
              <img :src="password_i" v-if="tabIndex != 3" />
              <img :src="password_s" v-else />
              <span>更改密码</span>
            </div>
          </div>
        </div>
        <div class="aside">
          <router-view />
        </div>
      </div>
    </div>
    <div class="footer">
      <p>技术支持：河南星火燎原软件科技股份有限公司</p>
    </div>
  </div>
</template>

<script>
import drmenu from "@/components/menu.vue";
export default {
  components: {
    drmenu
  },
  data: function() {
    return {
      logo: require("@/assets/img/personal/logo.png"),
      username: "",
      headportrait: "", // 用户头像
      userlogo: require("@/assets/img/personal/userlogo.png"), //默认头像
      crown: require("@/assets/img/personal/crown.png"),
      details_i: require("@/assets/img/personal/details_i.png"),
      details_s: require("@/assets/img/personal/details_s.png"),
      record_i: require("@/assets/img/personal/record_i.png"),
      record_s: require("@/assets/img/personal/record_s.png"),
      mistakes_i: require("@/assets/img/personal/mistakes_i.png"),
      mistakes_s: require("@/assets/img/personal/mistakes_s.png"),
      password_i: require("@/assets/img/personal/password_i.png"),
      password_s: require("@/assets/img/personal/password_s.png"),
      tabIndex: 0
    };
  },
  computed: {
    getuser: function() {
      return this.$store.getters.get_user;
    }
  },
  mounted() {
    this.getuserimg();
    this.menuList();
    // window.removeEventListener("scroll", this.scrollToTop); //删除监听页面滚动事件
  },
  watch: {
    // 路由监听
    $route: "menuList"
  },
  methods: {
    getuserimg: function() {
      this.username = this.getuser.username;
      if (this.getuser.headurl != null && this.getuser.headurl != "null") {
        this.headportrait = this.$api.showImageUrl + this.getuser.headurl; // 保存头像
      }
    },
    getnav: function(index) {
      this.tabIndex = index;
      if (index == 0) {
        this.$router.replace("/personal/personal_details");
      } else if (index == 1) {
        this.$router.replace("/personal/personal_record");
      } else if (index == 2) {
        this.$router.replace("/personal/personal_mistakes");
      } else if (index == 3) {
        this.$router.replace("/personal/personal_password");
      }
    },
    menuList: function() {
      // 这个方法里定义好，高亮和路由
      let path = this.$route.matched[1].path; // 获取到地址拦上#号后面的url地址

      if (path.indexOf("/personal/personal_details") == 0) {
        // 是否包含，0以上是包含
        this.tabIndex = 0;
      } else if (path.indexOf("/personal/personal_record") == 0) {
        this.tabIndex = 1;
      } else if (path.indexOf("/personal/personal_mistakes") == 0) {
        this.tabIndex = 2;
      } else if (path.indexOf("/personal/personal_password") == 0) {
        this.tabIndex = 3;
      }
    }
  }
};
</script>

<style scoped>
.information {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
}
/* 顶部 */
.header {
  display: flex;
  /* flex: 2; */
  /* flex: 2.5; */
  height: 8%;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
}
.header {
  padding: 1rem 10rem;
}
.header_left {
  display: flex;
  align-items: center;
}
.header_left p {
  color: #1c7bf1;
  font-size: 1.5rem;
  letter-spacing: 0.5rem;
  /* font-weight: 700; */
  font-family: FZZZHONGJW--GB1-0;
}
.header_left img {
  max-height: 3rem;
}

/* 中间 */
.article {
  width: 100%;
  /* flex: 32; */
  /* flex: 25; */
  height: 90%;
  padding: 1.5rem 0;
  /* height: 100%; */
  background-color: #f4f7f9;
}
.article > div {
  height: 100%;
  margin: 0 9rem;
  display: flex;
  justify-content: space-around;
}
.article > div > div {
  height: 100%;
}
.nav {
  display: flex;
  flex-direction: column;
  width: 18%;
  background-color: #fff;
  border: 1px solid #e6e6e6;
  box-shadow: 0px 0px 8px 0px rgba(223, 223, 223, 0.61);
}
.nav_portrait {
  display: flex;
  flex: 1;
  border-bottom: 1px solid #e6e6e6;
  justify-content: space-around;
}
.nav_portrait > div {
  display: flex;
  color: #666666;
  /* margin: 2rem; */
  width: 50%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.nav_portrait > div > div {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;

  /* justify-content: center; */
}
.nav_portrait > div > img {
  max-width: 6rem;
  max-height: 6rem;

  /* height: 70%; */
}
.nav_portrait > div > p {
  max-width: 6rem;
  max-height: 6rem;
  font-size: 1.2rem;
  margin-top: 0.5rem;
  letter-spacing: 1px;
  /* 自动换行 */
  word-wrap: break-word;
  /* 字体超如隐藏省略 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: Adobe Heiti Std R;
}
.nav_portrait > div > div > p {
  display: inline-block;
  font-size: 1.7rem;
}
.nav_portrait > div > div > img {
  height: 80%;
}
.nav_form {
  flex: 5;
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
}
.nav_form > div {
  display: flex;
  /* 鼠标移入变小手 */
  cursor: pointer;
  padding: 0 1.5rem;
  height: 3rem;
  color: #333333;
  font-size: 1.3rem;
  align-items: center;
  margin: 1rem 0;
}
/* nva 蓝色选中框 */
.bule {
  color: #fff !important;
  background-color: #4f93fe;
}
.nav_form > div > span {
  margin-left: 1rem;
}
.aside {
  width: 80%;
  overflow: auto;
  position: relative;
  background-color: #fff;
  border: 1px solid rgba(227, 227, 227, 1);
  box-shadow: 0px 0px 8px 0px rgba(223, 223, 223, 0.61);
}
/* 底部 */
.footer {
  /* flex: 1; */
  /* flex: 1; */
  height: 2%;
  display: flex;
  color: #fff;
  font-size: 1rem;
  align-items: center;
  justify-content: center;
  font-family: "MicrosoftYaHei";
  background-color: #aaa;
}
</style>
