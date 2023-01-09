//引入js文件代码
// 文件下载ppt,xls,word
export default function dowloadByUrl(str, fileName) {
  //   let that = this
  getBlob(str, function (blob) {
    saveAs(blob, fileName)
  })
  function getBlob(url, cb) {
    console.log('调用getBlob')
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = function () {
      if (xhr.status === 200) {
        cb(xhr.response)
      }
    }
    xhr.send()
  }
  function saveAs(blob, filename) {
    console.log('调用saveAs')
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, filename)
    } else {
      var link = document.createElement('a')
      var body = document.querySelector('body')
      link.href = window.URL.createObjectURL(blob)
      link.download = filename
      link.style.display = 'none'
      body.appendChild(link)
      link.click()
      body.removeChild(link)
      window.URL.revokeObjectURL(link.href)
    }
  }
}
