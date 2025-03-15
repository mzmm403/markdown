## SSR 基本介绍

SSR (Server side Render) 服务器端渲染
> 渲染：页面形成的过程，html文件，内容形成的过程

CSR (client side Render) 客户端渲染
> 渲染： 页面内容通过js执行形成

### 前端发展史

1. 静态页面阶段

> document(文档,用来学术交流的)

2. 服务器端渲染阶段

> js刚出的时候，要么做不了要么做不好
> PHP smarty
> java JSP,Volicity,freemaker
> python jinja2
> golang gin(controller.PageManage(),controller.ResourcesManage())

> 优点：
    1. 前端压力小，直接渲染
    2. 有利于SEO，公共流量(google) vs 私域流量(tiktok)

> 缺点
    1. 学习成本高
    2. 开发成本高(依托于语言的环境调试测试)
    3. 服务器压力大

利用模板修改页面

3. 客户端渲染(前后端分离)

> 浏览器越来越快，js能做的事情越来越多
> css3, html5, cssnext, es678, 设计模式, vue

> 优点
    1. 前后端分离，前端(UI + 交互)， 后端(API和数据)
    2. 体验好(和原生native比). SPA(单页面)

> 缺点
    1. 首屏加载慢(落地页,例如看广告)
    2. SEO 不好


4. 同构(Vue SSR, SSR + CSR)
> nodejs出现，会js就可以开发服务端

缺点：服务端跑一次，客户端也要渲染


## SSR基本API

首先下面是最简单的vue ssr的代码示例

```js
const express = require("express")
const Vue = require("vue")
const serverRender = require("vue-server-renderer")
const fs = require("fs")

// 定义一个对象,里面是相关页面的信息
const desc = {
    title: "ssr页面",
    meta: '<meta name="keywords" content="ssr,vue"></meta>'
}
// 创建服务器实例
const server = express()

server.get("*",(req,res) => {
    // 创建vue实例
    const app = new Vue({
        data() {
            return {
                msg: "hello ssr"
            }
        },
        template: `<div>{{ msg }}</div>`
    })

    // 创建一个渲染器
    const render = serverRender.createRenderer({
        template: fs.readFileSync("./index.html","utf-8")
    })
    // 把vue实例转成html字符串
    // renderToString(vue实例,上下文对象,回调函数)
    render.renderToString(app,desc,(err, html) => {
        res.send(html)
    })
})

server.listen(8080,()=>{
    console.log("server is running at port 8080")
})
```

下面是对应的`index.html`代码

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- 插值语法 -->
    <!-- 双括号转义 -->
    <title>{{title}}</title>
    <!-- 三括号不转义 -->
    {{{ meta }}}
</head>
<body>
    <!--vue-ssr-outlet-->
</body>
</html>
```


- 我们需要`vue-server-renderer`去把vue实例转换成对应的字符串
- createRenderer：创建一个渲染器
- renderToString：渲染器的方法，有三个参数分别是vue实例，上下文对象，回调函数
- 需要用注释的方式指定渲染结果渲染的位置`<!--vue-ssr-outlet-->`这个注释和普通的注释不一样前面和后面都不能为空
- 关于插值语法，在这里双括号其内容是进行转义的，三括号其内容是不转义的

## ssr的环境搭建

这里有两种方式进行搭建

```shell
npx create-nuxt-app 项目名
npm create vite@latst
```

这里搭建好的项目其中内置了vite

## 目录结构

- 资源目录 `assets` 用于组织未编译的静态资源如 `LESS`、`SASS` 或 `JavaScript`。
- 组件目录 `components` 用于组织应用的 `Vue.js` 组件。`Nuxt.js` 不会扩展增强该目录下 `Vue.js` 组件，即这些组件不会像页面组件那样有 `asyncData` 方法的特性。
- 布局目录 `layouts` 用于组织应用的布局组件。
- 中间件目录 `middleware` 目录用于存放应用的中间件。
- 页面目录 `pages` 用于组织应用的路由及视图。`Nuxt.js` 框架读取该目录下所有的 `.vue` 文件并自动生成对应的路由配置。
- 插件目录 `plugins` 用于组织那些需要在 根`vue.js`应用 实例化之前需要运行的 `Javascript` 插件。
- 静态文件目录 `static` 用于存放应用的静态文件，此类文件不会被 `Nuxt.js` 调用 `Webpack` 进行构建编译处理。服务器启动的时候，该目录下的文件会映射至应用的根路径 `/`下。
- `store` 目录用于组织应用的 `Vuex` 状态树 文件。 `Nuxt.js` 框架集成了 `Vuex` 状态树 的相关功能配置，在 `store` 目录下创建一个 `index.js` 文件可激活这些配置。
- `nuxt.config.js` 文件用于组织 Nuxt.js 应用的个性化配置，以便覆盖默认配置。若无额外配置，该文件不能被重命名。
- `package.json` 文件用于描述应用的依赖关系和对外暴露的脚本接口。




