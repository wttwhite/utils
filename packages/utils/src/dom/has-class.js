const hasClass = (el, cls) => {
  if (!el || !cls || cls.indexOf(' ') !== -1) {
    return false
  }
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return ` ${el.className} `.indexOf(` ${cls} `) > -1
  }
}

export default hasClass
