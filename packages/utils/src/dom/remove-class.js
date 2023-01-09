import hasClass from './has-class.js'

const removeClass = (el, cls) => {
  const classes = cls.split(' ')
  let curClass = ` ${el.className} `
  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) {
      continue
    }
    if (el.classList) {
      el.classList.remove(clsName)
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(` ${clsName} `, ' ')
    }
  }
  if (!el.classList) {
    el.className = curClass
  }
}

export default removeClass
