<template>
  <div class="information">
    <div class="header">
      <div class="header_left">
        <img :src="logo" alt />
        <p>星火刷题</p>
      </div>
      <drmenu class="header_right"></drmenu>
    </div>
    <div class="header_1">
      <div class="header_1_left">
        <button @click="recruit(1)" :class="{ header_blue: tabIndex == 1 }">
          同步
        </button>
        <button
          @click="recruit(3)"
          :class="{ header_blue: tabIndex == 3 }"
          v-if="getuser.school.levelid == 3"
        >
          高招
        </button>
        <button
          @click="recruit(2)"
          :class="{ header_blue: tabIndex == 2 }"
          v-if="getuser.school.levelid == 2"
        >
          中招
        </button>
      </div>
      <button
        :class="{ header_1_right_bottom: is_header }"
        @click="is_header = !is_header"
      >
        <!-- 小学-语文-七年级上册-第一单元 -->
        <p v-if="tabIndex == 1">
          <span>{{ userDetaill.levelname }}-</span>
          <span>{{ userDetaill.subjectname }}-</span>
          <span>{{ userDetaill.bookname }}-</span>
          <span>{{ userDetaill.directorname }}</span>
        </p>
        <p v-else>
          <span>{{ userDetaill.levelname }}-</span>
          <span>{{ userDetaill.subjectname }}</span>
        </p>
        <div v-if="is_header" class="message" @click.stop>
          <Spin size="large" fix v-if="spinShow"></Spin>
          <Tabs v-model="Tabsindex">
            <TabPane label="学科" name="学科">
              <button
                v-for="(item, index) in subjects"
                :key="index"
                @click="getbook(index)"
              >
                {{ item.subjectname }}
              </button>
            </TabPane>
            <TabPane label="年级/分册" name="年级" v-if="tabIndex == 1">
              <button
                v-for="(item, index) in books"
                :key="index"
                @click="getdirector(index)"
              >
                {{ item.bookname }}
              </button>
            </TabPane>
            <!-- <TabPane label="章节" name="章节" v-if="tabIndex == 1">
              <button
                v-for="(item, index) in directors"
                :key="index"
                @click="getstudying(index)"
              >{{ item.directorname }}</button>
            </TabPane>-->
            <TabPane label="章节" name="章节" v-if="tabIndex == 1">
              <Tree :data="directors" @on-select-change="getstudying"></Tree>
            </TabPane>
          </Tabs>
          <div class="condition">
            <span class="condition_left">已选条件:</span>
            <span class="condition_right">
              <span v-for="(item, index) in generates" :key="index">
                {{ item }}
                <img :src="shutimg" @click="shut(index)" />
              </span>
            </span>
          </div>
          <!-- <button class="search" @click="search">确定</button> -->
          <button
            class="search"
            :class="{ is_search_css: !is_search }"
            @click="search"
          >
            确定
          </button>
        </div>
      </button>
    </div>
    <!-- 试题展示 -->

    <div class="article">
      <div class="pos">
        <div class="content">
          <div
            v-for="(item, i) in dataquestions.questions"
            :key="i"
            :class="{ blue: item.is }"
          >
            <span>{{ i + 1 }}</span>
            <p v-html="item.questionstem" class="questions_class"></p>
            <img :src="danimg" v-if="item.qtype == 1" />
            <img :src="shuangimg" v-if="item.qtype == 2" />
            <div class="options1">
              <div
                v-for="(option, index) in item.list"
                :class="{ pitch_on: option.ischoose }"
                :key="index"
              >
                <span>
                  <i>{{ arr[index] }}</i>
                </span>
                <!-- <b v-html="detailfilter(option.optiontcontent)"></b> -->
                <b v-html="option.optiontcontent"></b>
              </div>
            </div>
          </div>
          <span class="preserve" v-if="dataquestions.questions">
            <Button type="primary" :loading="btnloading" @click="save"
              >开始答题</Button
            >
          </span>
        </div>
      </div>
    </div>
    <div class="top" @click="stick">
      <div class="top_ico">
        <img :src="arrowsimg" />
        <p class="top_word">返回顶部</p>
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
      btnloading: false,
      spinShow: false,
      logo: require("@/assets/img/personal/logo.png"),
      shutimg: require("@/assets/img/settings/shutimg.png"), // 刷题 X号
      arrowsimg: require("@/assets/img/exercise/arrows.png"), // 返回 顶部
      danimg: require("@/assets/img/dan.png"), // 单选
      shuangimg: require("@/assets/img/shuang.png"), // 多选
      arr: ["A", "B", "C", "D", "E", "F", "G", "H"],
      dataquestions: [], // 所有 试题
      levels: [], // 学科
      subjects: [], //  学段
      books: [], //  年级/分册
      directors: [], //章节
      generates: [], // 已选的属性用来展示
      generateType: {}, // 用来获取试卷的参数
      is_header: false, // 筛选条件窗口的显示隐藏状态
      Tabsindex: "学段", //标签页选中状态
      tabIndex: 1, // 类型选中
      userDetaill: [], //用户默认信息
      usergenerates: {}, // 用户保存预览之后试卷信息
      is_tabindex: true, // 是否是点击切换类型
      is_search: false // 是否能获取预览试卷
    };
  },
  computed: {
    getuser: function() {
      return this.$store.getters.get_user;
    },
    getgenerate: function() {
      return this.$store.getters.get_generateType;
    }
  },
  mounted() {
    this.spinShow = true;
    this.tabIndex = this.getgenerate; // 保存上次 类型
    this.getuserDetaill();
    window.addEventListener("scroll", this.scrollToTop);
  },
  destroyed() {
    window.removeEventListener("scroll", this.scrollToTop); //删除监听页面滚动事件
  },
  beforeUpdate() {
    // 数据更新
    if (this.tabIndex == 1) {
      // 根据不同试题方式  选择不同请求内容
      if (this.generates.length == 3) {
        this.is_search = true;
      } else {
        this.is_search = false;
      }
    } else {
      if (this.generates.length == 1) {
        this.is_search = true;
      } else {
        this.is_search = false;
      }
    }
  },
  methods: {
    getuserDetaill: function() {
      // 获取用户默认信息
      var that = this;
      this.axios
        .post(this.$api.userDetail_get_userDetaill, {
          userid: this.getuser.userid,
          generateType: this.tabIndex
        })
        .then(function(data) {
          if (data.code == 0) {
            if (data.obj == null || data.obj.levelid == null) {
              that.$Message.error("没有默认信息!"); // 请求信息为空后的友好提示
              that.is_tabindex = false;
            } else {
              // 保存默认信息
              that.userDetaill = data.obj;
            }
            // 获取学段
            that.getsubject();
          } else {
            that.is_tabindex = false;
            that.$Message.error(data.msg); // 请求失败后的友好提示
          }
        })
        .catch(function() {
          that.$Message.error("网络遇到问题,请重试!"); // 请求失败后的友好提示
        });
    },
    getsubject: function() {
      // 选择学段,获取学科
      this.spinShow = true;
      this.subjects = []; //  学段
      this.books = []; //  年级/分册
      this.directors = []; //章节
      this.generateType.levelid = this.getuser.school.levelid;
      var that = this;
      this.axios
        .post(this.$api.subject_list_subject, {
          levelid: this.getuser.school.levelid,
          schoolid: this.getuser.schoolid
        })
        .then(function(data) {
          if (data.code == 0) {
            if (data.obj != null) {
              that.subjects = data.obj;
              that.Tabsindex = "学科";
              if (that.is_tabindex) {
                that.getbook();
              }
            } else {
              that.$Message.error(data.msg); // 请求失败后的友好提示
            }
          } else {
            that.$Message.error(data.msg); // 请求失败后的友好提示
          }
          setTimeout(() => {
            that.spinShow = false;
          }, 1000);
        })
        .catch(function() {
          that.spinShow = false;
          that.$Message.error("网络遇到问题,请重试!"); // 请求失败后的友好提示
        });
    },
    getbook: function(index) {
      // 选择学科,获取年级/分册
      this.spinShow = true;
      this.books = []; //  年级/分册
      this.directors = []; //章节
      //  学科后其他选项选中都清空
      this.generates = [];
      var subjectid = null;
      if (this.is_tabindex) {
        subjectid = this.userDetaill.subjectid;
      } else {
        subjectid = this.subjects[index].subjectid;
      }
      this.generateType.subjectid = subjectid;

      if (this.tabIndex == 1) {
        var that = this;
        this.axios
          .post(this.$api.book_list_book, {
            subjectid: subjectid,
            schoolid: this.getuser.schoolid
          })
          .then(function(data) {
            if (data.code == 0) {
              if (data.obj != null) {
                that.books = data.obj;
                // 已选条件 添加展示
                if (that.is_tabindex) {
                  that.generates.push(that.userDetaill.subjectname);
                  that.getdirector();
                } else {
                  that.generates.push(that.subjects[index].subjectname);
                  that.Tabsindex = "年级";
                }
              } else {
                that.$Message.error(data.mgs); // 请求失败后的友好提示
              }
            } else {
              that.$Message.error(data.mgs); // 请求失败后的友好提示
            }
            setTimeout(() => {
              that.spinShow = false;
            }, 1000);
          })
          .catch(function() {
            that.spinShow = false;
            that.$Message.error("网络遇到问题,请重试!"); // 请求失败后的友好提示
          });
      } else {
        // 高招/中招
        this.spinShow = false;
        this.Tabsindex = "学科";
        if (this.is_tabindex) {
          this.generates.push(this.userDetaill.subjectname);
        } else {
          this.generates.push(this.subjects[index].subjectname);
        }
        if (this.is_tabindex) {
          this.is_search = true;
          this.is_tabindex = false;
          this.search();
        }
        this.$forceUpdate();
      }
    },
    getdirector: function(index) {
      // 选择年级/分册,获取章节
      this.spinShow = true;
      this.directors = []; //章节
      var bookid = null;
      if (this.is_tabindex) {
        bookid = this.userDetaill.bookid;
      } else {
        bookid = this.books[index].bookid;
      }
      this.generateType.bookid = bookid;
      var that = this;
      this.axios
        .post(this.$api.director_list_director, {
          levelid: this.generateType.levelid, //学段id
          subjectid: this.generateType.subjectid, // 科目id
          bookid: this.generateType.bookid, //教材下章节
          type: 3,
          schoolid: this.getuser.schoolid // 学校id
        })
        .then(function(data) {
          if (data.code == 0) {
            that.directors = data.obj;
            let arr = [];
            var item = data.obj;
            for (let i = 0; i < item.length; i++) {
              arr.push({
                title: item[i].directorname,
                directorid: item[i].directorid,
                leaf: item[i].leaf,
                disabled: false,
                expand: false,
                children: []
              });
              var item_j = item[i].directors;
              if (item_j.length > 0) {
                for (let j = 0; j < item_j.length; j++) {
                  arr[i].children.push({
                    title: item_j[j].directorname,
                    directorid: item_j[j].directorid,
                    leaf: item_j[j].leaf,
                    disabled: false,
                    expand: false,
                    children: []
                  });
                  var item_k = item_j[j].directors;
                  if (item_k.length > 0) {
                    for (let k = 0; k < item_k.length; k++) {
                      arr[i].children[j].children.push({
                        title: item_k[k].directorname,
                        directorid: item_k[k].directorid,
                        leaf: item_k[k].leaf,
                        disabled: false
                      });
                    }
                  }
                }
              }
            }
            that.directors = arr;
            that.Tabsindex = "章节";
            // 已选条件 添加展示
            that.generates = that.generates.slice(0, 1);
            if (that.is_tabindex) {
              that.generates.push(that.userDetaill.bookname);
              that.getstudying();
            } else {
              that.generates.push(that.books[index].bookname);
            }
          } else {
            that.$Message.error(data.msg); // 请求失败后的友好提示
          }
          setTimeout(() => {
            that.spinShow = false;
          }, 1000);
        })
        .catch(function() {
          that.spinShow = false;
          that.$Message.error("网络遇到问题,请重试!"); // 请求失败后的友好提示
        });
    },
    // getstudying: function(index) {
    //   // 已选条件 添加展示
    //   this.generates = this.generates.slice(0, 2);
    //   var directorid = null;
    //   if (this.is_tabindex) {
    //     this.generates.push(this.userDetaill.directorname);
    //     directorid = this.userDetaill.directorid;
    //   } else {
    //     this.generates.push(this.directors[index].directorname);
    //     directorid = this.directors[index].directorid;
    //   }
    //   this.generateType.directorid = directorid;
    //   if (this.is_tabindex) {
    //     this.is_search = true;
    //     this.search();
    //   }
    // },
    getstudying: function(e) {
      this.generates = this.generates.slice(0, 2);
      var directorid = null;
      if (this.is_tabindex) {
        this.generates.push(this.userDetaill.directorname);
        directorid = this.userDetaill.directorid;
      } else {
        if (e[0].leaf == 0) {
          e[0].selected = false;
          this.$Message.error("该章节非试题章节!");
        } else {
          this.generates.push(e[0].title);
          directorid = e[0].directorid;
        }
      }
      this.generateType.directorid = directorid;
      if (this.is_tabindex) {
        this.is_search = true;
        this.search();
      }
    },
    shut: function(index) {
      // 点击X 号图标 删除索引后所有选项
      this.generates = this.generates.slice(0, index);
      if (this.tabIndex == 1) {
        if (index == 0) {
          this.Tabsindex = "学科";
          // 清空数组 防止误添加
          this.books = []; //  年级/分册
          this.directors = []; //章节
        } else if (index == 1) {
          this.Tabsindex = "年级";
          this.directors = []; //章节
        } else if (index == 2) {
          this.Tabsindex = "章节";
        }
      }
    },
    recruit: function(index) {
      //   同步/高招/中招  的选择
      this.tabIndex = index;
      // 开启默认属性获取
      this.is_tabindex = true;
      this.is_header = false;
      // 添加之前先清空数组
      this.dataquestions = [];
      this.generates = [];
      this.Tabsindex = "学科";
      this.getuserDetaill();
    },
    search: function() {
      // 获取预览信息
      // 先清空数据 避免添加bug
      this.dataquestions = {};
      this.usergenerates = "";
      this.is_tabindex = false; //关闭默认值请求数据
      var postdata = {};

      if (this.tabIndex == 1) {
        // 根据不同试题方式  选择不同请求内容
        postdata = {
          userid: this.getuser.userid,
          schoolid: this.getuser.schoolid,
          generateType: this.tabIndex,
          levelid: this.generateType.levelid,
          subjectid: this.generateType.subjectid,
          bookid: this.generateType.bookid,
          directorid: this.generateType.directorid
        };
      } else {
        postdata = {
          userid: this.getuser.userid, //用户ID
          schoolid: this.getuser.schoolid, //学校ID
          generateType: this.tabIndex, //试题方式
          levelid: this.generateType.levelid,
          subjectid: this.generateType.subjectid
        };
      }
      if (this.is_search) {
        this.spinShow = true;
        var that = this;
        this.axios
          .post(this.$api.paper_generate_paper, postdata)
          .then(function(data) {
            if (data.code == 0) {
              that.dataquestions = data.obj;
              that.usergenerates = JSON.stringify(data);
              that.userDetaill.subjectname = that.generates[0];
              that.userDetaill.bookname = that.generates[1];
              that.userDetaill.directorname = that.generates[2];
              that.is_header = false;
            } else {
              that.$Message.error(data.msg); // 请求失败后的友好提示
            }
            setTimeout(() => {
              that.spinShow = false;
            }, 1000);
          })
          .catch(function() {
            that.spinShow = false;
            that.$Message.error("网络遇到问题,请重试!"); // 请求失败后的友好提示
          });
      } else {
        this.$Message.error("生成试卷条件不完整!");
      }
    },
    save: function() {
      // 保存后开始做题
      if (Object.keys(this.dataquestions).length > 0) {
        //判断对象是否有属性
        this.btnloading = true;
        var that = this;
        this.axios
          .post(this.$api.paper_save_paper, {
            resultVo: this.usergenerates
          })
          .then(function(data) {
            if (data.code == 0) {
              that.$Message.success(data.msg);
              that.$store.commit("userpaper", data.obj); //保存试卷信息
              that.$store.commit("ispaper", true); //  保存当前地址
              that.$store.commit("question", that.dataquestions); //保存试卷
              that.$store.commit("generate", that.tabIndex); //保存试卷类型
              that.$router.push("/exercise_unfinished");
              that.is_header = false;
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
      } else {
        this.$Message.error("没有可以生成试卷的信息!"); // 请求失败后的友好提示
      }
    },
    detailfilter: function(val) {
      const value = val.replace(/<p><br\/><\/p>/gi, "");
      return value;
    },
    scrollToTop: function() {
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop; //当前滚动的距离
      var header_0 = document.getElementsByClassName("header")[0].offsetHeight;
      var header_1 = document.getElementsByClassName("header_1")[0]
        .offsetHeight;
      var scrollBottom = header_0 + header_1;
      if (scrollBottom - scrollTop < 0) {
        document.getElementsByClassName("top")[0].style.display = "inline"; // 显示 回到顶部 按钮
      } else {
        document.getElementsByClassName("top")[0].style.display = "none";
      }
    },
    stick: function() {
      //置顶
      if (document.documentElement.scrollTop > 0) {
        document.documentElement.scrollTop = 0;
      }
    }
  }
};
</script>
<style>
img {
  max-width: 100%;
}
</style>
<style scoped>
.information {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.header,
.header_1 {
  /* height: 20rem; */
  /* display: flex;
  flex: 2.5;
  align-items: center;
  justify-content: space-between; */
  border-bottom: 1px solid rgba(216, 216, 216, 1);
  box-shadow: 8px rgba(223, 223, 223, 0.61);
}
.header {
  padding: 1rem 10rem;
}
/* .header > div {
  flex: 1;
  margin: 0 10rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
} */
.header_left {
  float: left;
  display: flex;
  align-items: center;
}
.header_left img {
  max-height: 3rem;
}
.header_left p {
  color: #1c7bf1;
  font-size: 1.5rem;
  letter-spacing: 0.5rem;
  /* font-weight: 700; */
  font-family: FZZZHONGJW--GB1-0;
}
.header_right {
  float: right;
  margin-top: 0.5rem;
}
.header_1 {
  padding: 0 10rem;
  background-color: #0c79ff;
  /* margin-bottom: 1rem; */
}
.header_1_left {
  float: left;

  font-size: 1.5rem;
  color: #fff;
  font-family: MicrosoftYaHei;
  font-weight: 400;
}
.header_1_left > button {
  color: #fff;
  width: 5rem;
  height: 3.5rem;
  margin-right: 2rem;
}
.header_1 > button {
  float: right;
  margin-top: 0.6rem;
  position: relative;
  display: flex;
  font-size: 1rem !important;
  border: 1px solid #dfdfdf;
  background-color: #fff;
  color: #000;
  padding: 0.3rem 0.6rem;
  min-height: 2rem;
  z-index: 2;
}
.header_1_right_bottom {
  border-bottom: 1px solid #ffff !important;
}
.header_1_right_bottom > p {
  display: inline-block;
  font-size: 1rem;
}
/* 筛选条件的窗口 */
.message {
  position: absolute;
  top: 1.8rem;
  right: -1px;
  z-index: 1;
  cursor: auto;
  border: 1px solid #dfdfdf;
  background-color: #fff;
  min-width: 20rem;
}
.condition {
  width: 100%;
  display: flex;
  font-size: 1rem;
  border-top: 1px solid #e1e1e1;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  padding: 0.5rem 0 0.5rem 0.8rem;
}
.condition_left {
  width: 25%;
}
.condition_right {
  width: 75%;
  display: flex;
  flex-wrap: wrap;
}
.condition_right > span {
  margin-right: 0.3rem;
  margin-bottom: 0.3rem;
  display: inline-block;
  padding: 0.1rem 0.2rem;
  font-size: 0.6rem;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #0072ff;
  border: 1px solid #0072ff;
}
/* tree树状 章节 */
.ivu-tree {
  float: left;
  width: 5rem;
}
/* X号 图片点击删除移入小手 */
.condition_right img {
  cursor: pointer;
}
.ivu-tabs-tab {
  font-size: 1rem;
}
.ivu-tabs-tabpane {
  /* display: flex; */
  margin-bottom: 1rem;
  /* justify-content: space-around; */
}
/* 限制最高高度添加滚动条 */
.ivu-tabs-tabpane {
  max-height: 12rem;
  overflow: auto;
}
/* 标签页下的button 按钮 */
.ivu-tabs-tabpane button {
  font-size: 1rem;
  float: left;
  padding: 0.3rem 1rem;
  font-family: MicrosoftYaHei;
  font-weight: 400;
}
/* 需要下横线 */
.ivu-tabs-ink-bar,
.ivu-tabs-ink-bar-animated {
  height: 0 !important;
  display: none !important;
}
/* 同步/高招/中招 的选中*/
.header_blue {
  background-color: #0067e6;
}
/* 搜索条件确认按钮 */
.search {
  font-size: 1rem;
  color: #0072ff;
  height: 3rem;
  border-top: 1px solid #e1e1e1;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  width: 100%;
}
.is_search_css {
  color: #aaa;
  cursor: not-allowed;
}
/* 中间内容部分 */
.article {
  width: 100%;
  flex: 25;
  padding-top: 1.5rem;
  /* height: 100%; */
  background-color: #f4f7f9;
}
.article > div {
  height: 100%;
  margin: 0 9rem;
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
}

/* 中间试题部分 */
.pos {
  display: flex;
  align-items: center;
  justify-content: center;
}
.content {
  width: 80%;
  float: left;
}
.content > div {
  width: 100%;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(223, 223, 223, 1);
}

/* 试题 */
.content > div {
  box-sizing: border-box;
  margin-bottom: 1rem;
  position: relative;
  padding: 1.5rem 3rem 0.8rem 3rem;
}
/* 序号 */
.content > div > span:nth-child(1) {
  top: 1rem;
  left: -0.3rem;
  width: 2.5rem;
  height: 2.5rem;
  color: #fff;
  border-radius: 3px;
  position: absolute;
  text-align: center;
  line-height: 2.5rem;
  display: inline-block;
  background-color: #d3d3d3;
}
.content > div > img {
  position: absolute;
  top: 0;
  right: 0;
}
/* 题目 */
.questions_class {
  font-size: 1.5rem;
  font-family: MicrosoftYaHei-Bold;
  /* font-weight: bold; */
  color: #000;
  margin-bottom: 1rem;
}
/* 试题题目图片大小限制 */
/* 设置不生效 */
img {
  max-width: 100%;
}
/* 选项 */
.options1 > div {
  background-color: #ffffff;
  border-radius: 6px;
  border: solid 1px #d5d5d5;
  margin-bottom: 18px;
  font-family: MicrosoftYaHei;
  font-size: 14px;
  font-weight: normal;
  letter-spacing: 2px;
  color: #333333;
  overflow: hidden;
  cursor: pointer;
}
.options1 > div {
  position: relative;
  padding-left: 52px;
}
.options1 > div > span {
  display: inline-block;
  width: 52px;
  height: 100%;
  text-align: center;
  position: absolute;
  left: 0;
  top: 0;
}
.options1 div span i {
  position: absolute;
  display: block;
  line-height: 52px;
  top: 50%;
  left: 50%;
  width: 52px;
  text-align: center;
  margin-left: -26px;
  margin-top: -26px;
  font-style: normal;
}

.options1 b {
  display: inline-block;
  width: 674px;
  font-weight: normal;
  border-left: 1px solid #d5d5d5;
  padding-left: 18px;
  line-height: 52px;
}

/* 已选中 */
.blue {
  border: 1px solid #4f93fe !important;
}
.blue > span:nth-child(1) {
  background-color: #4f93fe !important;
}
/* 选中选项 */
.pitch_on {
  border: solid 1px #1764ef !important;
}
.pitch_on > span {
  color: #fff;
  background-color: #4f93fe;
}
/* 保存盒子 */
.preserve {
  display: flex;
  margin: 2rem 0;
  align-items: center;
  justify-content: center;
}
.preserve button {
  width: 18rem;
  height: 4rem;
  color: #fff;
  font-size: 1.8rem;
  border-radius: 1rem;
  background-color: #3678ef;
}
/* 回到顶部按钮 */
.top {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  display: none;
}
.top div {
  width: 4rem;
  height: 4rem;
  background-color: #cacaca;
  border-radius: 0.6rem;
  cursor: pointer;
  position: relative;
  margin-bottom: 2rem;
}
.top div.top_ico img {
  width: 3rem;
  display: block;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -1.5rem;
  margin-top: -1.5rem;
}
.top .top_ico .top_word {
  width: 4rem;
  height: 4rem;
  font-family: MicrosoftYaHei;
  font-size: 1.4rem;
  font-weight: normal;
  font-stretch: normal;
  color: #ffffff;
  background: #1c7bf1;
  color: #ffffff;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 0.6rem;
  opacity: 0;
  transition: all 0.2s;
}
.top div.top_ico:hover .top_word {
  opacity: 1;
}
/* 解析 第二张图片大小 */
#analysis_img {
  height: 29px;
}
/* 底部 */
.footer {
  flex: 1;
  display: flex;
  color: #fff;
  font-size: 1rem;
  align-items: center;
  justify-content: center;
  font-family: "MicrosoftYaHei";
  background-color: #aaa;
}
</style>
