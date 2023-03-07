<template>
  <div class="loading-icon-container" :style="containerStyle">
    <svg t="1677493049201" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
      p-id="5554" :style="{ width: loadingStyle.iconSize, height: loadingStyle.iconSize, display: isIconShow ? 'inline' : 'none' }"
      :class="{ rotate: isRotate }">
      <path
        d="M512.930909 92.858182a420.072727 420.072727 0 1 0 0 840.145454 420.072727 420.072727 0 0 0 0-840.145454z m0 114.036363a306.036364 306.036364 0 1 1 0 612.072728 306.036364 306.036364 0 0 1 0-612.072728z"
        :fill="loadingStyle.iconColor" fill-opacity=".25" p-id="5555"></path>
      <path
        d="M512.930909 92.858182v114.036363a306.036364 306.036364 0 1 0 234.449455 502.737455l7.726545-9.541818 90.158546 69.818182a420.072727 420.072727 0 1 1-344.715637-676.864l12.381091-0.186182z"
        :fill="loadingStyle.iconColor" fill-opacity=".85" p-id="5556"></path>
    </svg>
    <div v-if="isTextShow" :style="textStyle">{{ text }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  loadingStyle: { // LoadingIcon 组件的样式
    type: Object,
    default: () => ({})
  },
  // 当前loading模式是下拉刷新还是上拉加载
  mode: {
    type: String,
    default: 'pullUp'
  },
  // 图标是否旋转
  isRotate: {
    type: Boolean,
    default: false
  },
  // 图标是否显示
  isIconShow: {
    type: Boolean,
    default: true
  },
  // 文字是否显示
  isTextShow: {
    type: Boolean,
    default: false
  },
  // 新增的数据条数
  newAddedDataLen: {
    type: Number,
    default: -1
  }
})
// 根据newAddedDataLen来设置上拉/下拉显示的文字
const text = computed(() => {
  const len = props.newAddedDataLen
  if(props.mode==='pullDown'){
    return  len=== -1 ? '':(len===0?'暂无更新' : `更新了${len}条数据`)
  }else{
    return len === -2?'上拉加载更多':(len===-1?'正在加载更多':(len === 0?'没有更多数据了！':`加载了${len}条数据`))
  }
})
// 设置loading-icon-container的样式
const containerStyle = computed(() => {
  const commonStyle = {
    backgroundColor: props.isTextShow ? props.loadingStyle.textBgColor : 'transparent',
    fontSize: props.loadingStyle.textFontSize,
    color: props.loadingStyle.textFontColor
  }
  return props.mode === 'pullDown' ? commonStyle : {
    height: props.loadingStyle.containerHeight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...commonStyle
  }
})
// 设置上拉/下拉文字的样式
const textStyle = computed(() => {
  return props.mode === 'pullDown' ? { height: props.loadingStyle.containerHeight, lineHeight: props.loadingStyle.containerHeight } : {
    marginLeft:props.newAddedDataLen===-1?`calc(${props.loadingStyle.textFontSize} / 2)`:'0',
  }
})
</script>

<style lang="scss" scoped>
.loading-icon-container {
  text-align: center;
}

.icon.rotate {
  animation: rotate 1s linear infinite;
}
// 图标旋转动画
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg)
  }
}
</style>
