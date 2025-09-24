<template>
  <div>
    <div>{{langSet.lang}}</div>
   <div>{{$at('你好')}}</div>
   <div>{{$at('确定')}}</div>
   <div>{{ $at('确定', { override: { en: 'ok' } }) }}</div>
   <div>{{ $at('确定', { override: { en:'confirm' } }) }}</div>
   <HelloWorld />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import enJSON from '../../locales/en'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  mounted() {
    setTimeout(() => {
     this.setCurrentLang('en',enJSON)
    }, 3000);
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
