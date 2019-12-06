<template>
  <div class="record">
    <h3>更改密码</h3>
    <ul>
      <li>
        <span>原始密码:</span>
        <input
          type="text"
          v-model="former_password"
          onkeyup="value=value.replace(/[\u4e00-\u9fa5]/ig,'')"
        />
      </li>
      <li>
        <span>新密码:</span>
        <input
          type="password"
          v-model="new_password1"
          onkeyup="value=value.replace(/[\u4e00-\u9fa5]/ig,'')"
        />
      </li>
      <li>
        <span>确认密码:</span>
        <input
          type="password"
          v-model="new_password2"
          @focus="acquire"
          @blur="search"
          onkeyup="value=value.replace(/[\u4e00-\u9fa5]/ig,'')"
        />
        <span class="wrong" v-if="is_wrong">两次密码不同，请重新输入</span>
      </li>
      <li>
        <Button type="primary" :loading="btnloading" @click="save">保存</Button>
      </li>
    </ul>
  </div>
</template>

<script>
import { setTimeout } from "timers";
export default {
  data() {
    return {
      btnloading: false,
      former_password: "", // 原始密码
      new_password1: "", // 新密码
      new_password2: "", // 确认密码
      is_wrong: false //错误提示是否显示
    };
  },
  computed: {
    getuser: function() {
      return this.$store.getters.get_user;
    }
  },
  methods: {
    aa: function(index) {
      this.tabIndex = index;
      this.$router.push("/exercise_unfinished");
    },
    acquire: function() {
      this.is_wrong = false;
    },
    search: function() {
      if (this.new_password1 != this.new_password2) {
        this.is_wrong = true;
      } else {
        this.is_wrong = false;
      }
    },
    save: function() {
      // 保存密码
      if (this.former_password.trim() == "") {
        this.$Message.error("原密码输入有误!");
      } else if (this.new_password1.trim() == "") {
        this.$Message.error("密码输入有误!");
      } else if (this.new_password1.trim().length > 16) {
        this.$Message.error("密码长度过长!");
      } else if (this.new_password1.trim() != this.new_password2.trim()) {
        this.$Message.error("确认密码输入有误!");
      } else if (this.former_password.trim() == this.new_password1.trim()) {
        this.$Message.error("新密码于原始密码不可以一致!");
      } else {
        this.btnloading = true;
        var that = this;
        this.axios
          .post(this.$api.user_update_userpwd, {
            userid: this.getuser.userid, // 用户主键
            oldpassword: this.former_password, //原密码
            newpassword: this.new_password1 // 新密码
          })
          .then(function(data) {
            if (data.code == 0) {
              //  请求成功调到我的记录页面
              that.$Message.success(data.msg);
              // 删除本地储存数据
              that.$store.commit("error", null);
              // 跳到登录页面
              setTimeout(() => {
                that.$router.push("/");
              }, 2000);
              setTimeout(() => {
                that.btnloading = false;
              }, 3000);
            } else {
              that.$Message.error(data.msg);
              that.btnloading = false;
            }
          })
          .catch(function() {
            that.btnloading = false;
            that.$Message.error("网络遇到问题,请重试!");
          });
      }
    }
  }
};
</script>

<style scoped>
.record {
  padding: 1rem 3rem;
}
h3 {
  font-size: 2rem;
}
li {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  font-size: 1rem;
  color: #999999;
  font-family: MicrosoftYaHei;
  /* justify-content: space-between; */
}

li > span {
  width: 7rem;
  display: inline-block;
}
input {
  width: 50%;
  height: 4rem;
  font-size: 1rem;
  /* 首行缩进 */
  text-indent: 1rem;
  border-bottom: 1px solid #bbbbbb;
}

/* 错误提示 */
.wrong {
  font-size: 1rem;
  color: #e82828;
  margin-left: 2rem;
  font-family: MicrosoftYaHei;
  font-weight: bold;
}
/* 保存按钮 */
button {
  width: 8rem;
  height: 3rem;
  color: #fff;
  font-size: 1rem;
  margin-left: 10rem;
  margin-top: 1rem;
  font-family: MicrosoftYaHei;
  font-weight: bold;
  background: #4f93fe;
  border-radius: 0.8rem;
}
</style>
