<template>
  <div class="record">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <h3>
      我的错题
      <button v-if="is_filtration" @click="is_filtration = !is_filtration">
        收起∧
      </button>
      <button v-else @click="is_filtration = !is_filtration">展开∨</button>
    </h3>
    <div class="filtration" v-if="is_filtration">
      <div class="condition">
        <div>类型:</div>
        <div class="filter">
          <span
            v-for="(item, index) in arr"
            :key="index"
            @click="recruit(index)"
            :class="item.is ? 'blue' : ''"
            >{{ item.name }}</span
          >
        </div>
      </div>
      <div class="condition">
        <div>学科:</div>
        <div class="filter">
          <span
            v-for="(item, index) in subjects"
            :key="index"
            @click="getsubject(index)"
            :class="item.is ? 'blue' : ''"
            >{{ item.subjectname }}</span
          >
          <button
            class="btn"
            v-if="papertype != 1"
            @click="search(true)"
            style="margin-left:5rem;"
          >
            搜索
          </button>
        </div>
      </div>
      <div class="condition" v-if="papertype == 1">
        <div>年级:</div>
        <div class="filter">
          <span
            v-for="(item, index) in books"
            :key="index"
            @click="getdirector(index)"
            :class="item.is ? 'blue' : ''"
            >{{ item.bookname }}</span
          >
        </div>
      </div>
      <div class="condition" style="border-bottom:none" v-if="papertype == 1">
        <div>章节:</div>
        <Cascader
          :data="directors"
          v-model="directorid"
          class="cascader"
        ></Cascader>
        <button class="btn" @click="search(true)">搜索</button>
      </div>
    </div>
    <div class="content">
      <div v-for="(item, i) in list" :key="i">
        <span>{{ i + 1 }}</span>
        <p v-html="item.questionstem">
          <span v-if="item.list.length > 0">( {{ item.answer_s }} )</span>
        </p>
        <img :src="danimg" v-if="item.qtype == 1" />
        <img :src="shuangimg" v-if="item.qtype == 2" />
        <!-- 选项 -->
        <div class="options1" v-if="item.is_analysis">
          <div
            v-for="(option, index) in item.list"
            :class="{ pitch_on: option.questionOption.corrected == 1 }"
            :key="index"
          >
            <span>
              <i>{{ arr1[index] }}</i>
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
          <div v-if="item.qanalyze == null">空</div>
          <div v-else>{{ item.qanalyze }}</div>
        </div>
        <span class="analysis">
          <button @click="getanalysis(item)" v-if="item.is_analysis">
            折叠>
          </button>
          <button @click="getanalysis(item)" v-else>查看题目解析></button>
        </span>
      </div>
      <span class="page_class" v-if="list.length > 0">
        <Page
          :current="pageCurrent"
          :page-size="pageSize"
          :total="dataCount"
          @on-change="changepage"
        />
      </span>
    </div>
  </div>
</template>

<script>
// import {DatePicker} from 'iview';
export default {
  data() {
    return {
      //   分页功能
      pageSize: 10, //每页显示多少条
      dataCount: 0, //总条数
      pageCurrent: 1, //当前页
      spinShow: false,
      mistakesimg: require("@/assets/img/personal/mistakes.png"),
      clockimg: require("@/assets/img/personal/clock.png"),
      answer_img: require("@/assets/img/exercise/answer_1.png"), // 解析 正确答案
      analysis_img: require("@/assets/img/exercise/analysis_1.png"), // 解析  解析图片
      danimg: require("@/assets/img/dan.png"), // 单选
      shuangimg: require("@/assets/img/shuang.png"), // 多选
      li: ["1", "1", "1", "1", "1"],
      arr: [{ name: "同步" }, { name: "高招" }, { name: "中招" }], // 同步/高招/中招
      arr1: ["A", "B", "C", "D", "E", "F", "G", "H"],
      papertype: 1, //同步ID
      levels: [], // 学科
      levelid: null, //学科ID
      subjects: [], //  学段
      subjectid: null, //学段ID
      books: [], //  年级/分册
      bookid: null, // 年级/分册ID
      directors: [
        {
          value: "0",
          label: "不限"
        }
      ], //章节
      directorid: ["0"], //章节ID
      is_filtration: true, // 筛选条件的展示与隐藏
      list: [], // 展示列表
      is_recruit: true // 是否切户类型
    };
  },
  computed: {
    getuser: function() {
      return this.$store.getters.get_user;
    }
  },
  mounted() {
    this.recruit(0);
    // 根据不同学校显示不同类型
    if (this.getuser.school.levelid == 1) {
      this.arr.splice(1, 2);
    } else if (this.getuser.school.levelid == 2) {
      this.arr.splice(1, 1);
    } else if (this.getuser.school.levelid == 3) {
      this.arr.splice(2, 1);
    }
  },
  methods: {
    changepage: function(index) {
      // 修改当前页
      this.pageCurrent = index;
      // 重新请求数据
      this.search();
    },
    recruit: function(index) {
      // 切换状态
      this.is_recruit = true;
      this.eliminate(this.arr);
      this.arr[index].is = true;
      // 每次获取列表之前先清除列表
      this.list = [];
      // 每次切换先清除掉选中的数据ID
      this.levelid = null; //学科ID
      this.subjectid = null; //学段ID
      this.bookid = null; // 年级/分册ID
      if (this.arr[index].name == "同步") {
        // 同步
        this.papertype = 1;
      } else if (this.arr[index].name == "高招") {
        // 高招
        this.papertype = 3;
      } else if (this.arr[index].name == "中招") {
        // 中招
        this.papertype = 2;
      }
      this.getstudying();
      this.$forceUpdate();
    },
    getstudying: function() {
      // 选择学段,获取学科
      this.eliminate(this.levels);
      this.levelid = this.getuser.school.levelid;
      // 清空学科后其他选项都清空
      this.subjects = []; //  学段
      this.books = []; //  年级/分册
      this.directors = [
        {
          value: "0",
          label: "不限"
        }
      ];
      this.directors = this.directors.slice(0, 1);
      this.bookid = null;
      this.directorid = [];
      // this.$forceUpdate();
      this.spinShow = true;
      var that = this;
      this.axios
        .post(this.$api.subject_list_subject, {
          levelid: this.levelid,
          schoolid: this.getuser.schoolid
        })
        .then(function(data) {
          if (data.code == 0) {
            if (data.obj != null) {
              that.subjects = data.obj;
              if (that.subjects.length > 0) {
                that.getsubject(0);
              }
            } else {
              that.$Message.error("暂无数据!"); // 请求失败后的友好提示
            }
            if (that.papertype != 1) {
              if (that.is_recruit) {
                that.search();
              }
            }
          } else {
            that.$Message.error(data.msg);
          }
          setTimeout(() => {
            that.spinShow = false;
          }, 800);
        })
        .catch(function() {
          that.spinShow = false;
          that.$Message.error("网络遇到问题,请重试!");
        });
    },
    getsubject: function(index) {
      // 选择学科,获取年级/分册
      this.eliminate(this.subjects);
      this.subjects[index].is = true;
      this.subjectid = this.subjects[index].subjectid;
      // 清空学科后其他选项都清空
      this.books = []; //  年级/分册
      this.directors = [
        {
          value: "0",
          label: "不限"
        }
      ];
      this.directors = this.directors.slice(0, 1);
      this.directorid = [];
      this.$forceUpdate();
      if (this.papertype == 1) {
        this.spinShow = true;
        var that = this;
        this.axios
          .post(this.$api.book_list_book, {
            subjectid: this.subjectid,
            schoolid: this.getuser.schoolid
          })
          .then(function(data) {
            if (data.code == 0) {
              if (data.obj != null) {
                that.books = data.obj;
                if (that.books.length > 0) {
                  that.getdirector(0);
                }
              } else {
                that.$Message.error("暂无数据!"); // 请求失败后的友好提示
              }
            } else {
              that.$Message.error(data.msg);
            }
            setTimeout(() => {
              that.spinShow = false;
            }, 800);
          })
          .catch(function() {
            that.spinShow = false;
            that.$Message.error("网络遇到问题,请重试!");
          });
      }
    },
    getdirector: function(index) {
      // 选择年级/分册,获取章节
      this.directors = [
        {
          value: "0",
          label: "不限"
        }
      ];
      this.eliminate(this.books);
      this.books[index].is = true;
      this.bookid = this.books[index].bookid;
      this.$forceUpdate();
      this.spinShow = true;
      var that = this;
      this.axios
        .post(this.$api.director_list_director, {
          // directorpid: 0, // 父id
          bookid: this.bookid, //教材下章节
          levelid: this.levelid, //学段id
          subjectid: this.subjectid, // 科目id
          schoolid: this.getuser.schoolid, // 学校id
          type: 3
        })
        .then(function(data) {
          if (data.code == 0) {
            that.directorid = ["0"];
            if (data.obj.length > 0) {
              for (var i = 0; i < data.obj.length; i++) {
                var item = data.obj;
                that.directors.push({
                  label: item[i].directorname,
                  value: item[i].directorid,
                  children: []
                });
                for (var j = 0; j < item[i].directors.length; j++) {
                  var item1 = item[i].directors;
                  that.directors[i + 1].children.push({
                    label: item1[j].directorname,
                    value: item1[j].directorid
                  });
                }
              }
            }
            if (that.is_recruit) {
              that.search();
            }
          } else {
            that.$Message.error(data.msg);
          }
          setTimeout(() => {
            that.spinShow = false;
          }, 800);
        })
        .catch(function() {
          that.spinShow = false;
          that.$Message.error("网络遇到问题,请重试!");
        });
    },
    search: function(is) {
      // 搜索
      if (is) {
        this.pageCurrent = 1;
      }
      // 先清空列表
      this.list = [];
      // 每次搜索跳到第一页
      var directorid = null;
      var postdata = null;
      if (this.papertype == 1) {
        // if (this.directorid[0] == 0) {
        //   directorid = this.directorid[0];
        // } else {
        //   directorid = this.directorid[1];
        // }
        directorid = this.directorid[0];
        postdata = {
          schoolid: this.getuser.schoolid,
          papertype: this.papertype,
          userid: this.getuser.userid,
          levelid: this.levelid,
          subjectid: this.subjectid,
          bookid: this.bookid,
          directorid: directorid,
          pageNum: this.pageCurrent
        };
      } else {
        postdata = {
          schoolid: this.getuser.schoolid,
          papertype: this.papertype,
          levelid: this.levelid,
          userid: this.getuser.userid,
          bookid: 0,
          directorid: 0,
          subjectid: this.subjectid,
          pageNum: this.pageCurrent
        };
      }
      directorid = this.directorid[0];
      this.spinShow = true;
      var that = this;
      this.axios
        .post(this.$api.question_list_errquestion, postdata)
        .then(function(data) {
          if (data.code == 0) {
            if (data.obj.list.length > 0) {
              that.dataCount = data.obj.total;
              that.list = data.obj.list;
            } else {
              that.$Message.error("您还没有该类型没有错题。"); // 请求失败后的友好提示
            }
            that.is_recruit = false;
          } else {
            that.$Message.error(data.msg); // 请求失败后的友好提示
          }
          setTimeout(() => {
            that.spinShow = false;
          }, 800);
        })
        .catch(function() {
          that.spinShow = false;
          that.$Message.error("网络遇到问题,请重试!"); // 请求失败后的友好提示
        });
    },
    getanalysis: function(question) {
      // 获取试题解析
      if (question.is_analysis) {
        question.is_analysis = false;
      } else {
        if (question.list == 0) {
          var that = this;
          this.axios
            .post(this.$api.question_list_errquestion_option, {
              userid: this.getuser.userid,
              questionid: question.questionid
            })
            .then(function(data) {
              if (data.code == 0) {
                if (data.obj.length > 0) {
                  question.list = data.obj;
                  for (var i = 0; i < question.list.length; i++) {
                    var item = question.list;
                    if (item[i].questionOption.corrected == 1) {
                      question.answer_s += that.arr1[i] + ",";
                      question.answer_s = question.answer_s.replace(
                        "undefined",
                        ""
                      ); //去除undefineds
                    }
                  }
                  // 去除结尾 , 号
                  question.answer_s = question.answer_s.slice(
                    0,
                    question.answer_s.length - 1
                  );
                  question.is_analysis = true;
                  that.$forceUpdate();
                } else {
                  that.$Message.error("试题选项为空!");
                }
              } else {
                that.$Message.error(data.msg);
              }
            })
            .catch(function() {
              that.$Message.error("网络遇到问题,请重试!");
            });
        } else {
          // 如果已经有试题 就不在请求 直接打开隐藏
          question.is_analysis = true;
        }
      }
      this.$forceUpdate();
    },
    eliminate: function(data) {
      // 用来关闭所有已选中的状态
      for (var i = 0; i < data.length; i++) {
        data[i].is = false;
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
h3 > button {
  float: right;
  font-size: 1rem;
  width: 4rem;
  height: 2rem;
  color: #fff;
  /* float: right; */
  border-radius: 0.2rem;
  background-color: #4f93fe;
}
/* 筛选题目 */
.condition {
  display: flex;
  /* margin-top: .5rem; */
  padding: 1rem 0;
  font-size: 0.8rem;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  border-bottom: 1px dashed #cecece;
}
.condition > div:nth-child(1) {
  width: 2rem;
  display: flex;
  align-items: center;
}
.filter {
  display: flex;
  margin-left: 1rem;
  flex-wrap: wrap;
}
.filter > span,
.condition > span {
  /* 鼠标移入变小手 */
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  margin: 0.2rem 0.5rem;
  margin-left: 0;
  /* margin-left: 1rem; */
  border-radius: 0.2rem;
  border: 1px solid #999999;
}
/* 章节 联动选择器 */
.cascader {
  margin: 0 1rem;
}
/* 筛选条件选中状态 */
.blue {
  background: #4f93fe;
  color: #fff !important;
  border: 1px solid #4f93fe !important;
}
/* 底下错题展示部分 */
.content > div {
  width: 100%;
  background: rgba(255, 255, 255, 1);
  border: 1px solid #4f93fe;
}
/* 试题 */
.content > div {
  box-sizing: border-box;
  margin-bottom: 1rem;
  position: relative;
  padding: 1.5rem 3rem 0.8rem 3rem;
}
/* 单双图片 */
.content > div > img {
  position: absolute;
  top: 0;
  right: 0;
}
/* 序号 */
.content > div > span:nth-child(1) {
  top: 1rem;
  left: -1rem;
  width: 2.5rem;
  height: 2.5rem;
  color: #fff;
  border-radius: 3px;
  position: absolute;
  text-align: center;
  line-height: 2.5rem;
  display: inline-block;
  background-color: #4f93fe;
}
/* 题目 */
.content > div > p {
  font-size: 1.5rem;
  font-family: MicrosoftYaHei-Bold;
  /* font-weight: bold; */
  color: #515a6e;
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
.answer_analysis > span > img {
  height: 1rem;
}
.answer_analysis > div {
  font-size: 1rem;
  color: #333 !important;
  margin: 1rem 0 1rem 0;
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
/* 分页功能 */
.page_class {
  display: flex;
  margin: 1rem 0;
  align-items: center;
  justify-content: center;
}
input:nth-child(2) {
  margin-left: 1rem;
}
input:nth-child(4) {
  border: 1px solid #e3e3e3;
  height: 2rem;
  /* 首行缩进 */
  text-indent: 0.5rem;
  border-radius: 0.2rem;
}
.btn {
  width: 4rem;
  height: 2rem;
  color: #fff;
  border-radius: 0.2rem;
  margin-left: 0.2rem;
  background-color: #188df5;
}

.bule {
  border: 1px solid #3361e6 !important;
}
</style>
