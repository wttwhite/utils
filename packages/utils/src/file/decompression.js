import jszip from 'jszip'
import readBlobToSrc from './read-blob-to-src'
export default async function decompression(file, type) {
  const zip = new jszip()
  return zip.loadAsync(file.data).then(async (res) => {
    // 去掉数组的第一个值
    const keys = Object.keys(res.files)
    let list = []
    console.log('keys', keys)
    keys.forEach((path) => {
      if (path.substr(-1) !== '/') {
        list.push({
          path: path,
          value: res.files[path],
        })
      } else {
        delete res.files[path]
      }
    })
    // const base64 = await res.file('test-zip/daping.png').async('string')

    // const base64 = await res.file('test-zip/daping.png').asText()
    // const buffer = await res.file('test-zip/daping.png').asArrayBuffer()
    // return res.file()
    // let base64 = this.arrayBufferToBase64(buffer)
    // base64 = 'data:image/png;base64,' + base64
    // console.log(base64)
    if (!type) {
      return {
        files: res.files,
      }
    } else {
      const data = await trySwitch(type, res, list)
      return {
        files: res.files,
        ...data,
      }
    }
  })
}
async function trySwitch(type, res, list) {
  const dataArr = await Promise.all(
    list.map((item) => {
      return res.file(item.path).async(type === 'img-bas64' ? 'blob' : type)
    })
  )
  const obj = {}
  list.forEach((item, index) => {
    obj[item.path] = dataArr[index]
    item.data = dataArr[index]
  })
  if (type === 'img-bas64') {
    const imgSrcArr = await Promise.all(
      list.map((item) => {
        return readBlobToSrc(item.data)
      })
    )
    list.forEach((item, index) => {
      obj[item.path] = imgSrcArr[index]
    })
  }
  return Promise.resolve({
    files: res.files,
    transformObj: obj,
  })
}
