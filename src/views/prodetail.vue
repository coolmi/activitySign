<template>
  <div class="body_style">
    <div class="actity">
      <cell
        title="活动"
        style="text-align: center;"
        is-link
        :border-intent="false"
        :arrow-direction="arrows ? 'up' : 'down'"
        @click.native="arrows = !arrows">
      </cell>
      <template v-if="arrows">
        <ul class="ac_card">
          <li class="card_ul" style="margin-top: 15px;margin-bottom: 3px">
            <img src="../assets/images/time.png" style="width: 15px">
            <span style="font-size: 12px;margin-left: 8px;">{{actime}}</span>
          </li>
          <li class="card_ul">
            <img src="../assets/images/title.png" style="width: 15px">
            <span style="font-size: 18px;font-weight: bold;margin-left: 8px">{{actitle}}</span>
          </li>
          <li class="card_ul" style="margin-top: 15px">
            <img src="../assets/images/content.png" style="width: 15px">
            <span style="margin-left: 8px">{{acontent}}</span>
          </li>
        </ul>
      </template>
    </div>
    <group label-width="5.5em" label-margin-right="30px">
      <div style="border-bottom: 1px solid rgb(240, 240, 240)">
        <div class="qd_img">
          <img src="../assets/images/sign.png">
          <span>快速签到</span>
        </div>
      </div>
      <div class="checktitle">已签到<span style="margin-left: 6px">{{signuserlist.length}}</span></div>
      <div>
        <div class="checkspan" v-for="(per, index) in signuserlist" :key="index">{{per.name}}</div>
        <!--<div class="checkspan">...</div>-->
        <!--<div v-if="checkhide" class="checkspan" @click="perhide">收起</div>-->
      </div>
      <br>
      <br>
      <div class="checktitle" style="border-top: 1px solid rgb(240, 240, 240)">未签到<span style="margin-left: 6px">{{unsignuserlist.length}}</span></div>
      <div>
        <div class="checkspan" v-for="(per, index) in unsignuserlist" :key="index">{{per.name}}</div>
      </div>
      <br>
      <br>
      <br>
      <div style="height:44px;">
        <button-tab class="top_but" v-model="selectedIndex">
          <button-tab-item :selected="selectedIndex === index" v-for="(item, index) in tabList"
                           @click.native="tabItemClick(index)" :key="index">{{item.name}}
          </button-tab-item>
        </button-tab>
      </div>
      <div v-if="selectedIndex === 0 && unfinishList.length > 0">
        <swipeout>
          <swipeout-item :threshold=".5" transition-mode="follow" v-for="item in unfinishList" :key="item.id" class="bor_">
            <div slot="right-menu">
              <swipeout-button @click.native="editClick(item)" background-color="#336DD6">修改</swipeout-button>
            </div>
            <div slot="content" class="list-content" @click="eventView(item)">
              <img slot="icon" width="35" height="35" v-if="item.avatar" class="cellImg"
                   :src="item.avatar">
              <div slot="icon" class="cellDiv" v-else>
                {{item.name}}
              </div>
              <div class="content_div">
                <span>{{item.name + '提出来' + item.event + ',请及时评价!'}}</span>
                <span>{{item.time}}</span>
              </div>
            </div>
          </swipeout-item>
        </swipeout>
      </div>
      <div v-if="selectedIndex === 1 && finishList.length > 0">
        <swipeout>
          <swipeout-item :threshold=".5" transition-mode="follow" v-for="item in finishList" :key="item.id" class="bor_">
            <div slot="content" class="list-content" @click="eventView(item)">
              <img slot="icon" width="35" height="35" v-if="item.avatar" class="cellImg"
                   :src="item.avatar">
              <div slot="icon" class="cellDiv" v-else>
                {{item.name}}
              </div>
              <div class="content_div">
                <span>{{item.name + '提出来' + item.event + ',评价完成!'}}</span>
                <span>{{item.time}}</span>
              </div>
            </div>
          </swipeout-item>
        </swipeout>
      </div>
    </group>
    <box gap="40px 30px">
      <x-button text="提交" @click.native="subInfo" :gradients="['#1D62F0', '#19D5FD']"></x-button>
    </box>
    <toast v-model="showtoastinfo" type="text" :time="800" is-show-mask :text="toastmsg" position="middle">{{toastmsg}}</toast>
  </div>
</template>

<script>
  // import whole from '../lib/whole';
  export default {
    data () {
      return {
        arrows: true,
        signperson: true,
        signuserlist: [{ name: '炳然' }, { name: '战华' }, { name: '长孟' }, { name: '乐文' }],
        unsignuserlist: [{ name: '张三' }, { name: '李四' }, { name: '王五' }],
        starttm: '专用标题',
        selectedIndex: 0,
        tabList: [
          { name: '全部' },
          { name: '回复' }
        ],
        actime: '2019-03-12',
        actitle: '去野炊',
        acontent: '有烤串,火锅,吃完饭,还可以爬山.',
        unfinishList: [],
        finishList: [],
        showtoastinfo: false,
        toastmsg: ''
      }
    },
    watch: {
    },
    filters: {},
    created() {},
    methods: {}
  }
</script>

<style scoped lang='less'>
  @import '~vux/src/styles/1px.less';
  .body_style {
    background-color: rgb(241, 241, 241);
  }
  .qd_img {
    margin: 30px 10px 30px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    img {
      width: 35px;
      margin-bottom: 5px;
    }
    span {
      color: rgb(52, 136, 255);
    }
  }
  .checktitle {
    padding: 10px 15px 5px 15px;
    font-size: 16px;
  }
  .checkspan {
    float: left;
    margin: 10px 10px 10px 15px;
    width: 30px;
    height: 30px;
    line-height: 28px;
    background-color: rgb(47, 111, 253);
    border-radius: 50%;
    font-size: .8rem;
    text-align: center;
    color: rgb(255, 255, 255);
  }
  .actity {
    background-color: rgb(253, 241, 62);
  }
  .ac_card {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    background-color: #FFFFFF;
    box-shadow: 0px 0px 10px rgb(230, 230, 230);
    height: 160px;
  }
  .card_ul {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin-left: 15px;
  }
</style>
