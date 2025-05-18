<template>
  <div class="infinite-list-container" ref="list" @scroll="scrollHandler">
    <div class="infinite-list-phantom" ref="listHeight"></div>
    <div class="infinite-list" ref="content">
      <div ref="items" class="infinite-list-item" v-for="item in visibleData" :key="item.id">
        {{ item.value }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUpdated, ref, watch } from 'vue'

const props = defineProps({
  // 列表数据
  listData: {
    type: Array,
    default: () => []
  },
  // 列表项高度
  itemSize: {
    type: Number,
    default: 150
  },
  // 预估的列表项高度
  estimatedItemSize: {
    type: Number,
    required: true
  },
  // 缓存区占可视区的比例
  bufferScale: {
    type: Number,
    default: 2
  }
})
const list = ref(null)
const items = ref([])
const listHeight = ref(null)
// 用于引用渲染区域
const content = ref(null)
// 可视区域高度
const screenHeight = ref(0)
// 开始索引
const startIndex = ref(0)
// 结束索引
const endIndex = ref(0)
// .infinite-list元素 向下偏移量
// const startOffset = ref(0)
// 列表项位置信息
let positions = []
const initPositions = () => {
  positions = props.listData.map((_, index) => ({
    index,
    height: props.estimatedItemSize,
    top: index * props.estimatedItemSize,
    bottom: (index + 1) * props.estimatedItemSize
  }))
}
// phantom元素高度
// const listHeight = computed(() => props.listData.length * props.itemSize)
// 可视区域显示的列表个数
const visibleCount = computed(() => Math.ceil(screenHeight.value / props.itemSize))
const aboveCount = computed(() =>
  Math.min(startIndex.value, Math.floor(props.bufferScale * visibleCount.value))
)
const belowCount = computed(() =>
  Math.min(
    props.listData.length - endIndex.value,
    Math.floor(props.bufferScale * visibleCount.value)
  )
)
// 可视区域显示的数据
const visibleData = computed(() => {
  // return props.listData.slice(startIndex.value, Math.min(endIndex.value, props.listData.length))
  let startIdx = startIndex.value - aboveCount.value
  let endIdx = endIndex.value + belowCount.value
  return props.listData.slice(startIdx, Math.min(props.listData.length, endIdx))
})
const getStartIndex = (scrollTop) => {
  return binarySearch(positions, scrollTop)
}
// 查找第一个大于value值的索引
const binarySearch = (list, value) => {
  let start = 0
  let end = list.length - 1
  let resIndex = null
  while (start <= end) {
    let minIndex = parseInt((start + end) / 2)
    let midValue = list[minIndex].bottom
    if (midValue === value) {
      return minIndex + 1
    } else if (midValue < value) {
      start = minIndex + 1
    } else {
      if (resIndex === null || resIndex > minIndex) {
        resIndex = minIndex
      }
      end = end - 1
    }
  }
  return resIndex
}
const scrollHandler = () => {
  const scrollTop = list.value.scrollTop
  startIndex.value = getStartIndex(scrollTop)
  endIndex.value = startIndex.value + visibleCount.value
  setStartOffset()
}
const updatePositions = () => {
  items.value.forEach((item, index) => {
    const height = item.getBoundingClientRect().height
    const oldHeight = positions[index].height
    const dValue = oldHeight - height
    if (dValue) {
      positions[index].height = height
      positions[index].bottom -= dValue
      for (let i = index + 1; i < positions.length; i++) {
        positions[i].top = positions[i - 1].bottom
        positions[i].bottom -= dValue
      }
    }
  })
}
const setStartOffset = () => {
  // let startOffset = startIndex.value >= 1 ? positions[startIndex.value - 1].bottom : 0
  let startOffset
  if (startIndex.value >= 1) {
    const dis =
      positions[startIndex.value].top -
      (positions[startIndex.value - aboveCount.value]
        ? positions[startIndex.value - aboveCount.value].top
        : 0)
    startOffset = positions[startIndex.value - 1].bottom - dis
  } else {
    startOffset = 0
  }
  content.value.style.transform = `translate3d(0,${startOffset}px,0)`
}
onMounted(() => {
  screenHeight.value = list.value.clientHeight
  startIndex.value = 0
  endIndex.value = startIndex.value + visibleCount.value
  // 初始化列表项位置信息数组
  initPositions()
})
onUpdated(async () => {
  await nextTick()
  if (!items.value || !items.value.length) {
    return
  }
  // 1、更新列表项数组位置信息
  updatePositions()
  // 更新虚拟列表高度
  listHeight.value.style.height = positions[positions.length - 1].bottom + 'px'
  // 更新偏移量
  setStartOffset()
})
watch(() => props.listData, initPositions)
</script>

<style scoped>
.infinite-list-container {
  height: 100%;
  overflow: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
}

.infinite-list-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.infinite-list {
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
  text-align: center;
}

.infinite-list-item {
  padding: 10px;
  color: #555;
  box-sizing: border-box;
  border-bottom: 1px solid #999;
}
</style>
