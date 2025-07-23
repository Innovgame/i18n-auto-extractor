<script setup>
import {useVueAt} from 'i18n-auto-extractor/vue'
import {$at} from 'i18n-auto-extractor'
import enJSON from '../../locales/en'

const {setCurrentLang}=useVueAt()

setCurrentLang('zh',{})

setTimeout(() => {
  setCurrentLang('en',enJSON)
}, 3000);
</script>

<template>
  <div>
   {{$at('你好')}}
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
