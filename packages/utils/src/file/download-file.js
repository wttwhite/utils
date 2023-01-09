export default function downloadFile(res, fileName) {
  // 判断res的类型
  let liu = ''
  if (res instanceof Blob) {
    liu = res
  } else if (res.data instanceof Blob) {
    liu = res.data
  } else {
    console.error('res 和 res 都不是二进制码流')
    return
  }
  const blob = new Blob([liu], { type: liu.type })
  let dom = document.createElement('a')
  //创建下载链接
  let url = window.URL.createObjectURL(blob) 
  if (!fileName) {
    // 判断能否使用header的文件名
    if (!res.headers || !res.headers['content-disposition']) {
      console.error('res.headers没有值，请自己传入文件名')
      return
    }
    fileName = res.headers['content-disposition']
    ? res.headers['content-disposition'].split('attachment;filename=')[1]
    : new Date().getTime()
  }
  dom.href = url
  // 解码
  dom.download = decodeURI(fileName)
  dom.style.display = 'none'
  document.body.appendChild(dom)
  dom.click()
  dom.parentNode.removeChild(dom)
  // 释放掉blob对象
  window.URL.revokeObjectURL(url)
}
