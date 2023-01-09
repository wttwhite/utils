module.exports = {
  // title: 'utils', // 网站标题
  // base: '/base/', // 开发。。。。还没想好咋区分
  base: './', // 打包
  description: '网站的描述，它将会以 <meta> 标签渲染到当前页面的 HTML 中',
  plugins: [
    [
      '@vuepress/search',
      {
        searchMaxSuggestions: 10,
      },
    ],
  ],
  // plugins: ['vuepress-plugin-demo-container'],
  themeConfig: {
    lastUpdated: 'Last Updated', // string | boolean
    // nav: [{ text: '主页', link: '/changelog' }],
    sidebar: {
      '/': [
        {
          collapsable: false,
          children: ['changelog'],
        },
        {
          collapsable: false,
          children: ['function'],
        },
        {
          collapsable: false,
          children: ['file'],
        },
        {
          collapsable: false,
          children: ['dom'],
        },
        {
          collapsable: false,
          children: ['map'],
        },
        {
          collapsable: false,
          children: ['reg-exp'],
        },
        {
          collapsable: false,
          children: ['weather'],
        },
      ],
    },
    sidebarDepth: 1, // 默认的深度是 1，它将提取到 h2 的标题，设置成 0 将会禁用标题（headers）链接，同时，最大的深度为 2，它将同时提取 h2 和 h3 标题。
  },
}
