<template>
  <Dropdown placement="bottom-end" @on-click="drmenu">
    <a class="header_right" href="javascript:void(0)">
      <img
        :src="headportrait"
        v-if="this.getuser.headurl != null && this.getuser.headurl != 'null'"
      />
      <img :src="userlogo" v-else />
      欢迎您，{{ name }}
    </a>
    <DropdownMenu slot="list">
      <DropdownItem name="1">个人中心</DropdownItem>
      <DropdownItem name="2">开始刷题</DropdownItem>
      <DropdownItem name="3">退出登录</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>

<script>
export default {
  name: "drmenu",
  data: function() {
    return {
      name: "", // 用户名
      headportrait: "", // 用户头像
      userlogo: require("@/assets/img/personal/userlogo.png"), //默认头像
      userimg: "" // 用户头像
    };
  },
  computed: {
    getuser: function() {
      return this.$store.getters.get_user;
    }
  },
  mounted() {
    this.name = this.getuser.username;
    if (this.getuser.headurl != null && this.getuser.headurl != "null") {
      this.headportrait = this.$api.showImageUrl + this.getuser.headurl; // 保存头像
    }
  },
  methods: {
    drmenu: function(name) {
      if (name == 1) {
        // 个人中心
        this.$router.push("/Personal/personal_details");
      } else if (name == 2) {
        // 重新刷题
        this.$router.push("/Settings");
      } else if (name == 3) {
        // 跳到登录页面
        this.$router.push("/");
        // 删除本地储存数据
        this.$store.commit("error", null);
      }
    }
  }
};
</script>

<style>
.header_right {
  color: #333;
  display: flex;
  align-items: center;
  /* justify-content: center; */
  font-size: 1.1rem;
}
.header_right > img {
  max-width: 3rem;
  max-height: 3rem;
  margin-right: 0.5rem;
}
</style>
