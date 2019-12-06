import Vue from "vue";
import {
  Tooltip,
  Radio,
  RadioGroup,
  Message,
  DatePicker,
  Cascader,
  Tabs,
  TabPane,
  Page,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Tree,
  Button,
  Spin,
  Poptip
} from "iview";

// Vue.component('Button', Button)
Vue.component("Tooltip", Tooltip); //悬浮文字提示
Vue.component("Radio", Radio);
Vue.component("RadioGroup", RadioGroup); // 单选框
Vue.component("DatePicker", DatePicker); // 日期选择器
Vue.component("Cascader", Cascader); // 联动下拉选择器
Vue.component("Tabs", Tabs);
Vue.component("TabPane", TabPane); // 标签页
Vue.component("Page", Page); // 分页功能
Vue.component("Dropdown", Dropdown); // 下拉展示功能
Vue.component("DropdownMenu", DropdownMenu); // 下拉展示功能
Vue.component("DropdownItem", DropdownItem); // 下拉展示功能
Vue.component("Tree", Tree); //  树状结构
Vue.component("Button", Button); //  树状结构
Vue.component("Spin", Spin); //  树状结构
Vue.component("Poptip", Poptip); //  气泡提示框
Vue.prototype.$Message = Message; // 全局提示
import "iview/dist/styles/iview.css";
