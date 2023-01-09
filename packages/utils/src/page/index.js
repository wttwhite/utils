export function getMsgGotoInfoByPageId(pageId) {
  const msg = localStorage.getItem('msgGotoInfo')
  if (msg && msg !== '[object object]') {
    try {
      const msgGotoInfo = JSON.parse(msg) || {}
      // 获取数据后清空数据
      localStorage.setItem('msgGotoInfo', '')
      const params =
        (msgGotoInfo[pageId + ''] && msgGotoInfo[pageId + ''].params) || {}
      return new Function('return ' + params)()
    } catch (error) {
      console.warn('msgGotoInfo格式转换错误')
    }
  } else {
    // 给{}是为了外边解构使用不会报错
    return {}
  }
}

export function render(
  props,
  store,
  routes,
  handleRoute,
  instance,
  App,
  Vue,
  VueRouter
) {
  let router = null
  let newRoute = []
  const { container, pubPath, setExampke, pageMsg } = props
  Vue.prototype.$publicPath = pubPath ? pubPath : ''
  if (props.pubPath) {
    newRoute = handleRoute(routes, props)
  } else {
    newRoute = routes
  }
  router = new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? `/${props.pubPath}` : '/',
    mode: 'hash',
    routes: newRoute,
  })
  if (window.__POWERED_BY_QIANKUN__) {
    router.beforeEach((to, from, next) => {
      if (!to.path.includes(pubPath)) {
        next({
          ...to,
          path: pubPath + to.path,
          fullPath: pubPath + to.fullPath,
        })
      } else {
        next()
      }
    })
  }
  instance = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount(container ? container.querySelector('#app') : '#app')
  setExampke &&
    setExampke({
      callback: function () {
        instance.$destroy()
        instance.$el.innerHTML = ''
        instance = null
        router = null
        newRoute = []
      },
    })
  return instance
}

export function mountFun(
  props,
  store,
  routes,
  handleRoute,
  instance,
  App,
  Vue,
  VueRouter
) {
  console.log('[vue] props from main framework', props)
  if (!window.__POWERED_BY_QIANKUN__) {
    instance = render(
      { container: null },
      store,
      routes,
      handleRoute,
      instance,
      App,
      Vue,
      VueRouter
    )
  }
  const { container } = props
  if (props.pageMsg) {
    window.hsja_activePageData = props.pageMsg
  }
  // 给每个页面挂载pageId
  if (props.pageId) {
    Vue.prototype.$pageId = props.pageId
  }

  if (instance === null) {
    // render(props)
    instance = render(
      props,
      store,
      routes,
      handleRoute,
      instance,
      App,
      Vue,
      VueRouter
    )
  } else {
    let dom = container
      ? container.querySelector('#app')
      : document.getElementById('app')
    dom.innerHTML = ''
    dom.appendChild(instance.$el)
  }
}
