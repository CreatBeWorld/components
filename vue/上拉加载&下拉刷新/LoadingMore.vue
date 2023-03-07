<template>
  <Swiper
    :freeMode="swiperOption.freeMode"
    :slidesPerView="swiperOption.slidesPerView"
    :modules="swiperOption.modules"
    direction="vertical"
    style="height: 100%"
    @touchMove="handleTouchMove"
    @touchEnd="handleTouchEnd"
  >
    <SwiperSlide style="height: auto">
      <LoadingIcon
        v-if="isPullDownShow"
        mode="pullDown"
        :isRotate="pullDownIsRotate"
        :isTextShow="pullDownTextShow"
        :newAddedDataLen="pullDownAddedDataLen"
        :isIconShow="isPullDownIconShow"
        :loading-style="pullDownLoadingStyle"
      />
      <slot></slot>
      <LoadingIcon
        v-if="mode !== 'pullDown'"
        :isTextShow="true"
        :isRotate="pullUpIsRotate"
        :newAddedDataLen="pullUpAddedDataLen"
        :isIconShow="isPullUpIconShow"
        :loading-style="pullUploadingStyle"
      ></LoadingIcon>
    </SwiperSlide>
  </Swiper>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode } from 'swiper'
import 'swiper/css'
import LoadingIcon from './LoadingIcon.vue'
import { ref, nextTick } from 'vue'
const props = defineProps({
  mode: {
    type: String,
    default: 'both' // mode取值为pullUp(上拉加载)，pullDown(下拉刷新),both(上拉加载，下拉刷新)
  },
  pullDownLoadingDataFunc: {// 下拉时获取数据的函数
    type: Function,
    default: null
  },
  pullUpLoadingDataFunc: {// 上拉时获取数据的函数
    type: Function,
    default: null
  },
  pullUploadingStyle:{// 上拉时LoaidngIcon组件的样式
    type:Object,
    default: () => ({
      containerHeight: '1.2rem',// 上拉时整个LoadingIcon组件的高度
      iconSize: '0.6rem',// 图标的大小
      iconColor:'#e64a48',// 图标的字体颜色
      textBgColor:'transparent',// 上拉时文字的背景颜色
      textFontColor:'#777',// 上拉时文字的字体颜色
      textFontSize:'0.4rem'// 上拉时文字的字体大小
    })
  },
  pullDownLoadingStyle: { // 下拉时LoadingIcon组件的样式
    type:Object,
    default: () => ({
      containerHeight: '1.2rem',// 下拉时文字的高度
      iconSize: '0.6rem',// 下拉时图标的大小
      iconColor:'#e64a48',// 下拉时图标的字体颜色
      textBgColor:'#e64a48',// 下拉时文字的背景颜色
      textFontColor:'#fff',// 下拉时文字的字体颜色
      textFontSize:'0.4rem'// 下拉时文字的字体大小
    })
  }
})
// swiper配置对象
const swiperOption = {
  slidesPerView: 'auto',
  freeMode: {
    // 自由模式
    enabled: true, // 开启自由模式
    momentumRatio: 2,
    momentumVelocityRatio: 3
  },
  modules: [FreeMode]
}
const isPullDownShow = ref(false) // 下拉loadingIcon组件是否显示
const pullDownIsRotate = ref(false) // 下拉图标是否旋转
const pullDownTextShow = ref(false) // 下拉文字是否显示
const pullDownAddedDataLen = ref(-1)// 控制下拉显示的文字
const isPullDownIconShow = ref(true)// 下拉图标是否显示
const isPullUpIconShow = ref(false)// 上拉图标是否显示
const pullUpAddedDataLen = ref(-2)// 控制上拉显示的文字
const pullUpIsRotate = ref(false) // 上拉时图标是否旋转
// 处理触点在swiper上滑动
const handleTouchMove = swiperInstance => {
  if (props.mode !== 'pullUp' && swiperInstance.translate > 30) {
    isPullDownShow.value = true // 显示下拉loadingIcon组件
  }
}
// 处理触点离开swiper
const handleTouchEnd = async swiperInstance=> {
  const yMoved = swiperInstance.translate
  if (yMoved >= 50) {
    pullDownIsRotate.value = true // 下拉图标旋转
    await nextTick() // 等待真实dom更新完毕
    swiperInstance.disable() // swiper禁止滑动
    // 加载数据
    pullDownAddedDataLen.value = await props.pullDownLoadingDataFunc()
    pullDownTextShow.value = true // 显示下拉文字
    pullDownIsRotate.value = false // 下拉图标停止旋转
    isPullDownIconShow.value = false // 下拉图标不显示
    await nextTick()
    swiperInstance.enable() // swiper可以滑动
    setTimeout(() => {
      pullDownAddedDataLen.value = -1 // 重置pullDownAddedDataLen
      pullDownTextShow.value = false // 下拉文字不显示
      isPullDownShow.value = false // 下拉loadingIcon组件不显示
      isPullDownIconShow.value = true // 重置下拉图标的显示状态
      nextTick(() =>swiperInstance.update()) // 数据状态改变之后（dom并不会立即更新，如果此时立即更新swiper-slide的高度的话，那么计算出来的高度会偏大，可以把重新计算高度的代码加入到nextTick的回调函数中执行）
    }, 2000)
  } else if (yMoved >= 0) {
    isPullDownIconShow.value = false // 下拉图标不显示
    setTimeout(() => {
      isPullDownIconShow.value = true // 重置下拉图标的状态
      isPullDownShow.value = false // 下拉loadingIcon组件不显示
    }, 1000)
  } else {
    if (props.mode !== 'pullDown') {
      const slideHeight = swiperInstance.slidesSizesGrid[0] // 获取slide的高度
      const swiperWrapperHeight = swiperInstance.slidesEl.offsetHeight // 获取swiper wrapper的高度
      if (slideHeight - swiperWrapperHeight + yMoved < 100) {// 判断swiper是否滑动到了底部
        isPullUpIconShow.value = true // 显示上拉图标
        pullUpIsRotate.value = true // 上拉图标转动
        pullUpAddedDataLen.value = -1 // 设置上拉文字
        await nextTick()
        swiperInstance.disable() // swiper禁止滑动
        pullUpAddedDataLen.value = await props.pullUpLoadingDataFunc() // 加载数据
        swiperInstance.update() // 重新计算swiper的高度
        pullUpIsRotate.value = false // 上拉图标停止旋转
        isPullUpIconShow.value = false // 上拉图标不显示
        await nextTick()
        swiperInstance.enable() // swiper可以滑动
        setTimeout(() => {
          if (pullUpAddedDataLen.value > 0) { //当上拉加载的数据条数大于0时，重置pullUpAddedDataLen的值，控制上拉文字的显示
            pullUpAddedDataLen.value = -2
          }
        }, 2000)
      }
    }
  }
}
</script>
