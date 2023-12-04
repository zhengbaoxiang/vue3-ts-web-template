<!--
 * @Date: 2023-07-18 10:06:28
 * @LastEditors: zbx
 * @LastEditTime: 2023-12-04 16:57:40
 * @descript: 文件描述
-->
<template>
  <div>
    <a-space>
      <img
        alt="logo"
        src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/dfdba5317c0c20ce20e64fac803d52bc.svg~tplv-49unhts6dw-image.image"
      />
      <a-typography-title :style="{ margin: 0, fontSize: '18px' }" :heading="5">
        vue-admin-arco
      </a-typography-title>
    </a-space>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    //
  },
});
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}
</style>
