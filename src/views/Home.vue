<template>
  <div class="body_style">
    <x-input v-model="infos.title"
             placeholder="添加日程、会议、活动等标题"
             class="title_input">
      <p slot="label">主题<span class="tip">*</span></p>
    </x-input>
      <!--<group gutter="0">-->
        <!--<p class="title_">时间</p>-->
        <!--<flexbox class="address">-->
          <!--<flexbox-item class="address_time_item">-->
            <!--<div class="address-box">-->
              <!--<datetime class="time_xu" v-model="openDate" format="YYYY-MM-DD HH:mm"></datetime>-->
            <!--</div>-->
          <!--</flexbox-item>-->
          <!--<span>至</span>-->
          <!--<flexbox-item class="address_time_item">-->
            <!--<div class="address-box">-->
              <!--<datetime class="time_xu" v-model="closeDate" format="YYYY-MM-DD HH:mm"></datetime>-->
            <!--</div>-->
          <!--</flexbox-item>-->
        <!--</flexbox>-->
      <!--</group>-->
      <group gutter="8px">
        <div class="cytitle">参与人员<span style="margin-left:8px;font-size: 12px; color: #B2B2B2">点击头像即可删除添加的人员</span></div>
        <!--<div class="cyspan" v-for="per in personArr" :key="per.value">{{per.label | getName}}</div>-->
        <div v-if="userlist.length > 10">
          <div class="cyspan" v-for="(per, index) in userlist10" :key="index" @click="delPerson(per)">{{per.name | getName}}</div>
          <div class="cyspan">...</div>
        </div>
        <div v-else>
          <div class="cyspan" v-for="(per, index) in userlist" :key="index" @click="delPerson(per)">{{per.name | getName}}</div>
        </div>
        <div class="cyspan" @click="checkPerson">+</div>
      </group>
      <group gutter="0" label-width="5.5em" label-margin-right="30px">
        <datetime v-model="infos.starttm"
                  format="YYYY-MM-DD HH:mm"
                  required>
          <p slot="title">开始时间<span class="tip">*</span></p>
        </datetime>
        <datetime v-model="infos.endtm"
                  format="YYYY-MM-DD HH:mm"
                  required>
          <p slot="title">结束时间<span class="tip">*</span></p>
        </datetime>
        <selector v-model="infos.warn"
                  title="提前提醒"
                  :options="planList"
                  direction="rtl">
        </selector>
        <x-input title="地点"
                 v-model="infos.address"
                 text-align="right">
        </x-input>
        <x-textarea :max="50"
                    title="描述"
                    rows="2"
                    v-model="infos.description"
                    placeholder="请添加详情描述">
        </x-textarea>
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
        infos: {
          title: '',
          starttm: '',
          endtm: '',
          warn: '2',
          address: '',
          description: ''
        },
        userlist10: [],
        userlist: [],
        showtoastinfo: false,
        toastmsg: '',
        planList: [{ key: '1', value: '提前5分钟' }, { key: '2', value: '提前15分钟' }, { key: '3', value: '提前25分钟' }],
        openDate: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes(),
        closeDate: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes()
      }
    },
    filters: {
      getName(data) {
        if (data.indexOf('-') > 0) {
          data = data.split('-')[0]
        } else if (data.indexOf('(') > 0) {
          data = data.split('(')[0]
        } else if (data.indexOf('（') > 0) {
          data = data.split('（')[0]
        }
        return data.substr(data.length - 2)
      }
    },
    created() {},
    methods: {
      /**
       * 选人
       */
      checkPerson() {
        let _that = this;
        let dd = window.dd;
        dd.ready(function () {
          dd.biz.contact.complexPicker({
            title: '选择人员',
            corpId: 'ding7d5c838d71be2f8535c2f4657eb6378f',
            multiple: true,
            limitTips: '超出人员限制',
            maxUsers: 1000,
            pickedUsers: _that.userlist,
            appId: 223447773,
            permissionType: 'GLOBAL',
            responseUserOnly: true,
            startWithDepartmentId: 0,
            onSuccess: function (result) {
              if (result.users.length > 10) {
                _that.userlist10 = result.users.slice(0, 10);
                _that.userlist = result.users;
              }
              _that.userlist = result.users;
            },
            onFail: function (err) {
              _that.showtoastinfo = true
              _that.toastmsg = '获取数据失败'
            }
          });
        });
        dd.error(function (err) {
          console.log('dd ding error: ' + window.location.href + JSON.stringify(err));
        });
      },
      /**
       * 删除人员
       * @param per
       */
      delPerson(per) {
        this.userlist = this.userlist.filter(function (item) {
           return item !== per;
        })
      },
      subInfo () {
        this.showtoastinfo = true
        this.toastmsg = '提交成功!'
      }
    }
  }
</script>

<style scoped lang='less'>
  @import '~vux/src/styles/1px.less';
  .body_style {
    background-color: rgb(241, 241, 241);
    padding-top: 1px;
    padding-bottom: 165px;
  }
  .title_input {
    height: 40px;
    margin-top: 8px;
    background-color:rgb(92, 92, 92);
    font-size: 20px;
    color: #fafafa;
    border-radius: 8px;
  }
  .title_ {
    float: left;
    margin: 0 0 3px 15px;
    font-size: 16px;
    color: rgb(17, 17, 17);
  }
  .address {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    width: 100vw;
  }
  @width: 100vw;
  @10w: 10vw;
  .address-item {
    width: @width / 3;
    height: 2.8rem;
    text-align: center;
    margin: 0 0 8px 0;
    border-radius: 3px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
  .address-item-selected {
    color: #33aa8d;
  }
  .address_time_item {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .address-box{
    width: 98%;
    height: 40px;
    margin-bottom: 2px;
    background-color: #E5E5E5;
    border-radius: 3px;
    border: 1px solid #E5E5E5;
  }
  .cytitle {
    padding: 10px 15px 5px 15px;
    font-size: 16px;
  }
  .cyspan {
    float: left;
    margin: 10px 10px 10px 15px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    border: 1px solid rgb(47, 111, 253);
    border-radius: 50%;
    font-size: .8rem;
    text-align: center;
    color: #000000;
  }
  .errors-tip {
    font-size: 1em;
    color: #f00;
  }
  .tip {
    color: #f00;
  }
</style>
<style>
  .weui-cell__ft:after {
    content: none!important;
  }
  .time_xu > .vux-datetime-value{
    text-align: center;
  }
</style>
