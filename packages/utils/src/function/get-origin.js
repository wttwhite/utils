const getOrigin = () => {
  let _origin = ''
  if (!window.location.origin) {
    _origin =
      window.location.protocol +
      '//' +
      window.location.hostname +
      (window.location.port ? ':' + window.location.port : '')
  } else {
    _origin = window.location.origin
  }
  return _origin
}

export default getOrigin
