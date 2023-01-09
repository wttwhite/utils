export default function readBlobToSrc(blob) {
  const read = new FileReader()
  read.readAsDataURL(blob)
  return new Promise((resolve) => {
    read.onload = (e) => {
      const img = new Image()
      img.setAttribute('crossOrigin', 'anonymous')
      img.src = e.target.result
      resolve(img.src)
    }
  })
}
