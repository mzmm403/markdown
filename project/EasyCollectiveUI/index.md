## 环境搭建

### 配置项

```shell
# 初始化git
git init
# 创建.gitignore文件
type nul > filename.txt # 这边直接手动创建就行
# 创建packages存放子包
mkdir packages
# 创建pnpm工作空间
# 这一步其实就是根目录创建一个pnpm-workspace.yaml文件，然后将packages:\n - "packages/*"写入文件中
# packages:
#   - "packages/*"
echo -e 'packages:\n - "packages/*"' > pnpm-workspace.yaml
# 初始化pnpm
pnpm init
# 切换目录到packages
cd packages
# 这里用到init.shell的脚本文件初始化
./init.shell
```

```shell
# 切换到packages目录创建必要的目录
mkdir components core docs hooks theme utils
# 遍历创建的必要目录,逐个初始化
for i in components core docs hooks theme utils; do
    # 切换到对应的目录
    cd $i
    # 初始化pnpm
    pnpm init
    # 返回上级目录
    cd ..

done
```



```bash
# 创建一个vue-ts的模板的vite的vue的项目,平时写组件看效果的地方
pnpm create vite play --template vue-ts
# 项目各个目录的作用
packages
├── components # 组件的逻辑代码
├── core       # pnpm包的入口
├── docs       # 项目文档
├── hooks      # 自定义的钩子(组合式api)
├── play       # 写组件看效果的地方
├── theme      # 样式
├── utils      # 工具函数
└── init.sh    # 创建目录的脚本(用完就删除)
```

```json
//  修改各个包里面的packages的name
// 格式: `@easy-collective-ui/目录名`
// 只用core底下的用 `easy-collective-ui`
{
    "name": "@easy-collective-ui/components"
}

// 这样做可以避免和其他库重名
```

```shell
# 返回根目录
cd ..
# 安装开发依赖
pnpm add -Dw typescript@^5.2.2 vite@^5.1.4 vitest@^1.4.0 vue-tsc@^1.8.27 postcss-color-mix@^1.1.0 postcss-each@^1.1.0 postcss-each-variables@^0.3.0 postcss-for@^2.1.1 postcss-nested@^6.0.1 @types/node@^20.11.20 @types/lodash-es@^4.17.12 @vitejs/plugin-vue@^5.0.4 @vitejs/plugin-vue-jsx@^3.1.0 @vue/tsconfig@^0.5.1

# 安装非开发依赖
pnpm add -w lodash-es@^4.17.21 vue@^3.4.19
```

```json
// 修改根目录底下的packages文件的name为@easy-collective-ui/workspace
{
    name:"@easy-collective-ui/workspace"
}
// 在dependencies中添加子包
"dependencies":{
    ...
    "easy-collective-ui": "workspace:*",
    "@easy-collective-ui/hooks": "workspace:*",
    "@easy-collective-ui/utils": "workspace:*",
    "@easy-collective-ui/theme": "workspace:*"
}
```

```shell
# 安装子包依赖
pnpm add -D @vue/test-utils@2.4.5 @vitest/coverage-v8@^1.4.0 jsdom@^24.0.0 --filter @easy-collective-ui/components

pnpm add @popperjs/core@^2.11.8 async-validator@^4.2.5 --filter @easy-collective-ui/components
```

```json
// 在core的packages.json中添加如下
"dependencies":{
    "@easy-collective-ui/components": "workspace:*"
}
// 因为core是pnpm包的入口文件
```

```shell
# docs依赖的是vitepress
pnpm add -D vitepress@1.0.0-rc.44 --filter @easy-collective-ui/docs
# 把play的packages.json文件对照根目录的packages.json文件进行裁剪,重复的依赖项可以直接删掉
#　然后把play目录底下的tsconfig.json和tsconfig.node.json删除(因为要在全局写一个tsconfig文件)
# 根目录创建tsconfig.json
touch tsconfig.json # 也可以图形化创建
touch tsconfig.node.json # 也可以图形化创建
# 添加postcss.config.json配置文件
touch postcss.config.cjs
# 在根目录进行node_moudles的安装
pnpm install
```

tsconfig.json
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

tsconfig.node.json
```json
{
  "extends": "@tsconfig/node18/tsconfig.json",
  "include": ["packages/**/**.config.ts"],
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "types": ["node"]
  }
}
```

postcss.config.cjs

```js
/* eslint-env node */
module.exports = {
  plugins: [
    require("postcss-nested"),
    require("postcss-each-variables"),
    require("postcss-each")({
      plugins: {
        beforeEach: [require("postcss-for"), require("postcss-color-mix")],
      },
    }),
  ],
};
```

.gitignore
```text
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
coverage
dist
dist-ssr
*.local

/cyperss/videos/
/cypress/srceenshots/

.vitepress/dist
.vitepress/cache

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```


### 测试代码

- 工具类(/package/util)

```ts
// 安装插件的工具函数封装(install.ts)

// 引入 Vue 中的 App 和 Plugin 类型，用于定义插件和应用实例的类型
import type { App,Plugin } from "vue"
// 从 lodash-es 库中引入 each 函数，用于遍历数组或对象。
import { each } from "lodash-es"

// 定义一个单文件组件类型SFCWithInstall，交叉类型(vue 插件类型和泛型的混合)
type SFCWithInstall<T> = T & Plugin

/**
 * 接受一个 Plugin 类型的数组 components，用于批量安装组件
 * @param componets 
 * @returns 
 */
// 定义一个导出函数 makeInstaller，接受一个 Plugin 类型的数组 components，用于批量安装组件。
export function makeInstaller(componets: Plugin[]){
    const installer = (app: App) => {
        // 使用 each 函数遍历 components 数组，将每个组件使用 app.use 方法进行安装。
        each(componets,(c) => app.use(c))
    }
    // 返回 installer 函数，作为插件。
    return installer as Plugin
}

/**
 * 接受一个泛型 T 的组件，用于给组件添加 install 方法，使其成为插件。
 * @param component  
 * @returns 
 */
// 定义一个导出函数 withInstall，接受一个泛型 T 的组件，用于给组件添加 install 方法，使其成为插件。
export const withInstall = <T>(component: T) => {
    // 给组件添加 install 方法，接受一个 App 类型的参数 app，用于将组件注册到应用实例中。
    (component as SFCWithInstall<T>).install = (app: App) => {
        // 获取组件的名称，并使用 app.component 方法将组件注册到应用实例中。
        const name = (component as any).name
        // 使用 app.component 方法将组件注册到应用实例中。
        app.component(name,component as Plugin)
    }
    // 返回组件，作为带有 install 方法的插件。
    return component as SFCWithInstall<T>
}


// 导出封装好的工具 index.ts
export * from "./install"
```


- 测试组件(/packages/components)

```vue
<!-- /Button/Button.vue 测试的按钮组件 -->
<template>
    <button style="background: pink;">这是一个按钮</button>
</template>
<script setup lang="ts">
defineOptions({
    name:"EcButton"
})
</script>
```

```ts
// /Button/index.ts 测试的按钮组件的入口文件

// 导入组件和暗转组件的工具函数
import Button from "./Button.vue"
import { withInstall } from "@easy-collective-ui/utils"

// 使用 withInstall 函数给组件添加 install 方法，使其成为插件。
export const EcButton = withInstall(Button) 
```


```ts
// index.ts
// 导出封装好的插件按钮组件
export * from './Button'
```

- 入口文件(packages/core)

```ts
// commponents.ts 导入所有组件
import { EcButton } from "@easy-collective-ui/components";
import type { Plugin } from "vue";

// 定义一个数组，导出所有的插件组件到数组中默认导出
export default [EcButton] as Plugin[];





// index.ts 包入口文件
// 导入安装组件工具函数
import { makeInstaller } from "@easy-collective-ui/utils";
// 从组件文件夹导入组件
import commponents from "./commponents";
// 导入主题样式
import '@easy-collective-ui/theme/index.css';

// 使用 makeInstaller 函数批量安装组件
const installer = makeInstaller(commponents);

// 导出组件和安装器 这里默认导出安装器是为了在其他项目中调用的时候可以直接使用
export * from "@easy-collective-ui/components"
export default installer;
```
- 主题样式(/packages/theme)

```css
/* index.css */
/* 导入样式文件 */
@import "./reset.css"


/** reset.css */
body {
  font-family: var(--er-font-family);
  font-weight: 400;
  font-size: var(--er-font-size-base);
  line-height: calc(var(--er-font-size-base) * 1.2);
  color: var(--er-text-color-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: transparent;
}

a {
  color: var(--er-color-primary);
  text-decoration: none;

  &:hover,
  &:focus {
    color: var(--er-color-primary-light-3);
  }

  &:active {
    color: var(--er-color-primary-dark-2);
  }
}

h1,
h2,
h3,
h4,
h5,
h6 {
  color: var(--er-text-color-regular);
  font-weight: inherit;

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

h1 {
  font-size: calc(var(--er-font-size-base) + 6px);
}

h2 {
  font-size: calc(var(--er-font-size-base) + 4px);
}

h3 {
  font-size: calc(var(--er-font-size-base) + 2px);
}

h4,
h5,
h6,
p {
  font-size: inherit;
}

p {
  line-height: 1.8;

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

sup,
sub {
  font-size: calc(var(--er-font-size-base) - 1px);
}

small {
  font-size: calc(var(--er-font-size-base) - 2px);
}

hr {
  margin-top: 20px;
  margin-bottom: 20px;
  border: 0;
  border-top: 1px solid var(--er-border-color-lighter);
}
```

```json
/** package.json */
{
  "name": "@easy-collective-ui/theme",
  "version": "1.0.0",
  "description": "",
  "main": "index.css",  //修改这里把index.css作为入口文件
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```


- 测试案例(/packages/play)

```ts
// main.ts 测试的vite项目的入口文件，这里注册我们写的组件看是否成功写对
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import EasyCollectivUI from 'easy-collective-ui'


createApp(App).use(EasyCollectivUI).mount('#app')
```

### 文档

> 创建文档

```shell
# 到package/docs的目录中使用初始化命令
cd /packages/docs
npx vitepress init
```

[创建文档详情见文章：建站](https://mzmm403.github.io/markdown/tobuild/build.html)


### 修改最外层的package.json

```json
{
  "scripts": {
    "dev": "pnpm --filter @toy-element/play dev",
    "docs:dev": "pnpm --filter @toy-element/docs dev",
    "docs:build": "pnpm --filter @toy-element/docs build",
    "test": "echo 'hello world'"
  }
}
```


创建一个 `.github/workflows/test-and-deploy.yml` 文件，内容如下

```yaml
name: Test and deploy

on:
  push:
    branches:
      - master

jobs:
  test:
    name: Run Lint and Test
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3

      - name: Install pnpm 
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run tests
        run: npm run test

  build:
    name: Build docs
    runs-on: ubuntu-latest
    needs: test

    steps:
      - name: Checkout repo
        uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build docs
        run: npm run docs:build

      - name: Upload docs
        uses: actions/upload-artifact@v3
        with:
          name: docs
          path: ./packages/docs/.vitepress/dist

  deploy:
    name: Deploy to GitHub Pages
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Download docs
        uses: actions/download-artifact@v3
        with:
          name: docs

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GH_TOKEN }}
          publish_dir: .
```

上面的`secrets.GH_TOKEN`去github创建，然后放到仓库里的配装项中，下次在推送代码的时候会自动部署
