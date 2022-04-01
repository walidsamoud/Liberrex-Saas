import Vue from 'vue'
import Vuesax from 'vuesax'
import Vuex from 'vuex'
import {ApiConfigs, authHeader} from './_helpers'
import JsonCSV from 'vue-json-csv'
import App from './App.vue'

import Bugsnag from '@bugsnag/js'
import BugsnagPluginVue from '@bugsnag/plugin-vue'
Vue.prototype.$bugsnag = Bugsnag;
Bugsnag.start({
    apiKey: '603d8c3fed628eae61e68ec99ac95719',
    plugins: [new BugsnagPluginVue()]
});
Bugsnag.getPlugin('vue')
    .installVueErrorHandler(Vue)

import 'vuesax/dist/vuesax.css' //Vuesax styles
import 'material-icons/iconfont/material-icons.css';
// Vuex Store
import { store } from './_store';
// Theme Configurations
import '../themeConfig.js'
// Perfectscrollbar
// import PerfectScrollbar from "vue2-perfect-scrollbar";
// import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";
// Vue.use(PerfectScrollbar);
import Vuebar from 'vuebar';

//import promise
import 'es6-promise/auto';
import Promise from 'es6-promise';
if (!('Promise' in window)) {
  window.Promise = Promise;
} else if (!('finally' in window.Promise.prototype)) {
  window.Promise.prototype.finally = Promise.prototype.finally;
}

Vue.use(Vuesax);
Vue.use(Vuebar);
Vue.use(Vuex)
Vue.component('downloadCsv', JsonCSV)

// Theme Configurations
import 'prismjs'
import 'prismjs/themes/prism.css'
import VsPrism from './components/prism/VsPrism.vue';
Vue.component(VsPrism.name, VsPrism);
import VsSidebarGroup from './components/vs-sidebar-group/Sidebar-Group.vue';
Vue.component(VsSidebarGroup.name, VsSidebarGroup);
// i18n
import i18n from './i18n/i18n.js'
if(!localStorage.getItem('Language')) { localStorage.setItem('Language', 'en') }
// Vue Router
import { router } from './_helpers';
Vue.config.productionTip = true;
//Vue.config.silent = true;


import * as VueGoogleMaps from 'vue2-google-maps'
Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GOOGLE_MAPS_KEY,
    libraries: 'places'
  }
})

const VueInputMask = require('vue-inputmask').default
Vue.use(VueInputMask)

import Multiselect from 'vue-multiselect'
Vue.component('multiselect', Multiselect)
require('vue-multiselect/dist/vue-multiselect.min.css')


import VueTour from 'vue-tour'
Vue.use(VueTour)
require('vue-tour/dist/vue-tour.css')

Vue.mixin({
  data:  function() {
    return {
      mixin: null,
      get PermissionsConfig() {
        this.mixin= ( (JSON.parse(localStorage.getItem('user'))!=null)?JSON.parse(localStorage.getItem('user')).business.myLiberrex:null );
        return this.mixin;
      }
    }
  }
});

import VueConfirmDialog from 'vue-confirm-dialog'
 
Vue.use(VueConfirmDialog)
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)

new Vue({
  store,
  router,
  i18n,
  render: h => h(App),
}).$mount('#app')
import '@/assets/scss/style.scss'

// Moment
import moment from 'moment';
import 'moment-timezone';
moment.locale(i18n.locale == 'ar' ? 'ar-tn' : i18n.locale);
Vue.prototype.$moment = moment;

import Pusher from 'pusher-js' // import Pusher
//Pusher.logToConsole = true;
Vue.prototype.$pusher = new Pusher(process.env.VUE_APP_PUSHER_ID, {
        cluster: 'eu',
        encrypted: true,
        authEndpoint: ApiConfigs.broadcast_url+ApiConfigs.pusher.auth,
        auth: {
            headers: { ...authHeader() }
        }
    });

import VueFlags from "@growthbunker/vueflags";
Vue.use(VueFlags, {
    iconPath: '/images/flags/',
});

import VueTelInput from 'vue-tel-input'
Vue.use(VueTelInput)

import Tawk from 'vue-tawk';
Vue.use(Tawk, { tawkSrc: 'https://embed.tawk.to/5f74754ff0e7167d001501ed/default'});

// JSON.parse(localStorage.getItem('user')).business.myLiberrex.queue_allowed