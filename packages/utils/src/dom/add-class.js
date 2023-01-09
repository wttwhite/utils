import hasClass from './has-class.js'

const addClass = (el, cls) => {
  let curClass = el.className
  const classes = (cls || '').split(' ')
  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) {
      continue
    }
    if (el.classList) {
      el.classList.add(clsName)
    } else if (!hasClass(el, clsName)) {
      curClass += ` ${clsName}`
    }
  }
  if (!el.classList) {
    el.className = curClass
  }
}

export default addClass
