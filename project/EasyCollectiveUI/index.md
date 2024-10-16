## 环境搭建

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

```cjs
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