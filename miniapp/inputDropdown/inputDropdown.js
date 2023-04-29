// components/inputDropdown.js
Component({
  properties: {
    // 下拉菜单选项：['','']
    // text:菜单的文字，value:选中菜单之后的值
    dropDownOptions: {
      type: Array,
      value: []
    },
    // 菜单标题和选项的选中态颜色
    activeColor: {
      type: String,
      value: '#409eff'
    }
  },
  data: {
    selectedIndex: 0, // 当前选中的下拉菜单项的索引
    dropDownShow: false, // 下拉菜单项是否显示
    inputValue: '' // 输入框的内容
  },
  methods: {
    // 菜单标题被点击
    dropDownTitleTap() {
      this.setData({
        dropDownShow: !this.data.dropDownShow
      })
    },
    // 菜单选型被点击
    dropDownItemTap(e) {
      const { index } = e.currentTarget.dataset
      if (this.data.selectedIndex !== index) {
        this.setData({
          inputValue: ''
        })
      }
      this.setData({
        selectedIndex: index,
        dropDownShow: false
      })
    },
    inputHandle(e) {
      this.setData({
        inputValue: e.detail.value
      })
    },
    // 点击search按键
    inputConfirm() {
      // index：选中的菜单选项的索引，value:输入框输入的值
      this.triggerEvent('inputConfirm', {
        index: this.data.selectedIndex,
        value: this.data.inputValue
      })
    }
  }
})
