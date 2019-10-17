// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Bootstrap from 'bootstrap'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import VueCurrencyFilter from 'vue-currency-filter'


import App from './App'
import router from './router'
import './bus' //注入eventbus

Vue.use(VueAxios, axios);
Vue.config.productionTip = false;
Vue.component('Loading', Loading);
Vue.use(VueCurrencyFilter,
  {
    symbol : '$',
    thousandsSeparator: '.',
    fractionCount: 2,
    fractionSeparator: ',',
    symbolPosition: 'front',
    symbolSpacing: true
  });
axios.defaults.withCredentials = true;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});

router.beforeEach((to, from, next) => {
  console.log("to:",to, "from:",from, "next:",next);
  if(to.meta.requiresAuth){ //需要登入驗證
    const api = `${process.env.APIPATH}/api/user/check`
    axios.post(api).then((response) => {
      console.log(response.data);
      if(response.data.success){
        next();
      }else{
        next({
          path:'/login'
        });
      }
    });  
  }else{
    next();
  }
});
