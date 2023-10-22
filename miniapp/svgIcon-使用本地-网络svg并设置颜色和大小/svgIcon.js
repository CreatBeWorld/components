// svg组件
import { Base64 } from './base64.js';
const base64 = new Base64()
Component({
  properties: {
    url: String,// svg网络地址
    width: { // svg宽度
      type: String,
      value: '1em'
    },
    height: { // svg高度
      type: String,
      value: '1em'
    },
    color: { // svg颜色
      type: String,
      value: '#000000'
    }
  },
  observers: {
    'url,color': function (src, color) {
      this.getSvgFile(src, color)
    }
  },
  externalClasses: ['custom-class'],//外部样式类
  data: {
    svgShow: false,
    svgData: ''
  },
  methods: {
    // 校验图片是否是网络图片
    isExternal(path) {
      return /^(https?:)/.test(path)
    },
    getSvgFile(src, color) {
      // 根据文件内容生成svg的base64格式
      const _getSvgFile = sourceFile => {
        const newFile = this.changeColor(sourceFile, color);
        const svgBase64File = base64.encode(newFile);
        this.setData({
          svgData: 'data:image/svg+xml;base64,' + svgBase64File,
          svgShow: true
        })
      }
      if (this.isExternal(src)) {
        const failCb = err => {
          console.log(`${src}图片请求失败，失败原因如下：`, err)
          this.setData({
            svgShow: false
          })
        }
        // 网络图片
        wx.request({
          url: src,
          success: res => {
            if (res.data) {
              _getSvgFile(res.data)
            } else {
              failCb(res)
            }
          },
          fail: failCb
        })
      } else {
        const fs = wx.getFileSystemManager()
        fs.readFile({
          filePath: src,
          encoding: 'binary',
          position: 0,
          success(res) {
            _getSvgFile(res.data)
          },
          fail(res) {
            console.error(res)
            this.setData({
              svgShow: false
            })
          }
        })
      }
    },
    // 修改svg的颜色
    changeColor(sourceFile, color) {
      let newSvg;
      if (/fill=".*?"/.test(sourceFile)) {
        newSvg = sourceFile.replace(/fill=".*?"/g, `fill="${color}"`);  // SVG有默认色
      } else {
        newSvg = sourceFile.replace(/<svg /g, `<svg fill="${color}" `); // 无默认色
      }
      return newSvg
    }

  }
})
