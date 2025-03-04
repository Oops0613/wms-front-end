<template>
  <div class="notice">
    <div class="notice-con" id="box1" :scrollLeft="scrollLeft" @mouseenter="noticeStop" @mouseleave="startScroll">
      <ul id="item1" v-html="noticeText"></ul>
<!--      <ul id="item2" v-html="noticeText" v-if="isScroll"></ul>-->
    </div>
  </div>
</template>

<script>
import {getLatestNotice} from "@/api/notice";

export default {
  props: {
    //滚动周期（秒）
    cycle: {
      type: Number,
      default: 20,
    },
  },
  data() {
    return {
      noticeList: [],
      timer: null,
      scrollLeft: 0,
      noticeText: '',
      isScroll: false,
    }
  },
  methods: {
    startScroll() {
      this.noticeScroll('box1', 'item1', this.cycle, this.scrollLeft);
    },
    //获取公告
    getNotice() {
      getLatestNotice().then(res=>{
        this.noticeList=res.data;
        //将https网址替换为超链接
        var regex = /\[(.*?)\|(https?:\/\/.*?)\]/g;
        this.noticeList.forEach(res => {
          let content = res.content.replace(regex, function (match, text, url) {
            return '<a href="' + url + '" target="_blank" style="color:#2F80ED; text-decoration: underline;">' + text + '</a>';
          });
          this.noticeText += content + '；';
        })
        this.$nextTick(() => {
          var box = document.getElementById('box1');
          var ul1 = document.getElementById('item1');
          //@TODO 下面这行代码增加公告的滚动条件（长度）
          this.isScroll = ul1.offsetWidth > box.offsetWidth;
          if (this.isScroll) {
            this.noticeScroll('box1', 'item1', this.cycle);
          }
        })
      })
    },
    //滚动公告
    noticeScroll(box1, item1, time, scrollLeft = 0) {
      var box = document.getElementById(box1);
      var ul1 = document.getElementById(item1);
      if (box == null || ul1 == null) {
        return;
      }
      box.scrollLeft = scrollLeft;
      this.scrollLeft = 0;
      this.timer = setInterval(() => {
        if (box.scrollLeft >= ul1.scrollWidth) {
          box.scrollLeft = 0;
          this.scrollLeft = 0;
        } else {
          box.scrollLeft++;
          this.scrollLeft = box.scrollLeft
        }
      }, time);
    },
    noticeStop() {
      clearInterval(this.timer);
    },
  },
  mounted() {
    this.getNotice();
  },
}
</script>

<style lang="scss">
.notice {
  margin-bottom: 0px;
  height: 40px;
  overflow: hidden;
  position: relative;

  .notice-con {
    color: red;
    white-space: nowrap;
    flex: 1;
    height: 40px;
    overflow: hidden;
    margin-left: 0px;
    box-sizing: border-box;

    ul {
      height: 40px;
      line-height: 40px;
      display: inline-block;
      white-space: nowrap;
    }
  }
}
</style>
