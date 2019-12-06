<template>
  <div class="main">
    <h2>专业高效刷题更轻松</h2>
    <div class="form">
      <div class="img">
        <img :src="shuatiimg" alt />
      </div>
      <div class="login">
        <div class="login_identity">
          <img :src="userimg" alt />
          <input
            v-model="user"
            type="text"
            placeholder="请输入您的身份证"
            onkeyup="value=this.value.replace(/[\W]/g,'')"
          />
        </div>
        <div class="login_password">
          <img :src="passwordimg" alt />
          <input
            v-model="password"
            :type="inputs"
            placeholder="请输入您的密码"
            @keyup.enter="login"
            onkeyup="value=this.value.replace(/[\W]/g,'')"
          />
          <i class="iconfont" @click="ico" v-if="inputs == 'password'"
            >&#xe61f;</i
          >
          <i class="iconfont" @click="ico" v-else>&#xe677;</i>
        </div>

        <div class="login_login">
          <Button
            type="primary"
            :loading="btnloading"
            @click="login"
            class="student_login"
            >登录</Button
          >
          <span href class="admin_login" @click="admin_login_action"
            >管理入口</span
          >
        </div>
      </div>
    </div>
    <div class="assistance">
      <p>技术支持: 河南星火燎原软件科技股份有限公司</p>
    </div>
  </div>
</template>

<script>
import { setTimeout } from "timers";
import "@/assets/iconfont.css";
export default {
  data: function() {
    return {
      btnloading: false,
      inputs: "password",
      shuatiimg: require("../assets/img/login/shuati.png"),
      userimg: require("../assets/img/login/username.png"),
      passwordimg: require("../assets/img/login/password.png"),
      user: "",
      password: ""
    };
  },
  mounted() {},
  methods: {
    ico: function() {
      this.inputs == "password"
        ? (this.inputs = "text")
        : (this.inputs = "password");
    },
    login: function() {
      if (this.user == "") {
        this.$Message.error("账号输入有误!");
      } else if (this.password == "") {
        this.$Message.error("密码输入有误!");
      } else if (this.user.length > 20) {
        this.$Message.error("账号长度有误!");
      } else if (this.password.length > 16) {
        this.$Message.error("密码长度有误!");
      } else {
        this.btnloading = true;
        var that = this;
        this.axios
          .post(this.$api.user_login_user, {
            loginname: this.user,
            loginpwd: this.password
          })
          .then(function(data) {
            if (data.code == 0) {
              localStorage.clear();
              // 先清除用户信息
              that.$Message.success(data.msg);
              that.$store.commit("error", null);
              // 清空后添加新值
              that.$store.commit("loginuser", data.obj);
              that.$router.push("settings");
            } else {
              that.$Message.error(data.msg); // 请求失败后的友好提示
            }
            setTimeout(() => {
              that.btnloading = false;
            }, 1000);
          })
          .catch(function() {
            that.btnloading = false;
            that.$Message.error("网络遇到问题,请重试!"); // 请求失败后的友好提示
          });
      }
    },
    admin_login_action: function() {
      window.location.href = this.$api.adminUrl;
    }
  }
};
</script>

<style scoped>
.iconfont {
  /* 鼠标移入变小手 */
  cursor: pointer;
  font-size: 2rem;
  /* 限制不可选中 */
  -webkit-user-select: none; /*谷歌 /Chrome*/
  -moz-user-select: none; /*火狐/Firefox*/
  -ms-user-select: none; /*IE 10+*/
  user-select: none;
}
.main {
  width: 100%;
  height: 100%;
  background: url("../assets/img/bg.png") no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center; /* 垂直居中 */
}

.main > h2 {
  /* text-align: center; */
  font-family: FZZZHONGJW--GB1-0;
  font-size: 5rem;
  font-stretch: normal;
  letter-spacing: 0.4rem;
  color: #1c7bf1;
  padding: 5rem 0 2rem;
}

.form {
  width: 63.9rem;
  /* height: 100%; */
  height: 30rem;
  /* margin: auto; */
  /* 倒圆角 */
  border-radius: 1.9rem;
  /* 边框阴影 */
  box-shadow: 0rem 0rem 0.9rem 0rem rgba(0, 0, 0, 0.1);
  /* position: relative; */
  display: flex;
  align-items: flex-start;
}

/* 左--图片 */
.img {
  flex: 1;
  /* max-height: 28rem; */
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  /* justify-content: center; */
}

.img > img {
  /* width: 100%; */
}

/* 右--登录 */
.login {
  flex: 1;
  height: 100%;
  /* height: 28rem; */
  padding: 4rem 5rem 3rem 3rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.login .login_identity,
.login_password {
  display: inline-block;
  display: flex;
  align-items: center;
  border-bottom: 0.3rem solid #eee;
  padding: 0 1rem 1.2rem 1rem;
}
.login_password {
  margin-bottom: 1.2rem;
}

.login div:nth-child(3) {
  border-bottom: none;
  padding: 0;
}

/* 登录输入框 */
.form input {
  margin-left: 1.4rem;
  width: 22rem;
  font-family: MicrosoftYaHei;
  font-size: 2rem;
  font-weight: 400;
  font-stretch: normal;
  line-height: 2.6rem;
  letter-spacing: 0;
  color: #333;
  /* 关闭默认样式 */
  border: none;
  outline: none;
}

/* 登录按钮 */
.student_login {
  width: 26rem;
  height: 5rem;
  padding: 0 !important;
  background-color: #4f93fe;
  border-radius: 1rem;
  border: none;
  outline: none;
  cursor: pointer;
  /* font-family: MicrosoftYaHei; */
  font-size: 2.5rem;
  font-weight: 400;
  font-stretch: normal;
  letter-spacing: 0.4rem;
  color: #fff;
}
.assistance {
  padding: 2rem 0;
  text-align: center;
  font-family: MicrosoftYaHei;
  font-size: 1.1rem;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0.1rem;
  color: #333333;
}
.login_login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.admin_login {
  display: block;
  font-family: MicrosoftYaHei;
  width: 100%;
  text-align: center;
  height: 30px;
  line-height: 30px;
  font-size: 18px;
  margin-top: 15px;
  cursor: pointer;
  color: #4f93fe;
}
</style>
