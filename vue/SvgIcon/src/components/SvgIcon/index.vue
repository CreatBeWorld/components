<!-- 组件内基本样式 -->
<template>
  <div v-if="isExternal" :style="styleExternalIcon" 
   class="svg-external-icon svg-icon" v-on="$listeners" />
  <svg v-else :class="svgClass" aria-hidden="true" v-on="$listeners">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  name: 'SvgIcon',
  props: {
    iconClass: {// svg文件名（如：boat.svg文件 iconClass属性值为boat）
      type: String,
      required: true
    },
    className: { // svg类名
      type: String,
      default: ''
    },
    color: {
      type: String,
      default:'#999'
    }
  },
  computed: {
    isExternal() {
      return isExternal(this.iconClass)
    },
    iconName() {
      return `#icon-${this.iconClass}`
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    },
    styleExternalIcon() {
      return {
        mask: `url(${this.iconClass}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${this.iconClass}) no-repeat 50% 50%`
      }
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  /* 因icon大小被设置为和字体大小一致，而行内/行内块元素默认字体的基线对齐，
  故需设置一个往下的偏移比例，来纠正视觉上的未对齐效果*/
  vertical-align: -0.15em;
  /* fill:在svg中定义了绘制元素的颜色，其中currentColor变量表示当前元素的color值，
  如果当前元素没有在CSS里显示地指定一个color值，那它的颜色值就遵从CSS规则，从父元素继承而来 */
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover!important;
  display: inline-block;
}
</style>
