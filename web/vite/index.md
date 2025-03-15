## vite

### 什么是 vite

> vite 的原理流程示意图

![alt text](image.png)

> vite 其实是构建工具的高级封装

vite 在开发时采用了 esbuild，而在打包时采用了 rollup

### vite 的脚手架功能

> vite 作为一个脚手架可以快速构建起一个项目工程目录

- vue

```shell
npm create vite@latest
```

在这里我们可以选择对应的模板然后快速搭建一个以 vite 为基础的前端项目

![alt text](image-1.png)

这里得注意一下，vite 默认创建的是 vue3 的项目
如果想要创建 vue2 项目我们可以选择 vanilla 空模板，然后我们手动创建 vite.config.js 文件，然后安装 vue2 相关插件

```shell
pnpm add vite-plugin-vue2
pnpm add vue@2.7.14
```

然后在 vite 的配置文件中注册 vue2 插件

```js
import { createVuePlugin } from "vite-plugin-vue2";

export default {
  plugins: [createVuePlugin()],
};
```

然后更改 index.html 文件中的 js 引入路径为 src 中的 main.js 文件
创建 src 文件夹，然后在 src 文件夹中创建 main.js 文件和 App.vue 文件

```js
import vue from "vue";
import App from "./App.vue";

new Vue({
  el: "#app",
  render: (h) => h(App),
}).$mount();
```

当然如果你不想自己配置也可以去找到对应的模板`awesome-vite`,找到模板然后进行 clone

### vite 中使用各种 css 功能

#### css verb

> vite 本身支持 css verb 的语法，因此我们可以直接使用 css 的原生语法，例如下面的写法：

```css
:root {
  --main-background-color: #ffffff;
}

.root {
  background-color: var(--main-background-color);
}
```

#### postcss 的支持

> vite 本身内置了 postcss，因此我们如果想要使用 postcss 的各种功能，只需要在项目的根目录下创建一个 postcss.config.js 即可在配置文件中注册 postcss 的插件，例如：

```js
module.exports = {
  plugins: [
    require("postcss-nested"),
    require("postcss-each-variables"),
    require("postcss-each")({
      plugins: {
        beforeEach: [require("postcss-for"), require("postcss-color-mix")],
      },
    }),
    require("cssnano")({ preset: "default" }),
  ],
};
```

#### 路径映射

> css 由于引入了 import 语法，这里就导致了我们在引入样式文件的时候要按照文件的路径进行导入，vite 本身可以配置路径映射来优化导入时的路径繁琐问题，例如：

```js
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@styles": "/src/styles",
    },
  },
});
```

有了上面的配置以后我们就可以在项目中直接使用`@styles/xxx.css`的方式来引入样式文件了。

#### css 模块化

> vite 支持 css 模块化，只需要在引入样式文件的时候加上`module`关键字即可开启 css 的模块化功能,例如`test.module.css`。

#### css 预处理器

> vite 支持各种 css 预处理器，只需要在项目中安装对应的插件即可使用例如：

```shell
pnpm add sass
pnpm add less
```

### vite 中使用 ts

> 在 vite 中使用 ts 只进行编译不进行任何的校验工作.

#### tsconfig 配置文件

我们需要修改 tsconfig.json 文件来配置 ts 的编译选项，例如：

```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "jsxImportSource": "vue",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["packages/**/*.ts", "packages/**/*.tsx", "packages/**/*.vue"]
}
```

#### ts 校验

> 遂于 vue 使用 vue-tsc 进行 ts 的编译校验,通常在 package.json 中配置 scripts 脚本，例如：

```json
scripts:{
    build: "vue-tsc --noEmit tsc --noEmit && vite build",
}
```

#### isolatedModules

> isolatedModules: true 开启后，ts 会校验文件之间的依赖关系。

1. 支持独立编译
2. 防止某些全局类型推导带来的问题
3. 避免 `const enum` 带来的问题

#### vite client

> vite 本身支持一些内部变量，例如：`import.meta.env`,这个时候 ts 无法识别对应的类型，因此我们需要在 tsconfig.json 中配置对应的类型定义文件，例如：

```json
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

client 的类型：

- asset import import 静态文件返回类型
- env 环境变量
- HMR API 模块热更新的 api 例如`import.meta.hot`
- 静态资源 (例如我们可以这样导入静态资源： import pngUrl from './xxx.png') 如果没有配置是不认识这个 png 文件是什么类型的。

### vite 处理静态资源的方法

#### 静态资源导入

> vite 提供了三种静态资源导入方式：

- url: 导入静态资源路径
- raw: 导入静态资源内容

```js
// 三种写法
import imgUrl from "./xxx.png?url";
console.log(imgUrl);
import imgRaw from "./xxx.png?raw";
console.log(imgRaw);
```

- worker/worker inline

```js
// worker.js
var i = 0;
function timeCount() {
  i = i + 1;
  postMessage(i);
  setTimeout(timeCount, 500);
}

timeCount();

// main.js
import Worker from "./worker.js?worker";
const worker = new Worker();
worker.onmessage = (e) => {
  console.log(e);
};
```

#### JSON

> vite 可以直接导入 json 文件

```js
// data.json
{
    "name": "xxx"
    "age": 18
    "sex": "male"
    "hobbies": ["football", "basketball"]
}

// main.js
import data from './data.json'
console.log(data)
import { name,age } from './data.json'
console.log(name, age)
```

#### web Aseembly

> web Aseembly 是一种可以让代码运行在浏览器中的二进制格式，vite 可以直接导入 web Aseembly 文件

```js
// xx.wasm

import wasm from './xx.wasm?init'
// 返回一个promise对象
wasm().then(res => {
    res.do(...)
})
```

### vite 集成 eslint 和 prettier

> eslint 是帮助我们规范我们代码书写的，pettier 是帮助我们进行代码格式化的

对于集成 eslint，在根目录下创建一个`.eslintrc.js`文件，但是在 9 版本以后默认使用`eslint.config.js`文件作为配置文件名，例如：

当然你这里要是觉得配置麻烦你也可以直接使用现成的标准，例如`eslint-config-standard`。

```shell
npm install --save-dev eslint eslint-config-standard
```

```js
// 你可以遵从cjs的写法，也可以遵从esm的写法
// 这里以cjs的写法为例

const standard = require('eslint-config-standard')

moudle.exports = {
    standards,
    {
        ...
    }
}
```

对于集成 prettier，在根目录下创建一个`.prettierrc`文件

对于 vscode 我们要安装插件：
![alt text](image-2.png)

```json
{
  // 分号不添加
  "semi": false,
  // 使用单引号代替双引号
  "singleQuote": true
}
```

然后我们在 vscode 的 setting 中寻找一个 format on save 的选项，勾选上即可。再搜索 formatter，选择 prettier 即可。

我们配置到现在发现当我们推送代码的时候会发现代码格式还是不统一，这是因为我们没有配置 husky

```shell
npm install husky -D
npx install husky
npx husky add .husky/pre-commit "npm run lint"
```

### vite 的环境变量

> 在 vite 中我们可以通过`import.meta.env`来访问环境变量，例如：

一般有五个环境变量：

- DEV：是否是开发环境
- PROD：是否是生产环境
- MODE：可以是 dev/prod/test 等
- BASE_URL：根地址
- SSR：是否服务端渲染

不仅能使用 vite 自带的这几个，我们还可以在根目录下创建一个`.env`文件，在里面定义自己的环境变量，自定义的变量前面都要加 VITE\_，例如：VITE_TITLE。

这里要注意,对于`.env`文件，不同后缀的文件在不同的环境下会被加载，例如：`.env.development`只在开发环境下被加载，`.env.production`只在生产环境下被加载。

在`package.json`中我们可以通过指定`--mode`来指定不同的环境
对于`.env.test`文件中的环境变量在我们指定了`--mode test`之后就会被加载。
例如：

```json
scripts:{
    "dev": "vite --mode test",
}
```

我们自定义的变量，编译器会有提醒缺失，因此我们需要在 src 目录下创建一个`vite-env.d.ts`文件，在里面定义我们的环境变量类型

```ts
/// <reference types="vite/client" />
interface ImportMetaEnv {
  VITE_TITLE: string;
}
```

### vite 的热更新(HMR)

> 热更新是指在代码修改之后，不需要重新加载整个页面，而是只更新修改的部分。

下面来实现一个最简单最具针对性的热更新案例：

```js
export function render() {
  document.querySelector("#app").innerHTML = `
        <h1>Vite App</h1>
        <a>Document</a>
    `;
}

render();

if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    render();
  });
}
```

我们在对页面进行修改之后，会发现页面并没有重新加载，而是直接更新了内容。这里打开网络请求会发现 vite 的热更新是通过 websocket 实现的，后面有一个 websocket 的服务器，每次在更新时会发送一个消息给 websocket 服务器，它时一个 update 事件，然后客户端接收到消息之后，就会执行我们的热更新代码。

![alt text](image-3.png)

从网络请求我们还能发现一开始加载的 main.js 文件，在更新页面以后，客户端会发送一个请求给服务器，然后服务器会返回一个更新的 main.js 文件。
![alt text](image-4.png)

基于上面的 HMR 的实现我们不难发现，对于 Vue 这种 SFC,我们可以更容易直接写一个通用的 HMR 逻辑，因为这里一个 vue 文件就是一个模块，我们只需要监听这个模块的更新即可。

### glob import

#### glob

> 可以通过类似正则的表达式去引入一种 js 文件，这是 vite 提供的功能，这个功能来自于`fast-glob`这个库

例如我们在某个场景下想要引入某个文件夹下的所有文件，我们可以这样写：

```js
// 这里的*可以用正则进行匹配

const globModules = import.meta.glob("./glob/*");

console.log(globModules);
```

> 查看编译结果我们会发现所有的模块是被编译成函数然后通过 import 函数异步引入的。

#### globEager

> 按照 glob 的编译结果，如果我们想一开始就把代码编译进来，不需要通用异步引入，我们这个时候就需要使用`globEager`

```js
const globModules = import.meta.globEager("./glob/*");
```

使用 globEager 编译出来的结果是吧模块直接导入进去

### 预编译

- 预编译原理

vite 之所以开发时加载速度快离不开预编译，预编译其实就是在项目运行的时候 vite 把 node_modules 中引入到的第三方库进行一次编译然后放到 cache 中，之后要用到的第三方库的包在 cache 中取，这个 cache 对应的就是`node_modules/.vite`

- 预编译会把 commonJS 转换成 ESM 标准

由于 vite 是遵从 ESMoudle 的因此在预编译的时候 vite 会把 commonJs 转成 ESMoudle,对应到 vite 的配置项中有一项为 optimizeDeps,如下：

```js
export default defineConfig({
  plugins: [],
  optimizeDeps: {
    exclude: ["react"],
  },
});
```

vite 在进行预编译之前会扫描依赖，而上面的写法就是手动指定不要预编译哪些依赖，对应的 include 就是手动指定要预编译哪些依赖。如果遇到`xxx does not provide an export named 'default'`就代表了某个依赖用的是 commonJs 导致没有默认导出，此时我们要考虑手动将依赖进行预编译

- 预编译会将零散的 bundle 汇聚到一起

以`lodash-es`为例，当我们项目中引入了改库中的某一个函数，由于函数的实现可能要关联到 lodash 下的其他 js 文件，我们在 vite 配置项中不预编译 lodash 会在页面的网络请求中发现有非常多的 JS 文件被请求

### 在服务端集成vite(非nodejs服务)

对于大部分后端框架来说都会有前后端不分离的写法，他们一般都是由自己的前端模板，例如java的jetl。对于这种我们改如何集成vite呢？这里vite给出了方法如下(下面以html的伪代码为例)：

```html
<!-- 
 首先得有一个类名为app的div 
 因为用vite做脚手架的项目这里再渲染到index.html的时候都是用的class=app来挂载页面内容的
-->
<div class="app"></div>
<!-- 
 这里要加上type="module"，原因是因为vite遵守ESM
 我们本地首先要启动一个vite服务，这里可以理解为vite客户端，然后我们再vite客户端写逻辑和页面即可同步渲染到后端模板文件中
-->
<script type="module" src="http://localhost:3001/@vite/client"/>
<script type="module" src="http://localhost:3001/src/main.js"/>
```


在打包的时候我们需要在配置文件中加上一个参数

```js
export default defineConfig({
    plugins: [],
    resolve: {},
    // 加一个打包项参数
    build: {
        manifest: true
    }
})
```

我们将打包产物中的资源正确引入到后端模板代码中即可


### Nodejs中集成vite



### vite配置项总览

[vite的配置项总览](https://vitejs.cn/vite3-cn/config/)





## rollup

> rollup是一个以ESM标准为目标的构建工具，支持tree-shaking，支持多种插件等。


### rollup的命令使用

rollup的安装如下：

```shell
npm i rollup -g
```

rollup的命令使用如下：

```shell
#  查看版本
rollup -v
# -i 指定入口文件
# -file 指定输出文件
# --format 指定输出格式
rollup -i main.js -file bundle.js --format iife
# --dir 指定输出目录
rollup -i a.js -i b.js --dir dist
# --watch 监听文件变化
# --config 指定配置文件
# --environment 指定环境变量
# --plugin 指定插件
```

format的类型如下：
- iife
- cjs
- es
- umd (cjs+amd+iife的结合体)
 
rollup的配置文件简单使用如下：

```js
export default {
  input: "main.js",
  output: {
    file: "bundle.js",
    format: "iife"
  }
}
```

### rollup配置文件

> 下面是关于rollup配置文件的一些基础配置`rollup.config.js`


```js
// 默认导出可以是一个对象也可以是一个数组
// 下面以数组为例
export default [
  {
    input: "index.js",
    external: ["lodash"],
    plugins: [resolve(), commonjs()],
    output: [
      {
        file: "dist/bundle.umd.js",
        format: "umd",
        banner: "/*! banner */",
      },
      {
        file: "dist/bundle.esm.js",
        format: "es",
        plugins: [terser()]
      }
    ]
  },
  {
    input: "main.js",
    output: {
      file: "dist/main.cjs.js",
      format: "cjs"
    }
  }
]
```

对于上面的配置文件，有如下：
- input： 指定入口文件
- external： 指定不打包的文件
- plugins： 指定插件
- output： 指定输出配置
- file： 指定输出文件
- format： 指定输出格式
- banner： 指定输出的头部(一般是一些作者的信息或者是组件的一些信息)


### rollup插件

> rollup插件的使用很简单，只需要在配置文件中引入即可

流程如下：

inpute => rollup main => 插件1 => 插件2 => ... => emit file => finish

> 大部分插件可以直接在vite中使用的，下面介绍三个官方插件

#### alias

- 安装使用

```shell
npm i @rollup/plugin-alias
```

```js
import alias from "@rollup/plugin-alias"

export default {
  plugins: [alias()]
}
```

#### resolve

- 安装使用

```shell
npm i @rollup/plugin-alias
```

```js
import alias from "@rollup/plugin-alias"

export default {
  plugins: [alias({
    entries: {
      "@": path.resolve(__dirname, "src")
    }
  })]
}
```


#### babel

- 安装使用

```shell
npm i @rollup/plugin-babel -D
```

```js
import { babel} from "@rollup/plugin-babel"

export default {
  plugins: [babel({
    exclude: "node_modules/**",
    presets: ["@babel/preset-env"]
  })]
}
```

#### rollup的hook

[hook的文档](https://www.rollupjs.com/plugin-development/#buildend)

- buildEnd
- buildStart
- closeWatcher
- load
- moduleParsed
- options
- resolvDyamicImport
- tranform
- watchChange
- augmentChunkHash
- bannner
- closeBundle
- footer
- generateBundle
- intro
- outputOpions
- outro
- renderChunk
- renderDynaimcImport
- renderError
- renderStart
- resolveFileUrl
- resolveImportMeta
- wrtieBundle


#### 常用插件推荐