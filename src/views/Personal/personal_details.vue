<template>
  <div class="portrait">
    <h3>个人信息</h3>
    <ul id="ul">
      <li>
        <span>头像:</span>
        <img :src="headimg" v-if="is_img" />
        <img :src="userlogo" v-else />
        <div @click="file">更换头像</div>
        <input
          type="file"
          ref="file"
          style="display: none"
          @change="img"
          accept="image/*"
        />
      </li>
      <li>
        <span>用户名:</span>
        <input type="text" placeholder="请输入用户名" v-model="form.name" />
      </li>
      <li>
        <span>性别:</span>
        <RadioGroup v-model="form.usersex">
          <Radio label="1">男</Radio>
          <Radio label="2">女</Radio>
        </RadioGroup>
      </li>
      <li>
        <span>爱好:</span>
        <input type="text" placeholder="请输入爱好" v-model="form.userlike" />
      </li>
      <li>
        <span>电话:</span>
        <input type="text" placeholder="请输入电话" v-model="form.userphone" />
      </li>
      <li>
        <span>邮箱:</span>
        <input type="text" placeholder="请输入邮箱" v-model="form.useremail" />
      </li>
    </ul>
    <div class="preserve">
      <Button type="primary" :loading="btnloading" @click="save">修改</Button>
    </div>
  </div>
</template>

<script>
import { setTimeout } from "timers";
export default {
  data: function() {
    return {
      btnloading: false,
      userlogo: require("@/assets/img/personal/userlogo.png"), //默认头像
      headimg: "",
      is_img: false, //是否显示默认头像
      form: {}
    };
  },
  inject: ["reload"], //注入刷新方法
  computed: {
    getuser: function() {
      return this.$store.getters.get_user;
    }
  },
  mounted() {
    if (this.getuser.headurl != null && this.getuser.headurl != "null") {
      this.is_img = true;
    } else {
      this.is_img = false;
    }
    //   document.getElementById("ul").style.height =
    //   document.body.clientHeight - 300 + "px";
    this.aa();
    // window.removeEventListener("scroll", this.scrollToTop); //删除监听页面滚动事件
  },
  methods: {
    aa: function() {
      this.headimg = this.$api.showImageUrl + this.getuser.headurl; // 保存头像
      if (this.getuser.headurl == null || this.getuser.headurl == "null") {
        this.form.headurl = null; // 保存头像原地址
      } else {
        this.form.headurl = this.getuser.headurl;
      }
      this.form.name = this.getuser.username; // 保存用户名
      this.form.usersex = this.getuser.usersex + ""; // 保存性别
      this.getuser.userlike == null || this.getuser.userlike == "null"
        ? (this.form.userlike = "")
        : (this.form.userlike = this.getuser.userlike); // 保存爱好
      this.getuser.userphone == null || this.getuser.userphone == "null"
        ? (this.form.userphone = "")
        : (this.form.userphone = this.getuser.userphone); // 保存手机
      this.getuser.useremail == null || this.getuser.useremail == "null"
        ? (this.form.useremail = "")
        : (this.form.useremail = this.getuser.useremail); // 保存手机
      // this.form.useremail = this.getuser.useremail; // 保存邮箱
      this.$forceUpdate();
    },
    file: function() {
      // 更换头像的方法
      this.$refs.file.click();
    },
    img: function(file) {
      this.form.file = file.target.files[0]; //保存当前图片
      var that = this;
      var reader = new FileReader();
      // 将图片将转成 base64 格式
      reader.readAsDataURL(file.target.files[0]);
      // 读取成功后的回调
      reader.onloadend = function() {
        that.is_img = true;
        that.headimg = this.result;
      };
    },
    save: function() {
      // 保存的方法
      // alert("保存成功")
      if (this.form.name.trim() == "") {
        this.$Message.error("用户名未输入!");
        // } else if (this.form.userlike.trim() == "") {
        //   this.$Message.error("爱好未输入!");
        // } else if (this.form.usersex != "1" && this.form.usersex != "2") {
        //   this.$Message.error("性别未选择!");
        // } else if (this.form.userphone.trim() == "") {
        //   this.$Message.error("手机未输入!");
        // } else if (this.form.useremail.trim() == "") {
        //   this.$Message.error("邮箱未输入!");
      } else {
        this.btnloading = true;
        var that = this;
        var url = this.$api.baseUrl + this.$api.user_update_user;
        var formData = new FormData();
        formData.append("userid", this.getuser.userid); //用户主键
        formData.append("schoolid", this.getuser.schoolid); // 学校ID
        formData.append("username", this.form.name); // 姓名
        formData.append("usersex", this.form.usersex); // 性别
        formData.append("userphone", this.form.userphone); // 手机
        formData.append("useremail", this.form.useremail); // 邮箱
        formData.append("userlike", this.form.userlike); // 爱好
        formData.append("headurl", this.form.headurl); // 头像原地址
        formData.append("file", this.form.file); // 头像
        // this.$router.push("/exercise_accomplish");
        var xhr = new XMLHttpRequest(); // XMLHttpRequest 对象
        xhr.open("post", url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
        xhr.send(formData); //开始上传，发送form数据
        xhr.onload = data => {
          //  请求成功的回调
          var item = JSON.parse(data.target.response); // 字符串转换为json 对象
          if (item.code == 0) {
            that.$Message.success(item.msg); // 请求成功后的友好提示
            that.getuserdata();
          } else {
            that.$Message.error(item.msg); // 请求失败后的友好提示
          }
          setTimeout(() => {
            that.btnloading = false;
          });
        };
        xhr.onerror = () => {
          //  请求失败的回调
          that.$Message.error("网络遇到问题,请重试!"); // 请求失败后的友好提示
        };
      }
    },
    getuserdata: function() {
      // 重新请求用户信息用来保存
      var that = this;
      this.axios
        .post(this.$api.user_get_user, {
          userid: this.getuser.userid
        })
        .then(function(data) {
          if (data.code == 0) {
            that.reload();
            that.$store.commit("loginuser", data.obj);
          } else {
            that.$Message.error(data.msg);
          }
        })
        .catch(function() {
          that.$Message.error("网络遇到问题,请重试!");
        });
    }
  }
};
</script>

<style scoped>
.portrait {
  padding: 1rem 3rem;
}
h3 {
  font-size: 2rem;
}
/* ul {
  height: 40rem;
  overflow-y: scroll
} */
li {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  font-size: 1rem;
  color: #999999;
  font-family: MicrosoftYaHei;
  /* justify-content: space-between; */
}
li:nth-child(1) > img {
  height: 5.5rem;
}
li:nth-child(1) > div {
  /* 鼠标移入变小手 */
  cursor: pointer;
  margin-left: 1rem;
}
li > span {
  width: 5rem;
  display: inline-block;
}
input[type="text"] {
  width: 50%;
  height: 4rem;
  font-size: 1rem;
  /* 首行缩进 */
  text-indent: 1rem;
  border-bottom: 1px solid #bbbbbb;
}

/* 修改性别按钮 */
/* .female {
  margin-left: 3rem;
}
label {
  color: #000;
}
input[type="radio"] + label::before {
  content: "\a0"; 
  display: inline-block;
  vertical-align: middle;
  font-size: 18px;
  width: 1em;
  height: 1em;
  margin-right: 0.4em;
  border-radius: 50%;
  border: 1px solid #818181;
  text-indent: 0.15em;
  line-height: 1;
}
input[type="radio"]:checked + label::before {
  background-color: #818181;
  background-clip: content-box;
  padding: 0.2em;
  width: 0.8em;
  height: 0.8em;
}
input[type="radio"] {
  position: absolute;
  clip: rect(0, 0, 0, 0);
} */
/* 保存按钮 */
.preserve {
  display: flex;
  justify-content: center;
}
button {
  width: 15rem;
  height: 4rem;
  color: #fff;
  font-size: 2rem;
  font-weight: bold;
  font-family: MicrosoftYaHei;
  background: rgba(54, 120, 239, 0.95);
  border-radius: 1rem;
}

input::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #333;
}
input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #333;
}
input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #333;
}
input:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #333;
}
</style>
