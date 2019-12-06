<template>
  <div class="paging" v-show="pages > 0">
    <span
      class="first_page"
      v-bind:class="{ unclickable: currpage == 1 }"
      v-on:click="begin_click()"
    >
      首页
    </span>
    <span
      class="prev_page"
      v-bind:class="{ unclickable: currpage == 1 }"
      v-on:click="last_click()"
    >
      上一页
    </span>
    <span
      v-bind:class="{ pitch_on: item == currpage }"
      class="pagination"
      v-for="(item, index) in showPageArr"
      v-on:click="num_click(item)"
      :key="index"
      >{{ item }}
    </span>
    <span
      class="next_page"
      v-bind:class="{ unclickable: currpage == pages || pages == 0 }"
      v-on:click="next_click()"
      >下一页
    </span>
    <span
      class="last_page"
      v-bind:class="{ unclickable: currpage == pages || pages == 0 }"
      v-on:click="end_click()"
      >末页
    </span>
  </div>
</template>

<script>
export default {
  name: "MyPage",
  props: {
    showpage: {
      type: Number,
      default: 10
    },
    currpage: {
      type: Number,
      default: 1
    },
    pages: {
      type: Number,
      default: 20
    }
  },
  computed: {
    showPageArr: function() {
      var halfshow = parseInt(this.showpage / 2);
      var tempbegin = this.currpage - halfshow + 1;
      var tempend = this.currpage + halfshow;
      if (tempbegin < 1) {
        tempend = tempend - tempbegin + 1;
        tempbegin = 1;
        if (tempend > this.pages) {
          tempend = this.pages;
        }
      } else if (tempend > this.pages) {
        tempbegin = this.pages - this.showpage + 1;
        tempend = this.pages;
        if (tempbegin < 1) {
          tempbegin = 1;
        }
      }

      var arr = [];
      for (var i = tempbegin; i <= tempend; i++) {
        arr.push(i);
      }
      return arr;
    }
  },

  methods: {
    num_click: function(num) {
      this.$emit("gotopage", num, this.currpage);
    },
    last_click: function() {
      if (this.currpage > 1) {
        this.$emit("gotopage", this.currpage - 1, this.currpage);
      }
    },
    next_click: function() {
      if (this.currpage < this.pages) {
        this.$emit("gotopage", this.currpage + 1, this.currpage);
      }
    },
    begin_click: function() {
      this.$emit("gotopage", 1, this.currpage);
    },
    end_click: function() {
      this.$emit("gotopage", this.pages, this.currpage);
    }
  }
};
</script>

<style scoped>
.paging {
  text-align: center;
}

.paging span {
  display: inline-block;
  padding: 10px 4px;
  border: 1px solid #dfdfdf;
  min-width: 36px;
  margin-right: 10px;
  cursor: pointer;
  moz-user-select: -moz-none;
  -moz-user-select: none;
  -o-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.paging span:last-of-type {
  margin-right: 0;
}

.paging span.pitch_on {
  background: #4b98ff;
  border: 1px solid #4b98ff;
  color: #ffffff;
}

.paging span.unclickable {
  color: #c3c3c3;
}

@media only screen and (max-width: 1601px) {
  .paging {
    margin-top: 4px;
  }

  .paging span {
    padding: 2px 2px;
    min-width: 26px;
    margin-right: 6px;
    font-size: 12px;
  }
}
</style>
