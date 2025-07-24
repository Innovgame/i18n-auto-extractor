<script setup>
import {useVueAt} from '../../../../src/vue'
const {setCurrentLang,langSet}=useVueAt()
</script>

<template>
  <div>
    {{langSet.lang}}
   {{$at('今天天气怎么样')}}
  </div>
</template>

