<style lang="scss">
.notice{ margin-bottom:0px; height:40px; overflow: hidden; position: relative;
  .notice-con{ color: red;  white-space:nowrap; flex:1; height:40px; overflow: hidden; margin-left:0px; box-sizing: border-box;
    ul{ height:40px; line-height:40px; display: inline-block; white-space: nowrap; }
  }
}
</style>

<template>
  <div class="notice">
    <div class="notice-con" id="box1" :scrollLeft="scrollLeft" @mouseenter="noticeStop" @mouseleave="startScroll">
      <ul id="item1" v-html="noticeText"></ul>
      <ul id="item2" v-html="noticeText" v-if="isScroll"></ul>
    </div>
  </div>

</template>

<script>
export default {
  props:{
    //滚动周期（秒）
    cycle:{
      type:Number,
      default:20,
    },
  },
  data(){
    return{
      noticeList:[],
      timer:null,
      scrollLeft:0,
      noticeText:'',
      isScroll:false,
    }
  },

  mounted() {
    this.getNotice();
  },

  methods: {


    startScroll(){
      this.noticeScroll('box1','item1', this.cycle, this.scrollLeft);
    },

    //获取公告
    getNotice(){
      this.noticeList = [
        {id:1, content:'各单位：\n' +
              '\n' +
              '根据国务院办公厅关于2025年部分节假日的安排，现将2025年元旦、春节、清明节、劳动节、端午节、国庆节和中秋节放假调休日期的具体安排通知如下：\n' +
              '\n' +
              '元旦：1月1日（周三）放假1天，不调休。\n' +
              '\n' +
              '春节：1月28日（农历除夕、周二）至2月4日（农历正月初七、周二）放假调休，共8天。1月26日（周日）、2月8日（周六）值班。\n' +
              '\n' +
              '清明节：4月4日（周五）至6日（周日）放假，共3天。\n' +
              '\n' +
              '劳动节：5月1日（周四）至5日（周一）放假调休，共5天。4月27日（周日）上课、上班，安排5月5日（周一）的教学工作。\n' +
              '\n' +
              '端午节：5月31日（周六）至6月2日（周一）放假，共3天。\n' +
              '\n' +
              '国庆节、中秋节：10月1日（周三）至8日（周三）放假调休，共8天。9月28日（周日）、10月11日（周六）上课、上班，9月28日（周日）安排10月7日（周二）的教学工作， 10月11日（周六）安排10月8日（周三）的教学工作。'},
      ]
      //将https网址替换为超链接
      var regex = /\[(.*?)\|(https?:\/\/.*?)\]/g;
      this.noticeList.forEach(res=>{
        let content = res.content.replace(regex, function(match, text, url) {
          return '<a href="' + url + '" target="_blank" style="color:#2F80ED; text-decoration: underline;">' + text + '</a>';
        });
        this.noticeText += content + '；';
      })
      this.$nextTick(()=>{
        var box = document.getElementById('box1');
        var ul1 = document.getElementById('item1');
        this.isScroll = ul1.offsetWidth > box.offsetWidth;
        if(this.isScroll){
          this.noticeScroll('box1','item1', this.cycle);
        }
      })
    },

    //滚动公告
    noticeScroll(box1, item1, time, scrollLeft=0){
      var box = document.getElementById(box1);
      var ul1 = document.getElementById(item1);
      if(box==null||ul1==null){ return; }
      box.scrollLeft = scrollLeft;
      this.scrollLeft = 0;
      this.timer = setInterval(()=>{
        if (box.scrollLeft >= ul1.scrollWidth) {
          box.scrollLeft = 0;
          this.scrollLeft = 0;
        } else {
          box.scrollLeft++;
          this.scrollLeft = box.scrollLeft
        }
      }, time);
    },

    noticeStop(){
      clearInterval(this.timer);
    },
  },
}
</script>

