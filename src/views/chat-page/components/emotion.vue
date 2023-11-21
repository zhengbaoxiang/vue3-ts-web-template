<!--
 * @Date: 2023-08-05 13:24:03
 * @LastEditors: zbx
 * @LastEditTime: 2023-08-28 17:25:05
 * @descript: 文件描述
-->
<template>
  <div class="emotions" unselectable="on" onmousedown="return false;">
    <div class="srollZone">
      <img v-for="(item, index) in EmojiList" :key="index" :src="item.path" :title="item.code" :code="item.code"
        @click="emotionClick(item)" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { EmojiList } from '@/utils/Emoji';

const emit = defineEmits(['selecEmo']);

const emotionClick = (imginfo) => {
  emit('selecEmo', imginfo);
};

</script>

<style scoped lang="less">
.emotions {
  width: 400px;
  height: 320px;
  padding: 10px 10px;
  position: absolute;
  top: -325px;
  left: 20px;
  text-align: left;
  z-index: 10;
  border: 1px solid #bfd4de;
  background-color: white;
  border-radius: 3px;
  overflow: auto;
}

.emotions img {
  width: 30px;
  height: 30px;
  padding: 5px;
  box-sizing: content-box;
  cursor: pointer;

  &:hover {
    background-color: rgb(206, 203, 203);
  }
}

.emotions:before {
  content: '';
  position: absolute;
  left: 30px;
  top: 318px;
  margin-left: -7px;
  border: 7px solid transparent;
  border-top-color: #bfd4de;
}

.emotions:after {
  content: '';
  position: absolute;
  left: 30px;
  top: 318px;
  margin-left: -7px;
  margin-top: -2px;
  border: 7px solid transparent;
  border-top-color: #fff;
}
</style>
