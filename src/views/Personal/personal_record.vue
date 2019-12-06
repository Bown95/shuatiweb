<template>
  <div class="record">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <h3>
      我的记录
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
          change-on-select
        ></Cascader>
        <button @click="search(true)">搜索</button>
      </div>
    </div>
    <div class="testpaper">
      <ul>
        <li v-for="(item, i) in list" :key="i" @click="getexercise(i)">
          <img :src="recordimg" />
          <div>
            <h4>{{ item.papername }}</h4>
            <div class="clock">
              <img :src="clockimg" />
              <p>开始时间：{{ item.starttime | formatDate }}</p>
              <img :src="clockimg" />
              <p>截止时间：{{ item.stoptime | formatDate }}</p>
            </div>
          </div>
        </li>
      </ul>
      <div class="page_class" v-if="list.length > 0">
        <Page
          :current="pageCurrent"
          :page-size="pageSize"
          :total="dataCount"
          @on-change="changepage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { setTimeout } from "timers";
export default {
  data() {
    return {
      //   分页功能
      pageSize: 10, //每页显示多少条
      dataCount: 0, //总条数
      pageCurrent: 1, //当前页
      spinShow: false,
      recordimg: require("@/assets/img/personal/recordimg.png"),
      clockimg: require("@/assets/img/personal/clock.png"),
      list: [],
      tabIndex: 0,
      arr: [{ name: "同步" }, { name: "高招" }, { name: "中招" }], // 同步/高招/中招
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
      directorid: [], //章节ID
      is_filtration: true, //搜索条件的展示
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
  filters: {
    /*
        时间格式自定义 只需把字符串里面的改成自己所需的格式
      */
    formatDate: function(value) {
      // 时间戳转换日期格式方法
      if (value == null) {
        return "";
      } else {
        value = value * 1000;
        let date = new Date(value);
        let y = date.getFullYear(); // 年
        let MM = date.getMonth() + 1; // 月
        MM = MM < 10 ? "0" + MM : MM;
        let d = date.getDate(); // 日
        d = d < 10 ? "0" + d : d;
        let h = date.getHours(); // 时
        h = h < 10 ? "0" + h : h;
        let m = date.getMinutes(); // 分
        m = m < 10 ? "0" + m : m;
        let s = date.getSeconds(); // 秒
        s = s < 10 ? "0" + s : s;
        return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
      }
    }
  },
  methods: {
    changepage: function(index) {
      // 修改当前页
      this.pageCurrent = index;
      // 重新请求数据
      this.search();
    },
    // gotopage: function(newpage, oldpage) {
    //   this.currpage = newpage;
    // },
    recruit: function(index) {
      // 选择类型
      this.is_recruit = true;
      this.eliminate(this.arr);
      this.arr[index].is = true;
      // 获取列表之前先清除列表
      this.list = [];
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
              if (that.papertype != 1) {
                if (that.is_recruit) {
                  that.search();
                }
              }
            } else {
              that.$Message.error(data.msg); // 请求失败后的友好提示
            }
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
                that.$Message.error(data.msg);
              }
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
          schoolid: this.getuser.schoolid,
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
    search: function(is) {
      // 搜索
      if (is) {
        this.pageCurrent = 1;
      }
      var directorid = null;
      var postdata = null;
      if (this.papertype == 1) {
        // 根据不同类型传不同值
        // if (this.directorid[0] == 0) {
        //   // 根据章节不同搜索
        //   directorid = this.directorid[0];
        // } else {
        //   directorid = this.directorid[1];
        // }
        directorid = this.directorid[0];
        if (
          this.levelid == null &&
          this.subjectid == null &&
          this.bookid == null &&
          directorid == null
        ) {
          this.$Message.error("搜索条件不完整!");
          return;
        }
        postdata = {
          schoolid: this.getuser.schoolid,
          papertype: this.papertype,
          userid: this.getuser.userid,
          levelid: this.levelid,
          subjectid: this.subjectid,
          bookid: this.bookid,
          directorid: directorid,
          currentpage: this.pageCurrent
        };
      } else {
        if (this.levelid == null && this.subjectid == null) {
          this.$Message.error("搜索条件不完整!");
          return;
        }
        postdata = {
          schoolid: this.getuser.schoolid,
          papertype: this.papertype,
          userid: this.getuser.userid,
          levelid: this.levelid,
          subjectid: this.subjectid,
          currentpage: this.pageCurrent
        };
      }
      this.spinShow = true;
      // 每次清空
      this.list = [];
      var that = this;
      this.axios
        .post(this.$api.paper_list_userPaperHistory, postdata)
        .then(function(data) {
          if (data.code == 0) {
            if (data.obj != null) {
              that.list = data.obj;
              that.is_recruit = false;
              that.dataCount = data.totalcount;
            } else {
              // 关闭只有切换类型才会自动搜索
              that.is_recruit = false;
              that.$Message.error(data.msg); // 请求失败后的友好提示
            }
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
    eliminate: function(data) {
      // 用来关闭所有已选中的状态
      for (var i = 0; i < data.length; i++) {
        data[i].is = false;
      }
    },
    getexercise: function(index) {
      // 获取试卷信息 转跳页面展示
      this.tabIndex = index;
      this.$store.commit("paper", this.list[index]);
      this.$store.commit("ispaper", false);
      this.$router.push("/exercise_accomplish");
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
  /* margin-top: .5rem; */
  padding: 1rem 0;
  display: flex;
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
.condition button {
  width: 4rem;
  height: 2rem;
  color: #fff;
  /* float: right; */
  border-radius: 0.2rem;
  background-color: #4f93fe;
}

.testpaper li {
  /* 鼠标移入变小手 */
  cursor: pointer;

  border-bottom: 1px solid #a7a7a7;
  padding: 1rem 0.8rem;
  display: flex;
}
/* 筛选条件选中状态 */
.blue {
  background: #4f93fe;
  color: #fff !important;
  border: 1px solid #4f93fe !important;
}
/* .bule {
  
} */
.testpaper li h4 {
  font-size: 1.5rem;
  font-family: MicrosoftYaHei;
  font-weight: 400;
}
.testpaper li > div {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.8rem 0 0 1.2rem;
}
.testpaper li:hover {
  border: 1px solid #3361e6 !important;
}
/* 分页功能 */
.page_class {
  display: flex;
  margin: 1rem 0;
  align-items: center;
  justify-content: center;
}
.clock {
  display: flex;
}
.clock p {
  width: 15rem;
  margin: 0 0.8rem;
}
</style>
