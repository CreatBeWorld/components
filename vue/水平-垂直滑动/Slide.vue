<template>
  <Swiper
    :freeMode="swiperOption.freeMode"
    :slidesPerView="swiperOption.slidesPerView"
    :modules="swiperOption.modules"
    :direction="direction"
    :style="{height:direction==='horizontal'?'auto':'100%'}"
  >
  <!-- 水平移动 -->
  <template v-if="direction==='horizontal'">
    <SwiperSlide v-for="item in dataList" :key="item.id" :style="{width:width}">
      <slot :data="item"></slot>
    </SwiperSlide>
  </template> 
  <!-- 垂直移动 -->
  <SwiperSlide v-else :style="{height:'auto'}">
    <slot></slot>
  </SwiperSlide>
  </Swiper>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode } from 'swiper'
import 'swiper/css'

const props = defineProps({
  dataList: { // 水平滑动时，传递的数据
    type: Array,
    default: () => []
  },
  direction: { // 滑动的方向
    type: String,
    default:'horizontal'
  },
  width: String, // 水平滑动时，swiper-slide的宽度(width+margin-right)
})
const swiperOption = {
  slidesPerView: 'auto',
  freeMode: {// 自由模式
    enabled: true, // 开启自由模式
    momentumRatio: 2,
    momentumVelocityRatio: 3
  },
  modules: [FreeMode]
}
</script>
