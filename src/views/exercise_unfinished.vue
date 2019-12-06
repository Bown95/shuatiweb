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
      <div class="pos">
        <div class="limit">
          <img :src="pencilimg" alt />
          <p>学科: {{ xueke }}</p>
          <p v-if="getuserpaper.directorname">章节: {{ zhangjie }}</p>
        </div>
        <div class="content">
          <div class="content_left">
            <div
              v-for="(item, i) in dataquestions.questions"
              :key="i"
              :class="{ blue: item.is }"
              class="question"
            >
              <span>{{ i + 1 }}</span>
              <p v-html="item.questionstem"></p>
              <img :src="danimg" v-if="item.qtype == 1" />
              <img :src="shuangimg" v-if="item.qtype == 2" />
              <div class="options1">
                <div
                  v-for="(option, index) in item.list"
                  :class="{ pitch_on: option.ischoose }"
                  :key="index"
                  @click="answer_question(item, i, option, index)"
                >
                  <span>
                    <i>{{ arr[index] }}</i>
                  </span>
                  <b v-html="option.optiontcontent"></b>
                </div>
              </div>
            </div>
            <span class="preserve">
              <Button type="primary" :loading="btnloading" @click="save"
                >提交</Button
              >
            </span>
          </div>
          <!-- 答题卡 -->
          <div id="content_right" :class="{ content_is: is_right }">
            <div>
              <span>
                <img :src="answerimg" alt />
                <p>答题卡</p>
              </span>
              <span class="state">
                <span></span>
                <p>已做</p>
                <span></span>
                <p>未做</p>
              </span>
            </div>
            <div>
              <p>选择题</p>
              <div class="number">
                <span
                  v-for="(item, i) in dataquestions.questions"
                  :key="i"
                  :class="{ blue: item.is }"
                  @click="questionscroll(i)"
                  >{{ i + 1 }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="top" @click="stick">
      <div class="top_ico">
        <img :src="arrowsimg" alt />
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
      content_width: "", //保留 本身 宽度
      logo: require("@/assets/img/personal/logo.png"),
      answerimg: require("@/assets/img/exercise/answer.png"),
      pencilimg: require("@/assets/img/exercise/pencil.png"),
      arrowsimg: require("@/assets/img/exercise/arrows.png"),
      danimg: require("@/assets/img/dan.png"), // 单选
      shuangimg: require("@/assets/img/shuang.png"), // 多选
      dataquestions: {}, // 试题
      xueke: "语文",
      zhangjie: "第一章丰富的图形世界",
      arr: ["A", "B", "C", "D", "E", "F", "G", "H"],
      is_right: false,
      tabIndex: 0 // 试题选中状态
    };
  },
  computed: {
    getuser: function() {
      return this.$store.getters.get_user;
    },
    getuserpaper: function() {
      return this.$store.getters.get_userpaper;
    },
    getquestions: function() {
      return this.$store.getters.get_question;
    }
  },
  mounted() {
    this.content_width = document.getElementById("content_right").offsetWidth; //本身的宽度
    window.addEventListener("scroll", this.scrollToTop);
    // 监听视口变化
    window.onresize = () => {
      this.content_width = document.getElementById("content_right").offsetWidth; //本身的宽度
    };
    this.getdata();
    window.onbeforeunload = () => {
      //刷新时弹出提示
      this.$store.commit("question", this.dataquestions); //保存试卷 //保存试卷已做内容
    };
    this.xueke = this.getuserpaper.subjectname;
    this.zhangjie = this.getuserpaper.directorname;
  },
  destroyed() {
    window.removeEventListener("scroll", this.scrollToTop); //删除监听页面滚动事件
  },
  methods: {
    getdata: function() {
      this.dataquestions = this.getquestions; // 从本地获取试题
    },
    answer_question: function(question, i, option) {
      if (question.qtype == 1) {
        //单选
        question.options = option.optionid;
        // question.options = question.options.replace("undefined","" )
      } else {
        // 多选
        if (option.is_add) {
          option.is_add = false;
          var optionid = option.optionid + ",";
          question.options = question.options.replace(optionid, "");
        } else {
          option.is_add = true;
          question.options += option.optionid + ",";
          question.options = question.options.replace("undefined", ""); //去除undefined
        }
      }
      // 提交试题
      var that = this;
      this.axios
        .post(this.$api.question_submit_question, {
          userid: this.getuser.userid, // 用户ID
          paperid: this.getuserpaper.paperid, // 试卷ID
          questionid: question.questionid, // 题目ID
          options: question.options //选项ID  如果多选以,隔开
        })
        .then(function(data) {
          if (data.code == 0) {
            if (question.qtype == 1) {
              //单选
              for (var j = 0; j < question.list.length; j++) {
                var item = question.list;
                item[j].ischoose = false;
              }
              question.is = true; // 试题选中
              option.ischoose = true; //选项选中
            } else {
              // 多选
              if (option.is_add) {
                question.is = true; // 试题选中
                option.ischoose = true; //选项选中
              } else {
                option.ischoose = false; // 试题选中
                var is_arr = [];
                for (var k = 0; k < question.list.length; k++) {
                  var item_1 = question.list;
                  if (item_1[k].ischoose == true) {
                    is_arr.push("1"); //判断是否有选中的试题
                  }
                }
                if (is_arr.length == 0) {
                  question.is = false; // 试题取消选中
                }
              }
            }
          } else {
            that.$Message.error(data.msg); // 请求失败后的友好提示
            if (option.is_add) {
              option.is_add = false;
              var optionid = option.optionid + ",";
              question.options = question.options.replace(optionid, "");
            } else {
              option.is_add = true;
              question.options += option.optionid + ",";
            }
          }
          that.$forceUpdate();
        })
        .catch(function() {
          that.$Message.error("网络遇到问题,请重试!"); // 请求失败后的友好提示
        });
    },
    save: function() {
      var arr = [];
      for (var i = 0; i < this.dataquestions.questions.length; i++) {
        var item = this.dataquestions.questions;
        if (!item[i].is) {
          arr.push(item[i]);
          break;
        }
      }
      if (arr.length == 0) {
        this.btnloading = true;
        var that = this;
        this.axios
          .post(this.$api.question_hand_paper, {
            paperid: this.getuserpaper.paperid, // 试卷ID
            userid: this.getuser.userid
          })
          .then(function(data) {
            if (data.code == 0) {
              that.$Message.success(data.msg); // 请求成功后的友好提示
              that.$store.commit("question", {}); //  保存试卷成功后清除本地试卷
              that.$router.push("/exercise_accomplish");
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
        this.$Message.error("有未做试题!"); // 请求失败后的友好提示
      }
    },
    questionscroll: function(index) {
      // 右侧序号点击定位
      var questionde = document.getElementsByClassName("question")[index];
      // document.documentElement.scrollTop = questionde.offsetTop;
      window.pageYOffset = questionde.offsetTop;
      document.documentElement.scrollTop = questionde.offsetTop;
      document.body.scrollTop = questionde.offsetTop;
    },
    scrollToTop: function() {
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop; //当前滚动的距离
      var header_height = document.getElementsByClassName("header")[0]
        .offsetHeight;
      var limit_height = document.getElementsByClassName("limit")[0]
        .offsetHeight; //本身的高度
      var limit = document.getElementsByClassName("limit")[0];
      var limit_magin = getComputedStyle(limit, null).marginTop; //获取外边距顶部高度  content_right   pos
      var limit_magin1 = limit_magin.replace("px", ""); //去除px
      var scrollBottom = header_height + limit_height + limit_magin1 * 2;
      var content_Right = document.getElementsByClassName("pos")[0];
      var content_magin = getComputedStyle(content_Right, null).marginRight; //获取外边距顶部高度  content_right   pos
      if (scrollBottom - scrollTop < 0) {
        this.is_right = true; //   吸附状态
        document.getElementsByClassName("top")[0].style.display = "inline"; // 显示 回到顶部 按钮
        document.getElementById("content_right").style.right = content_magin; // 赋值吸附前的右边距
        document.getElementById("content_right").style.width =
          this.content_width + "px"; // 赋值吸附前的宽度
      } else {
        this.is_right = false;
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

<style scoped>
.information {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.header {
  display: flex;
  flex: 2.5;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(216, 216, 216, 1);
  box-shadow: 8px rgba(223, 223, 223, 0.61);
}
.header {
  min-height: 4rem;
  max-height: 6rem;
  padding: 1rem 10rem;
}

.header_left {
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
/* 中间内容部分 */
.article {
  width: 100%;
  flex: 25;
  /* padding: 1.5rem 0; */
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
/* 学科展示栏 */
.limit {
  width: 100%;
  height: 3rem;
  display: flex;
  padding: 0 1rem;
  margin: 1.5rem 0;
  align-items: center;
  box-sizing: border-box;
  background-color: #fff;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(216, 216, 216, 1);
  border-radius: 6px;
}
.limit p {
  margin: 0 2rem 0 0.5rem;
  font-size: 1.5rem;
  color: #333333;
  font-family: MicrosoftYaHei;
  font-weight: 400;
}
/* 中间试题部分 */

.content_left {
  width: 80%;
  float: left;
}
.content_left > div {
  width: 100%;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(223, 223, 223, 1);
}
/* 单双选题 */
.content_left > div > img {
  position: absolute;
  top: 0;
  right: 0;
}
/* 超过右侧脱标 */
.content_is {
  position: fixed;
  top: 0;
}
#content_right {
  width: 18%;
  /* min-width: 15rem; */
  float: right;
  background-color: #fff;
  border: 1px solid rgba(227, 227, 227, 1);
  box-shadow: 0px 0px 8px 0px rgba(223, 223, 223, 0.61);
}
#content_right > div:nth-child(1) {
  display: flex;
  padding: 1rem;
  justify-content: space-between;
  border-bottom: 1px solid #e6e6e6;
}
#content_right > div:nth-child(1) > span {
  display: flex;
  align-items: center;
}
/* 答题卡 */
#content_right > div:nth-child(1) > span:nth-child(1) {
  font-size: 1.3rem;
  font-weight: bold;
}
/* 已做-未做 */
.state > span {
  width: 1rem;
  height: 1rem;
  border-radius: 2px;
  background-color: #4f93fe;
}
.state > span:nth-child(3) {
  margin-left: 0.5rem;
  background-color: #dfdfdf !important;
}
#content_right > div:nth-child(2) {
  padding: 1rem;
}
#content_right > div:nth-child(2) p {
  font-size: 1.3rem;
  color: #333333;
  font-family: MicrosoftYaHei;
  font-weight: 400;
}
/* 序号 */
.number {
  display: flex;
  flex-wrap: wrap;
  padding-top: 1rem;
  padding: 0 1rem;
  justify-content: flex-start;
}
/* 每个序号 */
.number > span {
  width: 3rem;
  height: 3rem;
  margin: 0.5rem;
  text-align: center;
  line-height: 3rem;
  display: inline-block;
  font-size: 1.2rem;
  color: #dfdfdf;
  border: 1px solid #dfdfdf;
  border-radius: 6px;

  /* 鼠标移入变小手 */
  cursor: pointer;
}
/* 试题 */
.content_left > div {
  box-sizing: border-box;
  margin-bottom: 1rem;
  position: relative;
  padding: 1.5rem 3rem 0.8rem 3rem;
}
/* 序号 */
.content_left > div > span {
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
/* 题目 */
.content_left > div > p {
  font-size: 1.5rem;
  font-family: MicrosoftYaHei-Bold;
  /* font-weight: bold; */
  color: #000;
  margin-bottom: 1rem;
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
/* 选中选项 */
.pitch_on {
  border: solid 1px #4f93fe !important;
}
.pitch_on > span {
  color: #fff;
  background-color: #4f93fe;
}
.pitch_on b {
  color: #4f93fe !important;
}

/* 已选中 */
.blue {
  color: #4f93fe !important;
  border: 1px solid #4f93fe !important;
}
.blue > span {
  background-color: #4f93fe !important;
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

/* 底部 */
.footer {
  flex: 1;
  display: flex;
  color: #fff;
  font-size: 1rem;
  align-items: center;
  min-height: 1.2rem;
  justify-content: center;
  font-family: "MicrosoftYaHei";
  background-color: #aaa;
}
@media screen and (max-width: 1540px) {
  /* 答题卡 */
  .article > div {
    margin: 0 4rem;
  }
  /* 试题序号 */
  .number {
    margin: 0.6rem;
  }
}
@media screen and (max-width: 1750px) {
  .number > span {
    margin: 0.2rem;
  }
}
@media screen and (max-width: 1595px) {
  .number > span {
    width: 2.5rem;
    height: 2.5rem;
    line-height: 2.5rem;
  }
}
@media screen and (max-width: 1540px) {
  .article > div {
    margin: 0 4rem;
  }
}
@media only screen and (max-width: 1367px) {
  .article > div {
    margin: 0 2rem;
  }
}
</style>
