/**
 * @description: 图片压缩
 */
export default function compressImg(
  file,
  scale = 0.5,
  encoderOptions = [
    { key: '(-,1]', value: 1 },
    { key: '[1,2]', value: 0.92 },
    { key: '(2,+)', value: 0.5 },
  ]
) {
  let disposeFile = file
  if (Object.prototype.toString.call(file) === '[object Blob]') {
    disposeFile = new File([file], file.name, { type: file.type })
  }
  const fileSize = parseFloat(
    parseInt(disposeFile['size']) / 1024 / 1024
  ).toFixed(2)
  const read = new FileReader()
  read.readAsDataURL(disposeFile)
  return new Promise((resolve, reject) => {
    try {
      read.onload = (e) => {
        const img = new Image()
        img.src = e.target.result
        img.onload = function () {
          // 获取压缩后的宽高
          const { width, height } = imgWidthHeight(
            this.width,
            this.height,
            scale,
            fileSize
          )
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          canvas.setAttribute('width', width)
          canvas.setAttribute('height', height)
          ctx.drawImage(this, 0, 0, width, height)
          // 获取压缩质量之后的base64输出
          const base64 = encoderImg(
            disposeFile,
            canvas,
            encoderOptions,
            fileSize
          )
          resolve(dataURLtoFile(base64, disposeFile.name))
        }
      }
    } catch (error) {
      reject(disposeFile)
    }
  })
}
// 修改图片的宽高
function imgWidthHeight(w, h, scale, fileSize) {
  let width, height
  try {
    if (typeof scale === 'number') {
      width = Math.floor(w * scale)
      height = Math.floor(h * scale)
    } else {
      scale.forEach((item) => {
        formatOption(item.key, fileSize, () => {
          width = Math.floor(w * item.value)
          height = Math.floor(h * item.value)
        })
      })
    }
  } catch (error) {
    console.error('修改图片质量报错：', error)
  }
  return {
    width,
    height,
  }
}
// 修改图片的质量, 输出base64
function encoderImg(disposeFile, canvas, encoderOptions, fileSize) {
  let base64
  // type：图片格式，默认为 image/png,可以是其他image/jpeg等
  // encoderOptions：0到1之间的取值，主要用来选定图片的质量，默认值是0.92，超出范围也会选择默认值。
  // 注：格式为image/jpeg或webp的才会有质量压缩效果
  try {
    if (typeof encoderOptions === 'number') {
      base64 = canvas.toDataURL(disposeFile['type'], encoderOptions)
    } else {
      encoderOptions.forEach((item) => {
        formatOption(item.key, fileSize, () => {
          base64 = canvas.toDataURL(disposeFile['type'], item.value)
        })
      })
    }
  } catch (error) {
    console.error('修改图片质量报错：', error)
  }
  console.log('base64', base64)
  return base64
}
function formatOption(option, fileSize, cb) {
  const leftOperation = option.substring(0, 1)
  const rightOperation = option.substr(-1)
  const center = option.substr(1, option.length - 2)
  const arr = center.replace('，', ',').split(',')
  if (arr && arr.length === 2) {
    const left = leftOperation === '(' ? fileSize > arr[0] : fileSize >= arr[0]
    const right =
      rightOperation === ')' ? fileSize < arr[0] : fileSize <= arr[1]
    if (arr[0] === '-') {
      if (right) {
        cb()
      }
    } else if (arr[1] === '+') {
      if (left) {
        cb()
      }
    } else {
      if (left && right) {
        cb()
      }
    }
  } else {
    console.error('传参格式错误')
  }
}
/**
 * @description: 将base64编码转回file文件
 */
function dataURLtoFile(dataurl, fileName) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    // atob() 方法用于解码使用 base-64 编码的字符串。
    // base-64 编码使用方法是 btoa()
    bstr = window.atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], fileName, {
    type: mime,
  })
}
