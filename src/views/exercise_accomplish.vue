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
          <p>章节: {{ zhangjie }}</p>
        </div>
        <div class="content">
          <div class="content_left">
            <div
              v-for="(item, i) in questions"
              :key="i"
              :class="item.answered == 1 ? 'blue' : ''"
              class="question"
            >
              <span>{{ i + 1 }}</span>
              <p v-html="item.question.questionstem"></p>
              <img :src="danimg" v-if="item.qtype == 1" />
              <img :src="shuangimg" v-if="item.qtype == 2" />
              <div class="options1">
                <div
                  v-for="(option, index) in item.tuserPaperQuesitonOptions"
                  :class="
                    item.answers.indexOf(option.questionOption.optionid, 0) >= 0
                      ? option.questionOption.corrected == 1
                        ? 'pitch_blue'
                        : 'pitch_red'
                      : ''
                  "
                  :key="index"
                >
                  <!-- <div
                  v-for="(option,index) in item.tuserPaperQuesitonOptions"
                  :key="index"
                  >-->

                  <!-- :class="item.answers==option.questionOption.optionid ?(item.corrected == 1?'pitch_blue':'pitch_red'): ''" -->
                  <!-- :class="{'pitch_blue':option.ischoose}"  indexOf("1","2") -->
                  <span>
                    <i>{{ arr[index] }}</i>
                  </span>
                  <b v-html="option.questionOption.optiontcontent"></b>
                </div>
              </div>
              <!-- 解析 -->
              <div class="answer_analysis" v-if="item.is_analysis">
                <span>
                  <img :src="answer_img" alt />
                  <span>正确答案</span>
                </span>
                <div>{{ item.answer_s }}</div>
                <span>
                  <img id="analysis_img" :src="analysis_img" alt />
                  <span>解析</span>
                </span>
                <div v-if="item.question.qanalyze == null">空</div>
                <div v-else>{{ item.question.qanalyze }}</div>
                <!-- <span>
                  <img id="analysis_img" :src="pen_img" alt />
                  <span>考点</span>
                </span>
                <div>标点符号辨析</div>-->
              </div>
              <span class="analysis">
                <button @click="getanalysis(item)" v-if="item.is_analysis">
                  折叠>
                </button>
                <button @click="getanalysis(item)" v-else>查看题目解析></button>
              </span>
            </div>
            <span class="preserve">
              <button @click="save">继续学习</button>
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
                <p>正确</p>
                <span></span>
                <p>错误</p>
                <!-- <span></span>
                <p>未做</p>-->
              </span>
            </div>
            <div>
              <p>选择题</p>
              <div class="number">
                <span
                  v-for="(item, i) in questions"
                  :key="i"
                  :class="
                    item.answered == 1
                      ? item.corrected == 1
                        ? 'blue'
                        : 'red'
                      : ''
                  "
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
      content_width: "", //保留 本身 宽度
      logo: require("@/assets/img/personal/logo.png"), // 公司logo
      answerimg: require("@/assets/img/exercise/answer.png"), //  答案卡
      answer_img: require("@/assets/img/exercise/answer_1.png"), // 解析 正确答案
      analysis_img: require("@/assets/img/exercise/analysis_1.png"), // 解析  解析图片
      // pen_img: require("@/assets/img/exercise/pen_1.png"), // 解析 考点
      pencilimg: require("@/assets/img/exercise/pencil.png"), // 限时 图标 trophy
      arrowsimg: require("@/assets/img/exercise/arrows.png"), // 返回 顶部
      danimg: require("@/assets/img/dan.png"), // 单选
      shuangimg: require("@/assets/img/shuang.png"), // 多选

      questions: {}, //所有试题
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
    getispaper: function() {
      return this.$store.getters.get_is_paper;
    },
    getpaper: function() {
      return this.$store.getters.get_paper;
    },
    getuserpaper: function() {
      return this.$store.getters.get_userpaper;
    }
  },
  mounted() {
    this.content_width = document.getElementById("content_right").offsetWidth; //本身的宽度
    window.addEventListener("scroll", this.scrollToTop);
    // 监听视口变化
    window.onresize = () => {
      this.content_width = document.getElementById("content_right").offsetWidth; //本身的宽度
    };
    this.getpapergetpaper();
  },
  destroyed() {
    window.removeEventListener("scroll", this.scrollToTop); //删除监听页面滚动事件
  },
  methods: {
    getpapergetpaper: function() {
      // 获取试卷
      var paperid = null;
      if (this.getispaper) {
        paperid = this.getuserpaper.paperid;
      } else {
        paperid = this.getpaper.paperid;
      }
      var that = this;
      this.axios
        .post(this.$api.paper_get_paper, {
          paperid: paperid, // 试卷ID
          userid: this.getuser.userid // 用户id
        })
        .then(function(data) {
          if (data.code == 0) {
            that.questions = data.obj;
            // 保存正确答案展示
            for (var i = 0; i < that.questions.length; i++) {
              var item = that.questions;
              for (
                var j = 0;
                j < item[i].tuserPaperQuesitonOptions.length;
                j++
              ) {
                // 设置默认值  避免报错
                if (item[i].answers == null || !item[i].answers) {
                  item[i].answers = "ABC";
                }
                var item1 = item[i].tuserPaperQuesitonOptions;
                if (item1[j].questionOption.corrected == 1) {
                  item[i].answer_s += that.arr[j] + ",";
                  item[i].answer_s = item[i].answer_s.replace("undefined", ""); //去除undefineds
                }
              }
              // 去除结尾 , 号
              item[i].answer_s = item[i].answer_s.slice(
                0,
                item[i].answer_s.length - 1
              );
            }

            that.xueke = that.questions[0].subjectname;
            that.zhangjie = that.questions[0].directorname;
          } else {
            that.$Message.error(data.msg); // 请求失败后的友好提示
          }
        })
        .catch(function() {
          that.$Message.error("网络遇到问题,请重试!"); // 请求失败后的友好提示
        });
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
      // console.info(content_right)
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
    getanalysis: function(question) {
      //  详情按钮 展示与折叠
      if (question.is_analysis) {
        question.is_analysis = false;
      } else {
        question.is_analysis = true;
      }
      this.$forceUpdate();
    },
    questionscroll: function(index) {
      // 右侧序号点击定位
      var questionde = document.getElementsByClassName("question")[index];

      // if (window.pageYOffset != 0) {
      window.pageYOffset = questionde.offsetTop;
      // } else if (document.documentElement.scrollTop != 0) {
      document.documentElement.scrollTop = questionde.offsetTop;
      // } else if (document.body.scrollTop != 0) {
      document.body.scrollTop = questionde.offsetTop;
      // }
      // var scrollTop =
      // window.pageYOffset?window.pageYOffset = questionde.offsetTop:0;
      // document.documentElement.scrollTop ||
      // document.body.scrollTop; //当前滚动的距离
      // scrollTop = questionde.offsetTop;
      // console.info(questionde.offsetTop)
      // console.info(document.documentElement.scrollTop);
    },
    save: function() {
      this.$router.push("/Settings");
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
  float: right;
  background-color: #fff;
  border: 1px solid rgba(227, 227, 227, 1);
  box-shadow: 0px 0px 8px 0px rgba(223, 223, 223, 0.61);
}
#content_right > div:nth-child(1) {
  display: flex;
  padding: 1rem;
  justify-content: space-between;
  border: 1px solid rgba(227, 227, 227, 1);
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
#content_right > div:nth-child(2) {
  padding: 1rem;
  border-left: 1px solid rgba(227, 227, 227, 1);
  border-right: 1px solid rgba(227, 227, 227, 1);
  border-bottom: 1px solid rgba(227, 227, 227, 1);
}
#content_right > div:nth-child(2) p {
  font-size: 1.3rem;
  color: #333333;
  font-family: MicrosoftYaHei;
  font-weight: 400;
}
/* 正确-错误 */
.state > span {
  width: 1rem;
  height: 1rem;
  border-radius: 2px;
  background-color: #4f93fe;
}
.state > span:nth-child(3) {
  margin-left: 0.5rem;
  background-color: #fe4f4f !important;
}
.state > span:nth-child(5) {
  margin-left: 0.5rem;
  background-color: #dfdfdf !important;
}
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
  margin: 0.8rem;
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
.content_left > div > span:nth-child(1) {
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
/* 查看题目解析 */
.analysis {
  display: flex;
  justify-content: flex-end;
  /* float: right; */
}
.analysis button {
  color: #4f93fe;
  border: 1px solid #99c0eb;
  font-size: 0.8rem;
  padding: 0.4rem 0.8rem;
  background-color: #fff;
  border-radius: 0.4rem;
}
/* 答案及解析 */
.answer_analysis > span {
  display: flex;
  color: #333 !important;
  font-size: 1.1rem;
  align-items: center;
}
.answer_analysis > span > span {
  margin-left: 0.5rem;
}
.answer_analysis > div {
  font-size: 1rem;
  color: #333 !important;
  margin: 1rem 0 1rem 0;
}
/* 已选中 */
.blue {
  border: 1px solid #4f93fe !important;
  color: #4f93fe !important;
}
.blue > span:nth-child(1) {
  background-color: #4f93fe !important;
}
.red {
  border: 1px solid #fe4f4f !important;
  color: #fe4f4f !important;
}
.red > span:nth-child(1) {
  background-color: #fe4f4f !important;
}
/* 选中选项 */
/* 正确 */
.pitch_blue {
  border: solid 1px #1764ef !important;
}
.pitch_blue > span {
  color: #fff;
  background-color: #4f93fe;
}
.pitch_red {
  border: solid 1px #fe4f4f !important;
}
.pitch_red > span {
  color: #fff;
  background-color: #fe4f4f;
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
@media screen and (max-width: 1910px) {
  .number > span {
    margin: 0.5rem;
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
