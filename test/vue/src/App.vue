<script setup>
// import {useVueAt} from 'i18n-auto-extractor/vue'
import {useVueAt} from '../../../src/vue'
import enJSON from '../../locales/en'
import HelloWorld from './components/HelloWorld.vue'

const {setCurrentLang,langSet}=useVueAt()

setTimeout(() => {
  setCurrentLang('en',enJSON)
}, 3000);
</script>

<template>
  <div>
    {{langSet.lang}}
   {{$at('你好')}}
  </div>
  <HelloWorld />
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
