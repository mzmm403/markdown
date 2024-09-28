# 16：VueJs路由v-router

- 官网：https://router.vuejs.org/zh/
- 介绍：https://router.vuejs.org/zh/introduction.html

## 01、概述

Vue Router 是 [Vue.js](https://vuejs.org/) 的官方路由。它与 Vue.js 核心深度集成，让用 Vue.js 构建单页应用变得轻而易举。功能包括：

- 嵌套路由映射
- 动态路由选择
- 模块化、基于组件的路由配置
- 路由参数、查询、通配符
- 展示由 Vue.js 的过渡系统提供的过渡效果
- 细致的导航控制
- 自动激活 CSS 类的链接
- HTML5 history 模式或 hash 模式
- 可定制的滚动行为
- URL 的正确编码

## 02、 路由安装

npm

```sh
npm install vue-router@4
```

yarn

```sh
yarn add vue-router@4
```



**==提示：如果你是采用vite的create-vue方式安装的话，可以自动把vue-router@4安装上。无须在执行上面的步骤。==**

## 03、路由快速入门

步骤如下：

**1：安装vue-router@4 (一次性)**

```sh
npm install vue-router@4
```

**2：定义一个router目录并且新建index.js，初始化router路由对象，开始用于注册后续定义的路由和视图(一次性)**

```js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: []
})

export default router
```

**3：在main.js把定义好的router/index.js注册到vue中，让vue进行管理(一次性)**

```js
import { createApp } from 'vue'
import router from './router' //相当于import router from './router/index.js'
// 1: 创建vue
const app = createApp(App)
// 2: 插件的方式注册router
app.use(router)
// 3: 初始化vue的挂载点
app.mount('#app')

```

**4：在views开始定义页面视图(.vue)结尾的单页spa**

```vue
<template>
    <h1>我是首页</h1>
</template>
```

**5：开始把定义个页面注册到router/index.js中**

```js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    }
  ]
})

export default router

```

**6：指定路由视图`<router-view/>`,也就是告诉我们访问的路由的内容放在哪里。**

在App.vue定义路由视图存放点。

```vue
<script setup>
    import { RouterLink, RouterView } from 'vue-router'
</script>
<template>
  <RouterView />
</template>
```

**7: 启动项目即可：**

```sh
npm run dev
```

**8：访问** 

`http://localhost:5173/` 即可得到首页显示说明就配置成功了。

**9：配置项**

```js
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

```



## 04、路由的跳转和分发

在后续的操作中，我们只需要一直做：4 5 8 步骤即可，然后通过如下几种方式都可以完成页面的跳转和分发：

-  `<router-link>`
- `<a href="">`
- 事件的方式，因为官方也提供了事件的方式来进行处理。

1： 在app.vue定义

```html
<router-link to="/">主页</router-link>
<router-link to="/news">文章</router-link>
<router-link to="/category">分类</router-link>
<router-link to="/about">关于我</router-link>
```

2： 然后在views定义News.vue和Category.vue和About.vue

3：然后把他们在router/index.js进行注册即可。

4：启动，然后访问点击查看效果即可。



## 05、带参数的动态路由匹配

官网文档：https://router.vuejs.org/zh/guide/essentials/route-matching-syntax.html#sensitive-%E4%B8%8E-strict-%E8%B7%AF%E7%94%B1%E9%85%8D%E7%BD%AE

**1:  定义一个新闻明细：NewsDetail.vue**

```vue
<script setup>
import { useRouter, useRoute } from 'vue-router'
const route = useRoute();
const router = useRouter();
</script>

<template>
  <h1>我是文章明细</h1>
  参数是:{{route.params.id}}
</template>

```

**2: 配置路由**

```js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue')
    },
    {
      path: '/news/detial/:id?',
      name: 'newdetail',
      component: () => import('@/views/NewsDetail.vue')
    }
  ]
})

export default router

```

**3: 访问：`http://localhost:5173/news/detial/100`**

![image-20221212221348226](assets/image-20221212221348226.png)

## 06、嵌套路由

官网文档：https://router.vuejs.org/zh/guide/essentials/nested-routes.html#%E5%B5%8C%E5%A5%97%E7%9A%84%E5%91%BD%E5%90%8D%E8%B7%AF%E7%94%B1

一些应用程序的 UI 由多层嵌套的组件组成。在这种情况下，URL 的片段通常对应于特定的嵌套组件结构，例如：

建设我要去开发一个后台：

- main.js
- App.vue
  - Login.vue
  - Admin.vue
    - News.vue
    - Course.vue
    - User.vue

这个时候就会牵涉到父子路由的问题。如下：

```js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:"/login",
      name:"login",
      component: () => import("@/views/Login.vue")
    },
    {
      path: '/admin',
      component: HomeView,
      children:[
        {
          path: '',
          name: 'index',
          component: () => import('@/views/AdminIndex.vue')
        },
        {
          path: '/news/detail/:id?',
          name: 'newdetail',
          component: () => import('@/views/NewsDetail.vue')
        }
      ]
    }
  ]
})

export default router

```





## 07、编程式路由

**注意：在 Vue 实例中，你可以通过 `$router` 访问路由实例。因此你可以调用 `this.$router.push`。** 但是在组合式API或者选项式API里。你必须通过导入的方式如下：

选项式的API：

```js
import { useRouter, useRoute } from 'vue-router'

export default {
  setup() {
    const router = useRouter()
    const route = useRoute()

    function pushWithQuery(query) {
      router.push({
        name: 'search',
        query: {
          ...route.query,
        },
      })
    }
  },
}
```

组合式API

```html
<script setup>
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

function pushWithQuery(query) {
    router.push({
        name: 'search',
        query: {
            ...route.query,
        },
    })
}
</script>
```

然后你可以通过官方提供的API进行js处理

```js
// 字符串路径
router.push('/users/eduardo')

// 带有路径的对象
router.push({ path: '/users/eduardo' })

// 命名的路由，并加上参数，让路由建立 url
router.push({ name: 'user', params: { username: 'eduardo' } })

// 带查询参数，结果是 /register?plan=private
router.push({ path: '/register', query: { plan: 'private' } })

// 带 hash，结果是 /about#team
router.push({ path: '/about', hash: '#team' })
```

或者

```js
router.push({ path: '/home', replace: true })
// 相当于
router.replace({ path: '/home' })
```

或者实现回退

```js
// 向前移动一条记录，与 router.forward() 相同
router.go(1)

// 返回一条记录，与 router.back() 相同
router.go(-1)

// 前进 3 条记录
router.go(3)

// 如果没有那么多记录，静默失败
router.go(-100)
router.go(100)
```



## 08、导航守卫

官网文档：https://router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E5%8F%AF%E7%94%A8%E7%9A%84%E9%85%8D%E7%BD%AE-api

正如其名，vue-router 提供的导航守卫主要用来通过跳转或取消的方式守卫导航。这里有很多方式植入路由导航中：全局的，单个路由独享的，或者组件级的。

### 完整的导航解析流程[#](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html#完整的导航解析流程)

1. 导航被触发。
2. 在失活的组件里调用 `beforeRouteLeave` 守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫(2.2+)。
5. 在路由配置里调用 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve` 守卫(2.5+)。
9. 导航被确认。
10. 调用全局的 `afterEach` 钩子。
11. 触发 DOM 更新。
12. 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入。



### 全局前置守卫

你可以使用 `router.beforeEach` 注册一个全局前置守卫：

```js
const router = createRouter({ ... })

router.beforeEach((to, from,next) => {
  // ...
  // 返回 false 以取消导航
  return false
})
```

**参数如下：**

- **`to`**: 即将要进入的目标 [用一种标准化的方式](https://router.vuejs.org/zh/api/#routelocationnormalized)
- **`from`**: 当前导航正要离开的路由 [用一种标准化的方式](https://router.vuejs.org/zh/api/#routelocationnormalized)

**可以返回的值如下:**

- `false`: 取消当前的导航。如果浏览器的 URL 改变了(可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 `from` 路由对应的地址。
- 一个[路由地址](https://router.vuejs.org/zh/api/#routelocationraw): 通过一个路由地址跳转到一个不同的地址，就像你调用 [`router.push()`](https://router.vuejs.org/zh/api/#push) 一样，你可以设置诸如 `replace: true` 或 `name: 'home'` 之类的配置。当前的导航被中断，然后进行一个新的导航，就和 `from` 一样。
- 如果什么都没有，`undefined` 或返回 `true`，**则导航是有效的**，并调用下一个导航守卫

### 可选的第三个参数 `next`

在之前的 Vue Router 版本中，也是可以使用 *第三个参数* `next` 的。这是一个常见的错误来源，可以通过 [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0037-router-return-guards.md#motivation) 来消除错误。然而，它仍然是被支持的，这意味着你可以向任何导航守卫传递第三个参数。在这种情况下，**确保 `next`** 在任何给定的导航守卫中都被**严格调用一次**。它可以出现多于一次，但是只能在所有的逻辑路径都不重叠的情况下，否则钩子永远都不会被解析或报错。这里有一个在用户未能验证身份时重定向到`/login`的**错误用例**：

```
// GOOD
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  else next()
})
```



## 09、捕获所有路由或 404 Not found 路由

```js
const routes = [
  // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  // 将匹配以 `/user-` 开头的所有内容，并将其放在 `$route.params.afterUser` 下
  { path: '/user-:afterUser(.*)', component: UserGeneric },
]
```





# 17：VueJs状态管理pinia

官网：https://pinia.vuejs.org/zh/

## 01、pinia的简单介绍

Pinia最初是在2019年11月左右重新设计使用Composition API的 Vue 商店外观的实验。
从那时起，最初的原则相同，但 Pinia 适用于 Vue 2 和 Vue 3 。
并且不需要你使用组合 API。
除了安装和SSR之外，还有其他的 API是一样的。
并且这些针对 Vue 3 ，并在必要时提供 Vue 2 的相关注释。
以便 Vue 2 和 Vue 3 的用户可以阅读！

## 02、为什么要使用Pina？


Pinia 是 Vue 的存储库，
允许您跨组件/页面共享状态。
如果您的组合 API，您可能会认为您可以使用简单的export const state = reactive({})
这对于单页应用程序来说是正确的，
但如果它是服务器端的外观，将您的应用程序显示给安全漏洞。
但即使在小型单页应用程序中，您也可以从使用 Pinia 中获得好处：
1.开发工具支持
2.动作、追踪的跟踪
3.热模块更换
4.为 JS 用户提供适当功能的 TypeScript 支持或自动完成

## 03、安装

```sh
npm install pinia --save
```

## 04、创建文件夹和文件-存放数据

在新建 src/store目录并在其下面创建 index.js文件，并导出这个文件

```js
// src/store/index.js下的代码
import { createPinia } from 'pinia'
const store = createPinia()
export default store
```

在 main.js 中引入

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
<!-- 引入 -->
import store from "./store/index"
<!-- 使用store -->
createApp(App).use(router).use(store).mount('#app')
```

**需求描述**

后续我们肯定要去完成登录的状态管理和权限路由的状态管理。这里就直接用项目实战的案例来说明：

## 04、使用选项式的方式定义 - permission.js

选项式的方式定义：https://pinia.vuejs.org/zh/core-concepts/#option-stores

```js
//src/store/user.js 文件
import {defineStore} from 'pinia'
/*
    defineStore 接收两个参数.
    第一个参数：必须是唯一的，多个模块千万千万不能重名。
    因为Pinia 会把所有的模块都挂载到根容器上
    第二个参数是一个对象，里面的选项state和 Vuex 差不多
*/
const usePermissionStore = defineStore("permission",{
    // 1：state是存放数据的
    state: () => {
        return {
           permission:[

           ]
        }
    },
    //2：定义行为 .定义改变数据的地方
    // 可以是异步的方法也可以是是非异步的方法
    actions:{
        initPermission(){
            this.permission = [{"code":10001,"path":"/"},
                {"code":10002,"path":"/bbs"},
                {"code":10003,"path":"/course"},
                {"code":10004,"path":"/category"}]
        }
    },
    // 3: 数据改造的地方--- 注意使用的时候当成属性使用
    getters:{
        getPermissionCode(state){
            return state.permission.map(p=>p.code);
        }
    }
})

export default usePermissionStore
```

## 04、使用组合式setup的方式定义 - user.js

官网：https://pinia.vuejs.org/zh/core-concepts/#setup-stores

```js
//src/store/user.js 文件
import {defineStore} from 'pinia'
import {computed, ref} from "vue";
/*
    defineStore 接收两个参数.
    第一个参数：必须是唯一的，多个模块千万千万不能重名。
    因为Pinia 会把所有的模块都挂载到根容器上
    第二个参数是一个对象，里面的选项state和 Vuex 差不多

    https://pinia.vuejs.org/zh/core-concepts/#setup-stores
*/
const useUserStore = defineStore("userstore",()=>{
      // 1：定义state
      const stateUser = ref({id:""});

      // 2：定义actions
      function handleLogin(user){
          stateUser.value = user
      }

      // 3：定义getters属性
      const isLogin = computed(()=>{
          return stateUser.value.id !== ""
      });

      // 4: 注意一定要返回
      return {
          stateUser,
          handleLogin,
          isLogin
      }
})

export default useUserStore

```

## 05、你应该选用哪种语法？[¶](https://pinia.vuejs.org/zh/core-concepts/#what-syntax-should-i-pick)

官网文档：https://pinia.vuejs.org/zh/core-concepts/#what-syntax-should-i-pick

和[在 Vue 中如何选择组合式 API 与选项式 API](https://cn.vuejs.org/guide/introduction.html#which-one-to-choose) 一样，选择你觉得最舒服的那一个就好。如果你还不确定，可以先试试 [Option Store](https://pinia.vuejs.org/zh/core-concepts/#option-stores)。

## 06、获取store中值的第一种方法

官网文档：https://pinia.vuejs.org/zh/core-concepts/#using-the-store

```js
<template>
  <header class="headerbox">
    <ul>
      <li><router-link to="/" >首页</router-link></li>
      <li><router-link to="/bbs">文章</router-link></li>
      <li><router-link to="/category">分类</router-link></li>
      <li><router-link to="/about">关于我</router-link></li>
    </ul>
    <ul>
      <li style="color:#fff;">{{userStore.stateUser}}</li>
      <li><router-link to="login">登录</router-link></li>
    </ul>
  </header>
</template>

<script setup>
import useUserStore  from '@/store/user'
const userStore = useUserStore()
</script>

<style scoped>
  .headerbox{background: #000;height: 50px;line-height: 50px;display: flex;padding:0 20px;
    justify-content: space-between;
  }
  .headerbox ul{display: flex;list-style: none;}
  .headerbox ul li a{color:#fff;text-decoration:none;padding:0 10px;font-size: 14px;}
  .headerbox ul li a.router-link-active{color:red;font-weight: bold;}
</style>
```

**获取store中值的第二种方法-computed**

```js
<template>
    <div class="pinia">
       <h2> 学习pinia </h2>
        <div>姓名：{{useStoreName}}</div>
        <div>性别：{{useStoreSex}}</div>
    </div>
</template>
    
<script setup lang='ts'>
// 引入store中暴露出去的方法
import { computed } from 'vue'
import { useUserStore } from '../../store/user'
const userStore = useUserStore()
// 使用 computed取获取值
const useStoreName = computed(() => userStore.name)
const useStoreSex = computed(() => userStore.sex)
</script>
```





# 18：VueJs高级编程 - axios

官网：https://www.axios-http.cn/

## 封装的request.js

```js
import axios from 'axios'

// 创建一个实例对象
const request = axios.create({
    //  这里未来编写你api所在的服务器的地址
    baseURL: 'http://localhost:5173',
    // 请求的试卷
    timeout: 10000
});

// 添加请求拦截器
request.interceptors.request.use(function (config) {
    if(!config.hasOwnProperty("istoken")) {
        config.headers["token"] = "xktoken1123456"
    }
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default request;
```