import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ding from '@/lib/ding'
// import api from '@/api/api'
import ButtonTab from 'vux/src/components/button-tab/button-tab.vue'
import ButtonTabItem from 'vux/src/components/button-tab/button-tab-item.vue'
import Swipeout from 'vux/src/components/swipeout/swipeout.vue'
import SwipeoutItem from 'vux/src/components/swipeout/swipeout-item.vue'
import SwipeoutButton from 'vux/src/components/swipeout/swipeout-button.vue'
import XInput from 'vux/src/components/x-input/index.vue'
import XTextarea from 'vux/src/components/x-textarea/index.vue'
import XButton from 'vux/src/components/x-button/index.vue'
import Checker from 'vux/src/components/checker/checker.vue'
import CheckerItem from 'vux/src/components/checker/checker-item.vue'
import Cell from 'vux/src/components/cell/index.vue'
import Box from 'vux/src/components/box/index.vue'
import Rater from 'vux/src/components/rater/index.vue'
import Toast from 'vux/src/components/toast/index.vue'
import Group from 'vux/src/components/group/index.vue'
import Datetime from 'vux/src/components/datetime/index.vue'
import Flexbox from 'vux/src/components/flexbox/flexbox.vue'
import FlexboxItem from 'vux/src/components/flexbox/flexbox-item.vue'
import Selector from 'vux/src/components/selector/index.vue'

Vue.config.productionTip = false
Vue.component('button-tab', ButtonTab);
Vue.component('button-tab-item', ButtonTabItem);
Vue.component('swipeout', Swipeout);
Vue.component('swipeout-item', SwipeoutItem);
Vue.component('swipeout-button', SwipeoutButton);
Vue.component('cell', Cell);
Vue.component('rater', Rater);
Vue.component('checker', Checker);
Vue.component('checker-item', CheckerItem);
Vue.component('x-textarea', XTextarea);
Vue.component('x-button', XButton);
Vue.component('x-input', XInput);
Vue.component('Box', Box);
Vue.component('toast', Toast);
Vue.component('group', Group);
Vue.component('datetime', Datetime);
Vue.component('flexbox', Flexbox);
Vue.component('flexbox-item', FlexboxItem);
Vue.component('selector', Selector);

store.dispatch('saveURL', location.href)
store.dispatch('saveDingTalkCode')
// initVue();
ding.getItcode().then(data => {
  initVue()
}).catch((err) => {
  let dd = window.dd
  dd.device.notification.alert({
    message: err.msg.errorMessage,
    title: '提示',
    buttonName: '确定',
    onSuccess: function() {
      // dd.biz.navigation.close()
    },
    onFail: function(err) {}
  });
})

Vue.prototype.dd = window.dd;

function initVue() {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}
