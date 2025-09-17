<template>
  <h2 @click="$emit('click')">
    {{$at('你好')}}
  </h2>
  <img
    src="~assets/logo.png"
    alt="HEROPY" />
</template>

<script>
import {$at} from 'i18n-auto-extractor'
export default {
  props: {
    msg: { type: String }
  },
  emits: ['click'],
  setup(props, { emit }) {
    return {
      $at,
      $emit: emit
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~/scss/main";

  h2 {
    font-size: 22px;
    color: $color--primary;
    & + img {
      width: 120px;
    }
  }
</style>
