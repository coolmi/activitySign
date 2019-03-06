<template>
  <div class="body_style">
    <x-input v-model="infos.title"
             placeholder="添加日程、会议、活动等标题"
             class="title_input">
      <p slot="label">主题<span class="tip">*</span></p>
    </x-input>
    <div class="content_envet">
      <group>
        <div class="cytitle">参与人员<span style="margin-left:8px;font-size: 12px; color: #B2B2B2">点击头像即可删除添加的人员</span></div>
        <!--<div class="cyspan" v-for="per in personArr" :key="per.value">{{per.label | getName}}</div>-->
        <div class="cyspan" v-for="(per, index) in userlist" :key="index" @click="delPerson(per)">{{per.name | getName}}</div>
        <div class="cyspan" @click="checkPerson">+</div>
      </group>
      <div>
        <p class="title_">时间</p>
        <flexbox class="address">
          <flexbox-item class="address_time_item">
            <div class="address-box">
              <datetime class="time_xu" v-model="openDate" format="YYYY-MM-DD HH:mm"></datetime>
            </div>
          </flexbox-item>
          <span>至</span>
          <flexbox-item class="address_time_item">
            <div class="address-box">
              <datetime class="time_xu" v-model="closeDate" format="YYYY-MM-DD HH:mm"></datetime>
            </div>
          </flexbox-item>
        </flexbox>
      </div>
      <!--<datetime v-model="infos.starttm"-->
                <!--format="YYYY-MM-DD HH:mm"-->
                <!--required>-->
        <!--<p slot="title">开始时间<span class="tip">*</span></p>-->
      <!--</datetime>-->
      <!--<datetime v-model="infos.endtm"-->
                <!--format="YYYY-MM-DD HH:mm"-->
                <!--required>-->
        <!--<p slot="title">结束时间<span class="tip">*</span></p>-->
      <!--</datetime>-->
      <selector v-if="infos.mclassid === '1' "
                v-model="infos.sendvideo"
                title="发起视频会议"
                :options="plainList"
                direction="rtl">
      </selector>
      <selector v-if="infos.sendvideo ==='是'"
                v-model="infos.dhjr"
                title="是否电话接入"
                :options="plainList"
                direction="rtl">
      </selector>
      <x-input v-if="infos.marea === '01'"
               title="费用(元/小时)"
               v-model="infos.mfee"
               :disabled="disabled"
               text-align="right">
      </x-input>
      <cell v-if="infos.marea === '01'" title="其他服务">
        <x-icon type="ios-plus-empty" size="20" @click.native="addResource"></x-icon>
      </cell>
      <!--<ul class="serviebox">-->
        <!--<li v-for="item in sourceinfo" :key="item.ress" class="servies">-->
          <!--<p>{{item.ress_name}}</p>-->
          <!--<p>数量{{item.ress_num}}</p><br>-->
        <!--</li>-->
      <!--</ul>-->
      <x-input title="会议提醒"
               value="请提前15分钟到场"
               :disabled="disabled"
               text-align="center">
      </x-input>
      <x-input v-if="infos.marea === '01'"
               title="费用合计"
               v-model="infos.allfee"
               :disabled="disabled"
               placeholder="仅供参考，实际以结算为主">
      </x-input>
      <x-textarea v-model="infos.content"
                  :rows="2"
                  name="会议详情"
                  :max="100"
                  autosize>
        <p slot="label">会议详情<span class="tip">*</span></p>
      </x-textarea>
      <x-textarea title="备注"
                  v-model="infos.remarks"
                  :rows="2" :max="100" autosize
                  placeholder="填完上述信息再添加会议室，除资费及参会人员外字段会自动同步">
      </x-textarea>
      <cell v-if="infos.sendvideo === '是'">
        <x-icon type="ios-plus-empty" size="20" @click.native="addMeet"></x-icon>
        <p slot="title">添加会议室<span class="tip">*</span></p>
        <ul class="serviebox">
          <li v-for="item in showuseinfo" :key="item.mid" class="servies">
            <p>{{item.mname}}</p><br>
          </li>
        </ul>
      </cell>
    </div>
    <div class="btn_foot">
      <x-button class="servicebtn" text="预约" @click.native="reserve"></x-button>
    </div>
    <toast v-model="showtoastinfo" type="text" :time="800" is-show-mask :text="toastmsg" position="middle">{{toastmsg}}</toast>
  </div>
</template>

<script>
  // import whole from '../lib/whole';
  export default {
    data () {
      return {
        userlist: [],
        showtoastinfo: false,
        toastmsg: '',
        openDate: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes(),
        closeDate: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes(),
        number: '',
        time: 10,
        userInfo: '',
        disabled: true,
        disab: false,
        timesrc: false,
        submitted: false,
        plainList: ['是', '否'],
        showuseinfo: [],
        infos: {
          title: '',
          mname: '',
          mclassid: '',
          mplace: '',
          useda: '',
          mresource: '',
          starttm: '',
          endtm: '',
          users: '',
          mintro: '',
          mid: '',
          ddids: '',
          content: '',
          copyuser: '',
          secret: '',
          remind: '',
          remarks: '',
          sendvideo: '',
          dhjr: '',
          mfee: '',
          allfee: 0,
          sendapp: '是',
          // 默认发送通知
          serverid: '',
          servernum: '',
          servername: '',
          source: []
        },
        source: {
          ress: '',
          ress_num: '',
          ress_name: ''
        }
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
              _that.userlist = result.users
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
      }
    }
  }
</script>

<style scoped lang='less'>
  @import '~vux/src/styles/1px.less';
  .body_style {
    background-color: rgb(241, 241, 241);
    padding-top: 1px;
  }
  .title_input {
    background-color:rgb(92, 92, 92);
    font-size: 20px;
    color: #fafafa;
    height: 40px;
    border-radius: 8px;
    margin-top: 9px;
    margin-bottom: 10px;
  }
  .cyspan {
    width: 30px;
    height: 30px;
    line-height: 30px;
    float: left;
    margin: 10px 10px 10px 15px;
    font-size: .8rem;
    text-align: center;
    border-radius: 50%;
    color: #000000;
    border: 1px solid rgb(47, 111, 253);
  }
  .title_ {
    float: left;
    margin: 0 0 3px 15px;
    font-size: 16px;
    color: rgb(17, 17, 17);
  }
  .address {
    width: 100vw;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
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
    background-color: #E5E5E5;
    border-radius: 3px;
    width: 98%;
    height: 40px;
    border: 1px solid #E5E5E5;
    margin-bottom: 2px;
  }
  .cytitle {
    padding: 10px 15px 5px 15px;
    font-size: 16px;
  }
  .content_envet{
    background-color: rgb(255, 255, 255);
  }
  .detail {
    text-align: center;
    height: 50px;
    position: fixed;
    line-height: 50px;
    bottom: 0;
    border: 1px solid #F1F0F3;
    background-color: #ffffff;
  }
  .btn_foot {
    background-color: rgb(241, 241, 241);
    padding-bottom: 16%;
    height: 12vw;
  }
  .servicebtn {
    margin: 0 auto;
    margin-top: 60px;
    margin-bottom: 15px;
    box-sizing: border-box;
    text-align: center;
    line-height: 40px;
    color: rgb(44, 156, 122);
    font-size: 18px;
    width: 90%;
    height: 40px;
    border: none;
    background-color: rgb(228, 231, 230);
    border-radius: 20px;
  }

  .servicebtn:after {
    border: none;
  }

  .serviebox {
    /*border-top:1px solid #E5E5E5;*/
  }

  .servies {
    list-style: none;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
  }

  .servies p {
    flex: 1;
    text-align: center;

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
