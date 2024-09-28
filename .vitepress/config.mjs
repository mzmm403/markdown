import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: 'markdown',
  title: "Mzmm知识库",
  description: "share knowledge",
  head: [["link", { rel: "icon", href: "/logo.svg" }]],
  themeConfig: {
    outlineTitle: "文章目录",
    outline: "deep",  // 或者是[2,6]
    logo: '/logo.svg',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '建站', link: '/tobuild/build' },
      {
        text: '前端',
        items: [
          { text: 'vue', link: '/web/vuejs/vue' },
          { text: 'vue-router', link: '/web/myrouter/router' },
          { text: 'css&js', link: '/web/css-js/css-js' },
          { text: 'ts', link: '/web/myts/ts' },
          { text: 'threejs', link: 'web/thressjs/threejs' }
        ]
      },
      {
        text: '运维',
        items: [
          { text: 'ansible', link: '/operation/myansible/ansible' },
          { text: 'jenkins', link: '/operation/jenkins/jenkins' },
          { text: 'k8s', link: '/operation/k8s/k8s' },
          { text: 'canokey', link: '/operation/canokey/canokey' }
        ]
      }
    ],

    // sidebar: [
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' }
    //     ]
    //   }
    // ],
    sidebar: false, // 关闭侧边栏
    aside: "left",  // 设置右侧侧边栏在左侧显示
    // 友链
    socialLinks: [
      { icon: 'github', link: 'https://github.com/mzmm403' }
    ],
    footer: {
      copyright: "Copyright © 2024-present Mzmm"
    },
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    }
  }
})
