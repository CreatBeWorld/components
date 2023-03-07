<template>
  <swiper
    :slidesPerView="1"
    :loop="true"
    :pagination="{
      clickable: true
    }"
    :autoplay="{
      delay: autoplayDelay,
      disableOnInteraction: false
    }"
    :navigation="navigation"
    :modules="modules"
    class="mySwiper"
  >
    <swiper-slide v-for="item in imgList" :key="item.id">
      <a href="#" class="link" @click="handleClick(item)">
        <img :src="item.imgUrl" alt="" />
      </a>
    </swiper-slide>
  </swiper>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Navigation, Autoplay } from 'swiper'
import { computed } from 'vue'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
const props = defineProps({
  imgList: {
    // 图片数据
    type: Array,
    required:true
  },
  navigation: {
    // prev、next按钮是否开启
    type: Boolean,
    default: false
  },
  navigationFontSize: {
    // prev、next按钮的大小
    type: String,
    default: '0.8rem'
  },
  autoplayDelay: {
    //autoPlay每隔多少毫秒切换一次
    type: Number,
    default: 2500
  },
  navigationColor: {
    // prev、next按钮的颜色
    type: String,
    default: '#e64a48'
  },
  paginationColor: {
    // 圆点的颜色
    type: String,
    default: '#fff'
  },
  paginationActiveColor: {
    // 圆点激活时的颜色
    type: String,
    default: '#E64A48'
  }
})
const emit = defineEmits(['imgClick'])
const handleClick = (item) => {
  emit('imgClick', item)
}
const modules = computed(() => {
  const m = [Pagination, Autoplay]
  if (props.navigation) {
    m.push(Navigation)
  }
  return m
})
</script>

<style lang="scss" scoped>
.mySwiper {
  width: 100%;
  height: 100%;
}
.swiper-slide .link {
  width: 100%;
  height: 100%;
  display: block;
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
<style>
.mySwiper span.swiper-pagination-bullet {
  background: v-bind('props.paginationColor');
  opacity: 1;
}
.mySwiper span.swiper-pagination-bullet.swiper-pagination-bullet-active {
  background: v-bind('props.paginationActiveColor');
  opacity: 1;
}
.mySwiper .swiper-button-next,
.mySwiper .swiper-button-prev {
  color: v-bind('props.navigationColor');
}
.mySwiper .swiper-button-next::after,
.mySwiper .swiper-button-prev::after {
  font-size: v-bind('props.navigationFontSize');
}
</style>
