const throttle = (func, wait = 16, opts = { noStart: false, noEnd: false }) => {
  let context, args, result
  let timeout = null
  let previous = 0
  const later = function () {
    previous = opts.noStart ? 0 : +new Date()
    timeout = null
    result = func.apply(context, args)
    if (!timeout) {
      context = args = null
    }
  }
  return function () {
    const now = +new Date()
    if (!previous && opts.noStart) {
      previous = now
    }
    const remaining = wait - (now - previous)
    context = this
    args = arguments
    if (remaining <= 0 || remaining > wait) {
      clearTimeout(timeout)
      timeout = null
      previous = now
      result = func.apply(context, args)
      if (!timeout) {
        context = args = null
      }
    } else if (!timeout && !opts.noEnd) {
      timeout = setTimeout(later, remaining)
    }
    return result
  }
}

export default throttle
