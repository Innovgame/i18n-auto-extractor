import Vue from 'vue'
import App from './App.vue'
import { i18nAtPlugin } from 'i18n-auto-extractor/dist/esm/vue2.mjs'

Vue.config.productionTip = false

Vue.use(i18nAtPlugin,{
  langSet:{
    lang:'zh-CN',
    langMap:{}
  }
})

new Vue({
  render: h => h(App),
}).$mount('#app')
