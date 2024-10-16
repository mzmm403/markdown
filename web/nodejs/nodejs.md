## node的版本控制器

> nvm

```shell
# 安装
nvm install
# 卸载
nvm uninstall
# 查看当前安装的列表
nvm list
# 切换版本
nvm use
```

## 代码提示安装的包

> 让代码提示更全

```shell
npm i -D @types/node
```

## node核心

### node概述

#### 什么是node

- node是一个js的运行环境
- [node官网](https://nodejs.org/zh-cn)
- 它比浏览器拥有更多能力

浏览器中的js
- es标准 + web-api
    ![alt text](image.png)
- web api提供了操作浏览器窗口和页面的能力
    - BOM
    - DOM
    - AJAX(fetch)
- 这种能力是非常有限的
    - 跨域问题(同源策略，让其他网站不能随便获取本站数据)
    - 文件读取

Node中的JS
- es标准 + NodeApi
    ![alt text](image-1.png)
- NodeApi几乎提供所有能做的事

分层结构图
![alt text](image-2.png)

- 因为浏览器提供的有限能力，JS只能使用浏览器提供的功能作用有限的操作。
- 而Node提供了完整的控制计算机的能力，NodeJS几乎可以通过Node提供的接口，实现对整个操作系统的控制

- 优势在于NodeJS是单线程异步回调，因此IO操作快，没有切换线程的消耗(NodeJS也支持多线程，支持CPU的多核)。
- 缺点在于运算太慢了

#### Node能干什么

学习目的：
- 开发桌面应用程序(例如vscode)
- 开发服务器应用程序(两种结构)
    - 结构1(更多是这样的)，这种结构一般做转发功能，同时数据库中记录一些简单信息(请求日志，用户偏好，广告信息)，静态资源，缓存
    ![alt text](image-3.png)
    - 结构2
    ![alt text](image-4.png) 

### node全局对象

#### setTimeout

```js
const timer = setTimeout(() => {},1000);
console.log(timer);
```

在浏览器中setTimeout返回的是一个数字
![alt text](image-5.png)
在nodejs中返回的是一个对象
![alt text](image-6.png)

#### setInterval
> 用法和浏览器中的是一样的

#### setImmediate
```js
// setImmediate 类似于 setTimeou 0
const timer = setTimeout(() => {},0);
```
#### console

> 用于控制台输出


#### __dirname
> 获取当前模块所在的目录(绝对路径)
> 并不是global属性

#### __filename
> 获取当前模块的文件路径(绝对路径)
> 并非global属性

#### Buffer
> 类型化数组
> 继承自UInt8Array
> 计算机中存储的基本单位为字节
> 使用时、输出时可能需要用十六进制表示

#### process

- cwd()
    - 返回当前nodejs进程的工作目录
    - 绝对路径
- exit()
    - 强制退出当前node进程
    - 可传入退出码，0表示成功退出，默认是0
- argv
    - String[]
    - 获取命令中的所有参数
    - 可以传入不同的参数
- platform
    - 获取当前代码运行的操作系统
- kill(pid)
    - 根据ID杀死进程
- env
    - 获取操作系统的环境变量的


### node的模块化

#### 模块的查找

- 所有的模块查找路径最后都会转为绝对路径
- 对于非当前模块自定义的相对路径寻找模块顺序如下：
    - 检查是否是内置模块，如：fs,path等
    - 检查当前目录中的node_modules
    - 检查上级目录中的node_modules
    - 转换成绝对路径
    - 加载模块
- 关于后缀名，如果不提供后缀名，自动补全，顺序是(js>json>node>mjs)
- 关于文件名，如果仅提供目录，不提供文件名，则自动寻找该目录的index.js、package.json中的main字段。
    - package.json的main是指包的默认入口，导入或执行包时若仅提供目录，则使用main补全入口默认时index.js(**容易面试题**)

```js
// 绝对路径导入
require("D:\\gitee\\0-web-study-list\\nodejs-study\\a.js")

// 相对路径导入
// 相对当前模块
require("./a.js")
require("../a/a.js")

// 非自己定义的模块
require("fs")


// 示例
require("./src")
// 寻找顺序
// ./src => ./src.js => ./src.json => ./src.node => ./src.mjs => ./src/index.js
```

#### module对象
> 记录了当前模块的信息

```js
{
  // 模块的绝对路径，如果是入口模块就是. 如果不是就是绝对路径
  id: '.',
  // 模块的目录
  path: 'C:\\Users\\86181\\Desktop\\gitee\\0-web-study-list\\nodejs-study',
  // 用来导出的       
  exports: {},
  // 模块所在的文件
  filename: 'C:\\Users\\86181\\Desktop\\gitee\\0-web-study-list\\nodejs-study\\index.js',
  // 这个模块是否加载完了
  loaded: false,
  // 子模块
  children: [],
  // 查找路径
  paths: [
    'C:\\Users\\86181\\Desktop\\gitee\\0-web-study-list\\nodejs-study\\node_modules',
    'C:\\Users\\86181\\Desktop\\gitee\\0-web-study-list\\node_modules',
    'C:\\Users\\86181\\Desktop\\gitee\\node_modules',
    'C:\\Users\\86181\\Desktop\\node_modules',
    'C:\\Users\\86181\\node_modules',
    'C:\\Users\\node_modules',
    'C:\\node_modules'
  ]
  // 其实还有一个参数是parent，但是由于入口模块没有父模块(parent其实就是哪个模块使用的它)
}
```

#### require函数



```js
[Function: require] {
  // 把路径的写法转换成绝对路径  
  resolve: [Function: resolve] { paths: [Function: paths] },
  // 入口模块(主模块)
  main: {
    id: '.',
    path: 'C:\\Users\\86181\\Desktop\\gitee\\0-web-study-list\\nodejs-study',     
    exports: {},
    filename: 'C:\\Users\\86181\\Desktop\\gitee\\0-web-study-list\\nodejs-study\\index.js',
    loaded: false,
    children: [],
    paths: [
      'C:\\Users\\86181\\Desktop\\gitee\\0-web-study-list\\nodejs-study\\node_modules',
      'C:\\Users\\86181\\Desktop\\gitee\\0-web-study-list\\node_modules',
      'C:\\Users\\86181\\Desktop\\gitee\\node_modules',
      'C:\\Users\\86181\\Desktop\\node_modules',
      'C:\\Users\\86181\\node_modules',
      'C:\\Users\\node_modules',
      'C:\\node_modules'
    ]
  },
  // 拓展名的处理方式
  extensions: [Object: null prototype] {
    '.js': [Function (anonymous)],
    '.json': [Function (anonymous)],
    '.node': [Function (anonymous)]
  },
  // 缓存的模块
  cache: [Object: null prototype] {
    'C:\\Users\\86181\\Desktop\\gitee\\0-web-study-list\\nodejs-study\\index.js': 
{
      id: '.',
      path: 'C:\\Users\\86181\\Desktop\\gitee\\0-web-study-list\\nodejs-study',   
      exports: {},
      filename: 'C:\\Users\\86181\\Desktop\\gitee\\0-web-study-list\\nodejs-study\\index.js',
      loaded: false,
      children: [],
      paths: [Array]
    }
  }
}
```


#### require为什么能导入(面试题)

> 当执行一个模块或使用require时，会将模块放置在一个函数环境中

- 案例

    下面是一个外部模块`myModule`,导入以后的结果是什么
    ```js
    console.log("当前模块路径", __dirname)
    console.log("当前模块文件", __filename)
    exports.c = 3
    module.exports = {
        a: 1,
        b: 2
    }
    this.m = 5
    ```
    ```js
    console.log(require("./myModule")) // 答案是：{a:1,b:2}
    ```


- 原理

    require函数的伪代码
    ```js
    function require(modulePath){
        // 1. 将modulePath转换成绝对路径(D:\xx\xx\xx.js)
        require.reslove(modulePath)
        // 2. 判断是否该模块已有缓存
        if(require.cache["D:\\xx\\xx\\xx.js"]){
            return result
        }
        // 3. 读取文件内容
        // 4. 包裹到一个函数中
        function __temp(module,exports,require,__dirname,__filename){
            console.log("当前模块路径", __dirname)
            console.log("当前模块文件", __filename)
            exports.c = 3
            module.exports = {
                a: 1,
                b: 2
            }
            this.m = 5
        }

        // 5. 创建module对象
        module.exports = {}
        const exports = module.exports
        // 这样劫持函数以后module.exports,module,this三者相等
        __temp.call(module.exports,module,exports,require,module.path,module.filename)

        return module.exports   
    }
    ```

### Node中的ES模块化

> 模块要么是commonjs，要么是ES(不能混合使用)

- commonjs
    - 默认情况下，都是commonjs

- ES
    - 文件后缀名位.mjs(某个模块用es)
    - 最近的package.json中type的值是module(整个工程都得用es)


在node老版本,当使用ES模块化运行时，必须添加--experimental-modules

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
    "start":"node --experimental-modules index.mjs"
},
```

es的动态异步加载
```js
import("./a.mjs").then(r => console.log(object))
```

### Node基本内置模块

#### os

> [os的文档](https://nodejs.org/docs/latest/api/os.html)

##### os.EOL

> 一个字符串的值

linux换行符： `\n`
windwos换行符： `\r\n`
可以统一用`os.EOL`常量

```js
const os = require("os")
console.log("你好"+os.EOL+"同学")
```
##### os.arch()

> 返回值时当前系统cpu的架构名`x32`,`x64`,`ppc`,`ppc64`,`s390`,`s390x`

```js
console.log(os.arch())
```
##### os.cpus()🚩

重要性应用：更具不同的cpu内核开启多线程

> 获取cpu每一个核的信息，返回一个数组，数组里面时每个核的参数对象


```js
console.log(os.cpus())

// 返回的值，每个核的参数对象的例子
{
    model: 'AMD Ryzen 9 5900HX with Radeon Graphics        ',
    speed: 3294,
    times: {
        user: 3937703,
        nice: 0,
        sys: 2098718,
        idle: 38430781,
        irq: 29687
    }
}
```

##### os.freemem()

> 获得当前内存还剩下多少，返回值是整数表示字节

```js
console.log(os.freemem())  // 字节
console.log(os.freemem()/1024)  // KB
console.log(os.freemem()/1024**2)  // MB
console.log(os.freemem()/2**30)  //GB
```

##### os.homedir()

> 获取当前电脑的用户文件夹目录的路径,返回类型位字符串

```js
console.log(os.homedir())
```
##### os.hostname()
> 获取计算机名,返回类型位字符串

```js
console.log(os.hostname())
```

##### tmpdir()🚩

重要性应用：动态获取临时目录

> 获取操作系统的临时目录,返回类型位字符串

```js
console.log(os.tmpdir())
```

#### path

> [path的文档](https://nodejs.org/docs/latest/api/path.html)

##### path.basename()🚩

- 参数
    - path `<string>` 文件路径
    - ext `<string>` 可选参数，文件拓展名
- 返回值
    - `<string>` 文件的全名

> 给出文件路径，获取文件的全名


```js
path.basename('/foo/foo/foo/foo.html')
// Return: 'foo.html'

path.basename('/foo/foo/foo/foo.html','.html')
// Return: 'foo'
```

##### path.delimiter

> 一个常量，表示该系统的分隔符

windwos: `;`
macOS: `:`

##### path.sep

> 一个常量,表示该系统的分割符的

windwos: `\`
macOS: `/`


##### path.dirname()🚩

- 参数
    - path `<string>` 文件路径
- 返回值
    - `<string>` 文件所在的目录

```js
path.dirname("/foo/foo/foo")
// Returns： "/foo/foo"
```
##### path.extname()

- 参数
    - path `<string>` 文件路径
- 返回值
    - `<string>` 文件的后缀名

```js
path.dirname("/foo/foo/foo.js")
// Returns： "。js"

path.dirname("/foo/foo/foo")
// Returns： " "
```

##### path.join()🚩
- 参数
    - `<string>` 文件目录名和文件名
- 返回值
    - `<string>` 文件的完整路径

> 给对应的目录名，返回一个完整的文件路径

```js
path.join("a","b","c","d.js")
// Returns： "a/b/c/d.js"
// Returns： "a\\b\\c\\d.js"

path.join("a","b","../","d.js")
// Returns： "a/d.js"
// Returns： "a\\d.js"
```

##### path.normalize()

- 参数
    - path  `<string>` 完整的路径

> 给一个完整的路径，返回规范化的路径

```js
path.normalize('/foo/foo1/foo2/..')
// Returns: "/foo/foo1"
// Returns: "\\foo\\foo1"
```

##### path.relative()

- 参数
    - from `<string>` 参照路径
    - to `<string>` 目标路径

- 返回值
    - `<string>` 相对路径

> 给出一个参照路径和一个目标路径，返回目标路径相对于参照路径的相对路径

```js
path.relative("/data/foo/test/aaa","/data/foo/demo/bbb")

// Return: "../../demo/bbb"
// Return: "..\\..\\demo\\bbb"
```

##### path.resolve()🚩

- 参数
    - from `<string>` 参照路径
    - to `<string>` 目标路径

- 返回值
    - `<string>` 绝对路径

> 给出一个文件，获取它相对于当前命令行的绝对路径，如果指定了参照路径就返回相对于参照路径的绝对路径

```js
path.resolve("./a.js")
// Return /0-web-study-list/nodejs-study/a.js
// Return C:\\Users\\86181\\Desktop\\0-web-study-list\\nodejs-study\\a.js

path.resolve(__dirname,"./a.js")
// 返回的就是相对于项目目录的文件的绝对路径
```

#### url

> [url的文档](https://nodejs.org/docs/latest/api/url.html)

```js
const URL = require("url")
const url = new URL.URL("http://www.xxx.com:3306/a/b/c?t=3&u=4#abc")
// 或者 parse就是帮助调用构造函数
const url = URL.parse("http://www.xxx.com:3306/a/b/c?t=3&u=4#abc")
console.log(url)

// URL {
//   href: 'http://www.xxx.com:3306/a/b/c?t=3&u=4#abc',
//   origin: 'http://www.xxx.com:3306',
//   protocol: 'http:',
//   username: '',
//   password: '',
//   host: 'www.xxx.com:3306',
//   hostname: 'www.xxx.com',
//   port: '3306',
//   pathname: '/a/b/c',
//   search: '?t=3&u=4',
//   searchParams: URLSearchParams { 't' => '3', 'u' => '4' },
//   hash: '#abc'
// }

console.log(url.searchParams.has("a"))   // false
console.log(url.searchParams.has("t"))   // true
console.log(url.searchParams.get("t"))   // 3



const obj = {
  href: 'http://www.xxx.com:3306/a/b/c?t=3&u=4#abc',
  origin: 'http://www.xxx.com:3306',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'www.xxx.com:3306',
  hostname: 'www.xxx.com',
  port: '3306',
  pathname: '/a/b/c',
  search: '?t=3&u=4',
  hash: '#abc'
}

const url = URL.format(obj)
console.log(url)  // http://www.xxx.com:3306/a/b/c?t=3&u=4#abc
```


#### util

> [util的文档](https://nodejs.org/docs/latest/api/util.html)

##### callbackify

- 参数
    - original `<Function>` 一个async函数
- 返回值
    - `<Function>` 一个回调函数

> 将一个异步函数转换为一个回调函数处理

```js
const util = require("util")

async function delay(duration = 1000) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(duration)
        }, duration)
    })
}

delay(500).then(d=>{
    console.log(d)
})

const delayCallback = util.callbackify(delay)

delayCallback(500,(err,d)=>{
    console.log(d)
})
```

##### inherits
- 参数
    - 子类
    - 父类

> 第一个参数为子类，第二个为父类，子类继承父类

##### isDeepStrictEqual🚩

- 参数
    - `<obj>` 对象1
    - `<obj>` 对象2

> 将两个对象继续深度严格比较

```js
const util = require("util")

const obj1 = {
    a:1,
    b:{
        c:3,
        d:{
            e:4
        }
    }
}

const obj2 = {
    a:1,
    b:{
        c:3,
        d:{
            3:5
        }
    }
}


console.log(util.isDeepStrictEqual(obj1,obj2)) // false
```

##### promisify🚩

- 参数
    - original `<Function>` 一个回调函数
- 返回值
    - `<Function>` 一个async函数

> 将一个回调函数转换成异步函数处理

```js
const util = require("util")

function delayCallBack(duration,callback){
    setTimeout(()=>{
        callback(null,duration)
    },duration)
}

const delay = util.promisify(delayCallBack)

delay(500).then(d => console.log(d))
```


### 文件I/O

> IO的速度往往低于内存和CPU的交互速度

> [fs模块的文档](https://nodejs.org/docs/latest/api/fs.html)

#### 读取文件

##### fs.readFile()

- 参数
    - path `<string>` 目标文件的路径
    - options `<obj>` 可选项配置
        - encoding `<string>` 编码类型
        - flag `<string>` 文件模式，默认值为 'r'
        - signal `<AbortSignal>` 允许中止正在进行的读取文件
    - callback `<Function>` 回调函数


```js
const fs = require("fs")
const path = require("path")

// 获取文件的绝对路径
const filename =  path.resolve(__dirname,"./myfiles/1.txt")

fs.readFile(filename,(err,content) => {
    console.log(content)
    console.log(content.toString("utf-8"))
})
// 不传入编码就是Buffer,传入就是按照编码解析
fs.readFile(filename,"utf-8",(err,content) => {
    console.log(content)
    console.log(content.toString("utf-8"))
})


// readFile的同步方法
// Sync函数是同步的，会阻塞JS的运行，极其影响性能
// 通常，在程序启动时运行有限次数即可
const content = fs.readFileSync(filename,"utf-8")
console.log(content)
```

##### fs.promise.readFile()
- 参数
    - path `<string>` 目标文件的路径
    - options `<obj>` 可选项配置
        - encoding `<string>` 编码类型
        - flag `<string>` 文件模式，默认值为 'r'
        - signal `<AbortSignal>` 允许中止正在进行的读取文件
- 返回值
    - Promise `<Promise>` 错误和读取的内容


```js
const fs = require("fs")
const path = require("path")
// 获取文件的绝对路径
const filename =  path.resolve(__dirname,"./myfiles/1.txt")
async function test(){
    const content = await fs.promises.readFile(filename,{encoding:"utf-8",flag:"r"})
    console.log(content)
}
```

#### 写入文件

##### fs.writeFile()

- 参数
    - path `<string>` 目标文件的路径
    - data `<string> | <Buffer> | <stream> 等` 要写的内容
    - options `<obj>` 可选项配置
        - encoding `<string>` 编码类型
        - mode `<integer>` 默认值 `0o666` 设置权限
        - flag `<string>` 文件模式，默认值为 'w'
        - flush `<boolean>` 
        - signal `<AbortSignal>` 允许中止正在进行的读取文件
    - callback `<Function>` 回调函数

```js
const fs = require("fs")
const path = require("path")
// 获取文件的绝对路径
const filename =  path.resolve(__dirname,"./myfiles/1.txt")

// 如果这里的路径的文件不存在会自动创建，但是目录不存在就会报错
fs.writeFile(filename,"mzmm",(err)=>{
    if(!err){
        console.log("写入成功")
    }else{
        console.log("写入失败")
    }
})


// writeFile的同步模式
fs.writeFileSync(filename,"mzmm")
```

##### fs.promise.writeFile()

- 参数
    - path `<string>` 目标文件的路径
    - data `<string> | <Buffer> | <stream> 等` 要写的内容
    - options `<obj>` 可选项配置
        - encoding `<string>` 编码类型
        - mode `<integer>` 默认值 `0o666`
        - flag `<string>` 文件模式，默认值为 'w'
        - flush `<boolean>` 
        - signal `<AbortSignal>` 允许中止正在进行的读取文件
- 返回值
    - Promise `<Promise>` 成功后履行

```js
const fs = require("fs")
const path = require("path")
// 获取文件的绝对路径
const filename =  path.resolve(__dirname,"./myfiles/1.txt")

async function test() {
    const buffer = Buffer.from("mzmm403","utf-8")
    // flag:"a" 追加写入模式
    // 如果这里的路径的文件不存在会自动创建，但是目录不存在就会报错
    await fs.promises.writeFile(filename,buffer,{encoding:"utf-8",flag:"a"}) 
    console.log("写入成功")
}
```

#### 文件复制demo
```js
const fs = require("fs")
const path = require("path")

async function test() {
    const filename =  path.resolve(__dirname,"./myfiles/1.jpg")
    const content = await fs.promises.readFile(filename)
    const filename1 =  path.resolve(__dirname,"./myfiles/1.copy.jpg")
    await fs.promises.writeFile(filename1,content) 
    console.log("写入成功")
}
test()
```

#### 获取文件或目录的信息

> 返回的是文件的状态

```js
Stats {
  dev: 12148368,
  mode: 33206,
  nlink: 1,
  uid: 0,
  gid: 0,
  rdev: 0,
  blksize: 4096,
  ino: 75153818782251150,     
  size: 8530,
  blocks: 24,
  atimeMs: 1727930690274.6682,
  mtimeMs: 1727930326547.8286,
  ctimeMs: 1727930335346.66,  
  birthtimeMs: 1727930326080.8604,
  atime: 2024-10-03T04:44:50.275Z,
  mtime: 2024-10-03T04:38:46.548Z,
  ctime: 2024-10-03T04:38:55.347Z,
  birthtime: 2024-10-03T04:38:46.081Z
}
```

- size：占用字节
- atime：上次访问事件
- mtime：上次文件内容被修改时间
- ctime：上次文件状态被修改时间(比如访问权限)
- birthime：文件创建时间
- isDirectory()：判断是否是目录
- isFile()：判断是否是文件


##### fs.stat()

- 参数
    - path `<string> | <Buffer> | <URL>` 文件路径
    - options
        - bigint `<boolean>` 默认为false
    - callback
        - err `<Error>`
        - stats `<fs.Stats>`


```js
const fs = require("fs")
const path = require("path")

const filename =  path.resolve(__dirname,"./myfiles/1.jpg")

fs.stat(filename,(err,stats)=>{
    console.log(stats)
})


// 同步函数
const stats = fs.statSync(filename)
console.log(stats)
```


##### fs.promise.stat()
- 参数
    - path `<string> | <Buffer> | <URL>` 文件路径
    - options
        - bigint `<boolean>` 默认为false
- 返回
    - Promise `<Promise>` 成功后履行

```js
const fs = require("fs")
const path = require("path")

const filename =  path.resolve(__dirname,"./myfiles/1.jpg")

async function test() {
    const stat = await fs.promises.stat(filename)
    console.log(stat)
}
test()
```


#### 声明

> 剩下的一些api都统一采用promise的形式记录，基本上都是回调，promise，同步这三个函数


#### fs.promise.readdir()

> 获取目录中的文件和子目录

- 参数
    - path `<string> | <Buffer> | <URL>` 文件路径
    - options
        - encoding `<string>` 默认是utf-8
        - 使用文件类型 `<boolean>` 默认是false
        - 递归 `<boolean>` 如果，则以迭代方式读取目录的内容。在循环模式下，它将列出所有文件、子文件和目录，默认false
- 返回
    - Promise `<Promise>` 成功后履行


```js
const fs = require("fs")
const path = require("path")

const filename =  path.resolve(__dirname,"./myfiles/")

async function test() {
    // 可以通过开启递归的方式深度获取
    const pathes = await fs.promises.readdir(filename,{recursive:"true"})
    console.log(pathes)
    //[ '1.jpg', '1.txt', '2.jpg', 'sub', 'sub\\foo.txt' ]
}
test()
```

#### fs.promise.mkdir()

> 创建目录

- 参数
    - path `<string> | <Buffer> | <URL>` 文件路径
    - options
        - 递归 `<boolean>` 如果，则以迭代方式读取目录的内容。在循环模式下，它将列出所有文件、子文件和目录，默认false
        - mode `<string | <integer>` windwos不支持
- 返回
    - Promise `<Promise>` 成功后履行

```js
const fs = require("fs")
const path = require("path")

const filename =  path.resolve(__dirname,"./myfiles/test1/test2/test3")

async function test() {
    await fs.promises.mkdir(filename,{recursive:true})
    console.log("创建成功")
}
test()
```


#### fs.exists()

> 废弃，官方建议用fs.stat代替
> 判断文件或者目录是否存在
> 下面自己封装一个


```js
async function exists(filename) {
    try{
        await fs.promises.stat(filename)
        return true
    } catch (err) {
        if(err.code === "ENOENT"){
            // 文件不存在
            return false
        }
        throw err
    }
}

async function test() {
    const res = await exists(filename)
    if(res){
        console.log("目录存在,可以后续操作")
        // 后续的一些I/O
    }else{
        await fs.promise.mkdir(filename)
        console.log("目录自动创建,继续后续操作")
        // 后续的一些I/O
    }
}
test()
```

#### fs.promise.unlink

- 参数
    - path `<string> | <Buffer> | <URL>` 文件路径
- 返回值
    - Promise `<Promise>` 成功后履行

```js
const fs = require("fs")
const path = require("path")

const filename =  path.resolve(__dirname,"./myfiles/test1/test2/test3")

async function test(){
    await fs.promise.unlink(filename)
    console.log("删除成功")
}
```

#### 文件流

##### 文件流的相关概念

> [文件流的文档](https://nodejs.org/docs/latest/api/stream.html)

> 文件流就是数据从一个地方流向另一个地方，一般是数据流向内存，cpu操作数据，操作后的数据从内存流出

流是有方向的，在js中流分为如下几类：
- 可读流(Readable)：数据从源头流向内存
- 可写流(Writable)：数据从内存流向源头
- 双工流(Duplex)：数据即可从源头流向内存又可从内存流向源头


**为什么需要流？**
- reason
    1. 其他介质和内存的数据规模不一致(其实就是空间大小不一致)
        ![alt text](image-7.png)
    2. 其他介质俄内存的数据处理能力不一致
        ![alt text](image-8.png)


**什么是文件流？**

> 文件流指的就是内存数据和磁盘文件数据之间的流动


##### fs.createReadStream()

- 参数
    - path `<string> | <Buffer> | <URL>` 文件路径
    - options 
        - flags `<string>` 文件模式,默认是`r`
        - encoding `<string>` 编码方式，默认是null
        - fd `<integer> | <FileHandle>` 默认是null
        - mode `<integer>` 文件权限，默认是0o666
        - autoClose `<boolean>` 读完后自动关闭，默认是true
        - emitClose `<boolean>` 默认是true
        - start `<integer>` 起始字节
        - end `<integer>` 结束字节，  默认是Infinity
        - highWaterMark `<integer>` 每次读取的数量，默认是 64 * 1024，这个数值受编码的影响
        - fs `<Object> | <null>` 默认是null
        - signal `<AbortSignal> | <null>` 默认是null
- 返回值 
    - 返回文件可读流(ReadStream)


> 含义： 创建一个文件可读流，用于读取文件内容


```js
const fs = require("fs")
const path = require("path")

const filename =  path.resolve(__dirname,"./myfiles/1.txt")

const rs = fs.createReadStream(filename,{
    encoding: "utf-8",
    highWaterMark: 5
})
```

##### 可读流的相关操作
**ReadStream.on(事件名,处理函数)**

> 对于ReadStream有事件如下所示

- open 文件打开事件，文件被打开后除法

- error 出现错误以后触发

- close 文件被关闭触发，可以通过ReadStream.close()手动关闭或者文件读取完自动关闭

- data  读取到一部分数据后触发，注册data事件后才真正开始读取，每次读取highWaterMark指定的数量，回调函数中会附带读取到的数据

- end 全部数据读取完毕会触发


**ReadStream.pause()和resume()**

ReadStream.pause()是暂停读取的函数

- ReadStream.on("pause",()=>{})会在暂停读取后触发

ReadStream.resume()是恢复读取的函数

- ReadStream.on("resume",()=>{})会在暂停读取后触发

```js
rs.on("open",() => {
    console.log("文件被打开了")
})

rs.on("error",()=>{
    console.log("出错了")
})

rs.on("close",()=>{
    console.log("文件关闭了")
})

rs.on("data",chunk => {
    console.log("读取到一部分数据:",chunk)
    // 暂停读取
    rs.pause()
})

rs.on("pause",()=>{
    console.log("暂停了")
    setTimeout(() => {
        // 恢复读取
        rs.resume()
    },1000)
})

rs.on("resume",() => {
    console.log("恢复读取")
})

rs.on("end",() => {
    // 这个在close之前
    console.log("全部数据读取完毕")
})

// 手动关闭文件流
rs.close()
```

##### fs.createWriteStream()

- 参数
    - path `<string> | <Buffer> | <URL>` 文件路径
    - options 
        - flags `<string>` 文件模式,默认是`w`
        - encoding `<string>` 编码方式，默认是utf8
        - fd `<integer> | <FileHandle>` 默认是null
        - mode `<integer>` 文件权限，默认是0o666
        - autoClose `<boolean>` 写完后自动关闭，默认是true
        - emitClose `<boolean>` 默认是true
        - start `<integer>` 起始字节
        - highWaterMark `<integer>` 每次写入的数量，默认是 16384，这里和读取不同是准确的字节数
        - fs `<Object> | <null>` 默认是null
        - signal `<AbortSignal> | <null>` 默认是null
        - flush `<boolean>` 如果为真，则在关闭基础文件描述符之前刷新它,默认值是false
- 返回值 
    - 返回文件可写流(WriteStream)

```js
const fs = require("fs")
const path = require("path")

const filename =  path.resolve(__dirname,"./myfiles/1.txt")

// 创建写入流

const ws = fs.createWriteStream(filename,{
    flags: "a" // 追加写入
    encoding: "utf-8",
    highWaterMark: 3
})
```

##### 可写流的相关操作

**WriteStream.on(事件名,处理函数)**

- open  打开文件的时候触发
- error 报错的时候触发
- close 关闭文件的时候触发

**WriteStream.write(data)**

- 写入一组数据，data可以是字符串或者Buffer
- 返回一个boolean值
    - true：写入通道没有被填满，接下来的数据可以直接写入，无需排队
        ![alt text](image-9.png)
    - false：写入通道目前已被填满，接下来的数据将进入队列
        ![alt text](image-10.png)
        - 这里要注意背压问题，因为写入队列是内存中的数据，是有限的
        - 背压问题的解决方式：
            ```js
            const fs = require("fs")
            const path = require("path")

            const filename =  path.resolve(__dirname,"./myfiles/1.txt")

            // 创建写入流

            const ws = fs.createWriteStream(filename,{
                encoding: "utf-8",
                highWaterMark: 16*1024
            })


            let i = 0
            // 一致写，知道大奥上限，或无法再直接写入
            function write(){
                let flag = true
                while(i<1024*1024*10 && flag){
                    flag = ws.write("a")  // 写入a，得到下一次还能不能直接写
                    i++
                }
            }

            write()

            // 等队列清空继续调用write去写入
            ws.on("drain",()=>{
                write()
            })
            ```
- 当写入队列清空时，会触发drain事件

**WriteStream.end([data])**

- 结束写入，将自动关闭文件
    - 自动关闭取决于autoClose配置，默认为true
- data是可选的，表示关闭前的最后一次写入


##### ReadStream.pipe(WriteStream)(文件流demo)

> 复制文件

```js
const fs = require("fs")
const path = require("path")

// 方式1：把文件所有内存都放入到内存队列，内存占用高
async function method1() {
    const from = path.resolve(__dirname,"./myfiles/1.txt")
    const to = path.resolve(__dirname,"./myfiles/2.txt")
    console.time("方式1")
    const content = await fs.promises.readFile(from)
    await fs.promises.writeFile(to,content)
    console.timeEnd("方式1")
    console.log("复制完成")
}

// 方式2  不仅时间少了很多，占用内存空间也少了很多

async function method2() {
    const from = path.resolve(__dirname,"./myfiles/1.txt")
    const to = path.resolve(__dirname,"./myfiles/3.txt")
    console.time("方式2")
    const rs = fs.createReadStream(from)
    const ws = fs.createWriteStream(to)
    rs.on("data", chunk=>{
        // 都一部分数据
        const flag = ws.write(chunk)
        if(!flag){
            // 表示下一次会造成背压
            rs.pause() // 暂停读取
        }
    })

    ws.on("drain",()=>{
        // 表示可以继续写了
        rs.resume()
    })

    rs.on("close",()=>{
        // 写完了
        ws.end() //关闭写入流
        console.timeEnd("方式2")
        console.log("复制完成")
    }) 
}

method1()
method2()
```


> 其实上面的方式2已经有封装好的函数了就是读取流的`ReadStream.pipe(WriteStream)`

- 将可读流和可写流连接
- 返回参数值
- 该方法可以解决背压问题

```js
const fs = require("fs")
const path = require("path")

async function method3() {
    const from = path.resolve(__dirname,"./myfiles/1.txt")
    const to = path.resolve(__dirname,"./myfiles/4.txt")
    console.time("方式3")
    const rs = fs.createReadStream(from)
    const ws = fs.createWriteStream(to)
    
    rs.pipe(ws)

    rs.on("close",()=>{
        console.timeEnd("方式3")
    })
}
```

![alt text](image-11.png)

### net模块

> (net模块文档)[https://nodejs.org/docs/latest/api/net.html]

#### http请求

- 普通模式
![alt text](image-12.png)
- 长连接模式
![alt text](image-13.png)


#### net模块的作用

- net是一个通信模块
- 可以使用其实现进程间的通信IPC
- 可以实现网络通信TCP/IP  🚩

#### 创建客户端

> 在nodejs中主动去发送请求

##### net.createConnection(options[,connectListener])

- 参数
    - options `<obj>`
        - host `<string>` 要连接到的主机
        - port `<number>` 端口号
        - 剩下的配置详见：[配置](https://nodejs.org/docs/latest/api/net.html#socketconnectoptions-connectlistener)
    - connectListener `<Function>` 
- 返回值
    - 返回socket

对于**socket**有如下解释
- socket是一个特殊的文件
- 在node中表现为一个双工流对象
- 通过写入内容发送数据
- 通过监听流的内容获取数据
- socket.on("end",()=>{}) 关闭socket流会触发

![alt text](image-14.png)

```js
const net = require("net")

// 创建客户端
const socket = net.createConnection(
    {
        host: "ke.qq.com",
        port: 80
    },
    () => {
        console.log("连接成功")
    }
)

socket.write(`你好！`)

socket.on("data",chunk => {
    console.log("来自服务器的消息",chunk.toString("utf-8"))
    // 客户端挂断TCP连接
    socket.end()
})
```
![alt text](image-15.png)

```js
socket.write(`GET / HTTP/1.1
Host: tabox.mzmm403.top/
Connection: keep-alive

`)

// 报文书写的方式
`请求行
请求头

请求体`
```

**socket.end()因为流的队列问题会造成通道的拥堵，导致一次只能传固定长度的数据，因此可以通过Content-Length可以去判断当前流传输是否完成，具体代码如下**

```js
const net = require("net")

// 创建客户端
const socket = net.createConnection(
    {
        host: "ke.qq.com",
        port: 80
    },
    () => {
        console.log("连接成功")
    }
)

//
var receive = null

// 获取http报文请求将其制作成一个对象
function parseResponse(response) {
    const index = response.indexOf("\r\n\r\n")
    const head = response.sunbstring(0,index)
    const body = response.substring(index + 2)
    const headParts = head.split("\r\n")
    const headerArray = headParts.slice(1).map(str => {
        return str.split(":").map(s => s.trim())
    })
    const header = headerArray.reduce((a,b) => {
        a[b[0]] = b[1]
        return a
    },{})

    return {
        header,
        body: body.trimStart()
    }
}

// 判断是否接收完成
function isOver(){
    // 需要接收的消息体的总字节数
    const contentLength =+ receive.header["Content-Length"]
    // 当前已经接收的总字节数
    const curReceivedLength = Buffer.from(receive.body,"utf-8").byteLength
    // 返回比较结果
    return curReceivedLength > contentLength
}

socket.on("data",chunk => {
    const response = chunk.toString("utf-8")
    if(!receive){
        // 第一次接收
        parseResponse(response)
        // 看当前是否已经传输完成
        if (isOver()){
            socket.end()
        }
        return
    }

    receive.body += response
    if(isOver()){
        socket.end()
        return
    }

})


socket.write(`GET / HTTP/1.1
Host: tabox.mzmm403.top/
Connection: keep-alive
    
`)
```

#### 创建服务端
##### net.createServer()

- 参数
    - options `<obj>`
        - 剩下的配置详见：[配置](https://nodejs.org/docs/latest/api/net.html#socketconnectoptions-connectlistener)
    - connnectListener `<Function>` 回调函数
- 返回值
    - 返回server对象

对于**server**对象有如下解释

- server.listen(port)
- server.on("listening",()=>{})
- server.on("connection",socket=>{})

![alt text](image-16.png)

*建议在IE浏览器中尝试下面这段代码*
```js
const net = require("net")
const fs = require("fs")
const path = require("path")

// 创建一个服务端
const server = net.createServer()

// 服务器监听9527端口
server.listen(9527)

// 服务器触发了监听以后就会触发事件
server.on("listening",() => {
    console.log("server listen 9527")
})

// 客户端和服务端建立连接了
// 当某个连接到来时，触发该事件，事件监听函数会获得一个socket对象
server.on("connection", socket => {
    console.log("有客户端连接到服务器")

    socket.on("data", async chunk => {
        const filename = path.resolve(__dirname,"./myfiles/eh.jpg")
        const bodyBuffer = await fs.promises.readFile(filename)
        const headBuffer = Buffer.from(`HTTP/1.1 200 OK
Content-Type: image/jpeg        
        
`,
            "utf-8"
        )
        const result = Buffer.concat([headBuffer,bodyBuffer])
        socket.write(result)
        socket.end()
    })

    socket.on("end",()=>{
        console.log("连接关闭")
    })
})
```


### http模块

> [http的文档](https://nodejs.org/docs/latest/api/http.html#httprequesturl-options-callback)

- http模块建立在net模块上
    - 无需手动管理socket
    - 无需手动组装消息格式

- `http.request(url[,options][,callback])`
    - nodejs作为客户端发送消息
- `http.createServer([options][,requestListener])`
    - 使用nodejs搭建服务器



#### http.request()

- 参数
    - url `<string>` | `<URL>`
    - options `<obj>`
        - method `<string>` 表示请求的方法
        - headers `<obj>` 包含请求标头的对象
        - timeout `<number>` 超时的事件
        - [剩余参数](https://nodejs.org/docs/latest/api/http.html#httprequesturl-options-callback)
    - callback `<function>`
- 返回值
    - `<http.ClientRequest>` 返回一个客户端的请求对象


> 这个方法的作用是创建一个客户端



```js
const http = require("http")

// 创建一个客户端请求对象
const request = http.request(
    // url必填参数
    "http://tabox.mzmm403.top/#/",
    // 配置信息
    {
        method: "GET"
    },
    // 请求发送以后返回的respons的报文信息
    respon => {
        console.log("服务器的响应状态码是：" + respon.statusCode)
        console.log("返回的响应报文的头",respon.headers)

        // 获取服务器返回的信息，因为不知道多大，所以是按照流的形式一块一块读出来
        let result = ""
        // 获取每一块返回的信息，进行拼接
        respon.on("data",chunk => {
            result += chunk.toString("utf-8")
        })

        // 读取返回的流结束以后输出拼接的结果
        respon.on("end",() => {
            console.log(result)
            console.log("结束")
        })
    }
)

// 在request请求的时候，如果是post这种请求是需要消息体的，
// 因此上面的请求构建完以后会阻塞等待消息体的补全，也就是向流中写入要传递的信息
request.write()

// 这个代表了发送消息，如果是post就在上一步写入消息，
// 如果没有就直接用end表示已经结束写入消息，发送出消息
request.end()
```


#### http.createServer()

- 参数
    - options `<obj>`
        - requestTimeout `<number>` 设置从客户端接收整个请求的超时值(以ms为单位)，默认值300000
        - keepAliveTimeout `<number>` 在完成一个写入后，在套接字销毁之前，服务器需要额外等待传入数据的不活动毫秒数，默认值为5000
        - [剩余参数](https://nodejs.org/docs/latest/api/http.html#httpcreateserveroptions-requestlistener)
- 返回值
    - `<http.Server>` 返回一个服务端对象

```js
const http = require("http")
const url = require("url")

const getReqInfo = (req) => {
    console.log("有请求来了")
    // 获取请求的路径
    console.log("请求的路径：" + url.parse(req.url))
    console.log("请求头：" + req.headers)
    console.log("请求方法：" + req.method)

    // 客户你请求的信息
    let body = ""
    req.on("data", chunk => {
        body += chunk.toString("utf-8")
    })

    req.on("end", () => {
        console.log("请求体", body)
    })
}

const server = http.createServer((req, res) => {
    getReqInfo(req)
    // 设置返回报文的请求投
    res.setHeader("a", "1")
    // 设置状态码
    res.stateCode = 404
    // 写入返回报文的信息
    res.write("你好!", "utf-8")
    // 结束信息的书写
    res.end()
})


server.listen(9527)


server.on("listening", () => {
    console.log("server listen 9527")
})
```



#### 静态资源服务器demo

```js
// 静态资源服务器

// http://localhost:9527/index.html -> pubilc/index.html 文件内容
// http://localhost:9527/index.css -> pubilc/index.css 文件内容


const http = require("http")
const url = require("url")
const path = require("path")
const fs = require("fs")


// 验证文件路径是否存在
async function getSata(filename) {
    try {
        return await fs.promises.stat(filename)
    } catch {
        return null
    }
}


// 根据url获取到文件信息
const getFileInfo = async (fileurl) => {
    const urlObj = url.parse(fileurl)
    let filepath = path.resolve(__dirname, "public", urlObj.pathname.substr(1))
    const stat = await getSata(filepath)
    if (!stat) {
        // 文件不存在的情况
        return null
    } else if (stat.isDirectory()) {
        // 文件是一个目录的情况
        filepath1 = path.resolve(__dirname, "public", urlObj.pathname.substr(1), "index.html")
        const adstat = await getSata(filepath1)
        if (!adstat) {
            // 文件不存在
            return null
        } else {
            // 文件存在
            return await fs.promises.readFile(filepath1)
        }
    } else {
        return await fs.promises.readFile(filepath)
    }
}

// 服务器的逻辑处理函数
const handler = async (req, res) => {
    const info = await getFileInfo(req.url)
    if (info) {
        res.write(info)
    } else {
        res.statusCode = 404
        res.write("访问资源不存在")
    }
    res.end()
}

// 创建服务器
const server = http.createServer((req, res) => {
    handler(req, res)
})

server.on("listening", () => {
    console.log("server listen 6000")
})

server.listen(6000)
```

### https模块

- 服务器结构

![alt text](image-17.png)

- 证书准备

```bash
# 生成CA私钥
# genrsa: 密钥对生成算法
# -des3 使用对称加密算法des3对私钥进一步加密
# -out ca-pri-key.pem: 将加密后的私钥保存到当前目录的ca-pri-key.pem文件中
# 1024: 私钥的字节数

openssl genrsa -des3 -out ca-pri-key.pem 1024


# 生成CA公钥
#通过私钥文件ca-pri-key.pem中的内容，生成对应的公钥，保存到ca-pub-key.pem中
#运行过程中要使用之前输入的密码来实现对私钥文件的解密
openssl req -new -key ca-pri-key.pem -out ca-pub-key.pem

# 生成ca根证书
# 使用x.509证书标准，通过证书请求文件ca-pub-key.pem生成证书，并使用私钥ca-pri-key.pem加密，然后把证书保存到ca-cert.crt文件中
openssl x509 -req -in ca-pub-key.pem -signkey ca-pri-key.pem -out ca-cert.crt


# 生成服务器私钥
openssl genrsa -out server-key.pem 1024
# 生成服务器公钥
openssl req -new -key server-key.pem -out server- scr.pem
# 生成服务器的证书
openssl x509 -req -CA ca-cert.crt -CAkey ca-pri-key.pem -CAcreateserial -in server-scr.pem -out server-cert.crt
```

- https模块

```js
const https = require("https")
const fs = require("fs")
const path = require("path")

const server = https.createServer(
    {
        key: fs.readFileSync(path.resolve(__dirname,"./server-key.pem")), // 私钥
        cert: fs.readFileSync(path.resolve(__dirname,"./server-cert.crt"))
    },
    (req,res) => {
        // 具体的逻辑
    } 
)

server.listen(443)

server.on("listening",()=>{
    console.log("server listen 443")
})
```

### node生命周期

![alt text](image-18.png)

> 这里着重关注timers/poll/check三个阶段
> 我们这里可以把每个阶段看作一个宏任务队列，清空队列就可以进入下一个阶段
> 是c++的libvu实现的

- timers(其实就是循环检查计时器事件到没到，到了直接调用回调函数)
    - 存放计时器的回调函数，也就是setTimeout和setInterval的回调
- poll
    - 轮询队列
    - 除了timers和checks，绝大部分回调都会放到该队列，比如文件读取或者用户请求
    - 运作方式
        - 如果poll中有回调，一次执行回调直倒清空队列
        - 如果poll没有回调
            - 等待其他队列中出现回调，结束该阶段，进入下一阶段
            - 如果其他队列也没有回调，持续等待，知道出现回调为止
- check(整个和timers不同，只要调用就直接把回调函数放到队列里面执行)
    - 检查阶段
    - 使用setImmediate的回调会直接进入整个队列


> 微任务队列：nextTick/Promise
> 优先级：nextTick > Promise
> 每次在执行回调函数的时候都会清空微队列


### EventEmitter(拓展)

> nodejs事件管理的通用机制
> 原理就是维护了一个队列(函数的数组)

```js
const {EventEmitter} = require("events")

// 创建一个事件处理对象
// 可以注册事件，可以触发事件

const ee = new EventEmitter()

ee.on("abc",()=>{
    console.log("abc触发了事件1")
})
const fn2 = ()=>{
    console.log("abc触发了事件2")
}
ee.on("abc",fn2)
ee.on("abc",()=>{
    console.log("abc触发了事件3")
})
// once只触发一次
ee.once("abc",()=>{
    console.log("abc触发了事件4,该事件只触发一次")
})

ee.on("bcd",(a,b)=>{
    console.log("参数是",a,b)
})

// 触发名为abc的事件

ee.emit("abc")
// 移除事件
ee.off("abc",fn2)
ee.emit("abc")
ee.emit("abc")
ee.emit("abc")
ee.emit("bcd",1,2)
```


## nodejs的数据库(mysql)

### 数据库的简介

- 数据库的作用
    - 持久的存储数据
    - 备份和恢复数据
    - 快速的存储数据
    - 权限控制
- 数据库的类型
    - 关系型数据库
        - 特点：表和表关联构成的数据结构
        - 优点
            1. 能表达复杂的数据关系
            2. 强大的查询语言，能精确的查找到想要的数据
        - 缺点
            1. 读写性能差，由器是海量数据的读写
            2. 数据结构死板
        - 用途： 存储结构复杂的数据库,业务数据

    - 非关系型数据库
        - 特点： 存储的数据结构简单，例如：
            - 文档型：相当于一篇文章
            - 键值对：`key:value`
        - 优点
            1. 格式灵活
            2. 海量数据读写效率高
        - 缺点
            1. 难以表示复杂的数据结构
            2. 对于复杂查询效率不好
        - 用途：存储数据简单的数据(访问记录和用户偏好等)
    - 面向对象数据库
- 相关术语
    - DB：数据库
    - DBA：数据库管理员
    - DBMS：数据管理系统
    - DBS： 数据库系统 (包含了DB/DBA/DBMS)

### 数据库的安装和使用

> [安装mysql8](https://dev.mysql.com/downloads/mysql/)
> [navicat](https://www.navicat.com.cn/products) `pdd`

- mysql相关的简单命令

```bash
# 登录数据库
mysql -uroot -p
# 产看当前的数据库字符编码
# 可以在my,ini文件中修改字符编码
show variables like 'character\_set\_%'
# 重启服务
service mysql restart
# 查看当前拥有的数据库
show databases
```

### 数据库的设计

#### SQL

- 结构化查询语言,它属于是声明式语言
- 大部分关系型数据库都支持SQL
- 分支
    - DDL
        - 数据定义语言
        - 操作数据库对象
            - 库
            - 表
            - 视图
            - 存储过程
    - DML
        - 数据操作语言
        - 操作数据库中的记录(增删改查)
    - DCL
        - 数据控制语言
        - 控制用户权限

#### 管理库

```bash
# 创建数据库
create database mydb
# 查看数据库
show databases
# 切换数据库
use mydb
# 删除数据库
drop database mydb
```

#### 管理表

**创建表一般是对列进行创建，也就是创建字段**
- 字段名
- 字段类型(常见)
    - bit：占1位，0或1，false或true
    - int：占32位，整数
    - decimal(M,N)：能精确计算的实数，M是总的数字位数，N是小数位数(例如3.14159,这时的M是6，N是5)
    - char(n)：固定长度位n的字符
    - varchar(n)：长度可变，最大长度位n的字符
    - text：大量的字符串
    - date：仅日期
    - datetime：日期和时间
    - time：仅时间
- 是否是必填(not null不能为空)
- 是否自增
- 默认值


```sql
-- 创建表
create table mydatabase.mytable(
    -- auto_increment是自增,自增必须是主键
    id int not null auto_increment,
    primary key(id)
    name varchar(20) not null,
    birthday date not null,
    sex bit not null default 1
)
-- 修改表 修改操作太多了，就不写了
-- 删除表
drop table mydatabase.mytable
```

#### 主键和外键

- 主键
    - 根据设计原则，每张表都应该有一个主键
    - 主键必须满足的要求
        - 唯一
        - 不能更改
        - 无业务含义
    - 主键不一定是自增的数字，也可以是uuid(很长的一段字符串)
- 外键
    - 用于产生表关系的列
    - 外键列会连接到另一张表(或自己)的主键
    ```sql
    -- 一个学生表和一个班级表
    -- 学生表里面的外键叫classid，连接到班级表的主键id上
    add foreign key(classid) references test.class(id)
    ```

#### 关系表
- 一对一
    - 一个A对应一个B,一个B对应一个A
    - 例如：学生和学生证
    - 把任意一张表的主键同时设置为外键
- 一对多
    - 一个A对应多个B,一个B对应一个A，A和B是一对多，B和A是多对一
    - 例如：班级和学生
    - 在多一端上设置外键，对应到另一张表的主键上
- 多对多
    - 一个A对应多个B，一个B对应多个A
    - 例如：学生和课程
    - 需要建立一张关系表，关系表至少包含两个外键，分别对应两张表

#### 三大设计范式

1. 要求数据库的每一列是不可分割 的原子数据项
2. 非主键列必须依赖于主键列
3. 非主键列必须直接依赖于主键列


### 表记录的增删改查

#### 增删改

> DML 数据操作语言

```sql
-- 增加语句
insert into student(name,age,sex,classid) values("张三",18,1,1);
-- 如果想要使用默认值直接default(不写也是默认值)
insert into student(name,age,sex,classid) values("张三",18,default,1);
-- 一次插入多条数据
insert into student(name,age,sex,classid) 
values
("张三",18,default,1)
("李四",19,default,2);

-- 修改语句
update student set name="王五" where id=1;

-- 删除语句
delete from student where name="王五";
```

#### 单表基本查询

- select：就是查询
    - *：查询全部
    - 别名：as，可以用as关键字去命名
    - case：对某一列的数据进行进一步处理
    - distinct：去重
- from：从哪张表查询
- where：查询条件
    - `=` 相等
    - in 在里面
    - is 是否是
    - is not 是否不是
    - `> < >= <=` 比较运算
    - between 在某个范围内
    - like 模糊查询
    - and 和
    - or 或
- order by：排序
    - asc 升序
    - desc 降序
- limit：分页
    - n,m 从第n条开始，取m条数据

- 运行顺序
    1. from
    2. where
    3. select
    4. order by
    5. limit



```sql
-- case和别名的用法
select id, name as studentname case sex
when 1 then "男" 
when 0 then "女"
else "未知"
end
from student;
-- 或者
select id, name as studentname case 
when sex=1 then "男" 
when sex=0 then "女"
else "未知"
end
from student;

-- distinct的用法,一般只查一列，对某列去重,也可以放到最前面对多列数值去重
select distinct classId from student;

-- where的用法
select * from student where classId in (1,2);
select * from student where localtion is null;
select * from student where salary >= 100000 and salary <= 200000;
select * from student where between 100000 and 200000;
-- 模糊查询，%为任意字符
select * from student where name like "李%";
-- 下划线为一个字符
select * from student where name like "李_";

-- order by的用法
-- 先按照salary降序排序，如果salary相同再按照sex升序排序
select * from student order by salary desc sex asc;
```

#### 联表查询

- 笛卡尔积
    - 两张表的数量相乘
    ```sql
    -- 后面是两个表
    select * from student,class;
    -- 实际案例，足球比赛分为主客场
    select t1.name as 主队,t2.name as 客队 from team t1,team t2;
    ```

- 左连接，左外连接，left join
- 右连接，右外连接，right join
    - 以其中一张表为基准连接另一张表，每次连接的时候判断条件是否满足
    - 左连接如果找不到就显示左边的表一次，右连接如果找不到就显示右边的表一次
    ```sql
    -- 左连接
    -- 这个执行顺序其实就是从左边表中取出数据和右边表进行匹配，满足条件的就显示，不满足条件的就不显示
    select * from student left join class on student.classId = class.id;

    -- 右连接
    -- 这个执行顺序其实就是从右边表中取出数据和左边表进行匹配，满足条件的就显示，不满足条件的就不显示
    select * from student right join class on student.classId = class.id;
    ```

- 内连接，inner join
    - 和左右连接不同的是内连接只显示满足条件的
    ```sql
    -- 内连接
    select * from student inner join class on student.classId = class.id;
    ```

#### 函数和分组

##### 函数

- 内置函数
    - 数学
        - `abs(x)` 绝对值
        - `ceil(x)` 向上取整，返回大于x的最小整数
        - `floor(x)` 向下取整，返回小于x的最大整数
        - `mod(x,y)` 返回x/y的余数
        - `PI()` 返回圆周率
        - `rand()` 返回0-1之间的随机数
        - `round(x,y)` 对x进行四舍五入，y是保留的小数位数
        - `truncate(x,y)` 对x进行截取，y是保留的小数位数
    - 聚合(不能和其他列一起使用)
        - `avg(col)` 返回指定列的平均值
        - `count(col)` 返回指定列种非null值得个数
        - `max(col)` 返回指定列的最大值
        - `min(col)` 返回指定列的最小值
        - `sum(col)` 返回指定列的所有值得和
    - 字符
        - `concat(str1,str2,...strn)` 将str1,str2,...strn连接成一个字符串
        - `concat_ws(separator,str1,str2,...strn)` 用separator作为分隔符将str1,str2,...strn连接成一个字符串
        - `trim(str)` 去除字符串两端的所有空格
        - `ltrim(str)` 从字符串str中切点开头的空格
        - `rtrim(str)` 返回字符串str结尾的空格

    - 日期
        - `curdate()`或者`current_date` 返回当前日期
        - `curtime()`或者`current_time` 返回当前时间
        - `timestampdiff(part,date1,date2))` 返回date1和date2之间的差值，part是时间单位，date1和date2是日期,part可以写如下的单位
            - microsecond
            - second
            - minute
            - hour
            - day
            - week
            - month
            - quarter
            - year
- 自定义函数


##### 分组

mysql的运行顺序： from -> join...on... -> where -> group by -> select -> having -> order by -> limit(其中having和select在其他数据库中可能顺序不一样)


```sql
-- 分组
-- 查询住在每个地址的学生人数
-- 可以多个字段分组
-- 选分组后筛选，筛选要用having
select addr,sex count(id) as 学生人数 from student group by addr,sex having 学生人数>10;
```

### 视图

> 本质上就是根据查询缓存的结果生成一张表


```sql
-- 创建视图
-- 视图的名字是v_student
-- 视图的内容是根据查询缓存的结果生成一张表
-- 这样可以减少查询的次数，提高查询效率
create view v_student as select id,name,addr from student;
```

## nodejs的数据驱动和ORM

### mysql驱动程序

#### 驱动程序
- 驱动程序是连接内存和其他存储介质的桥梁
- mysql驱动程序是连接内存数据和mysql数据的桥梁
- mysql驱动程序通常使用
    - mysql
    - mysql2(mysql-native)

- mysql2: [mysql2的使用](https://sidorares.github.io/node-mysql2/zh-CN/docs)


#### 简单的增删改查

- 回调函数的方式
```js
// 导入模块
const mysql = require('mysql2');

// 创建一个数据库连接
const connection = mysql.createConnection({
host: 'localhost',
user: 'root',
password: '123456',
database: 'test',
});

// 简单查询
connection.query(
'SELECT * FROM `user` WHERE `id` = 1',
function (err, results, fields) {
    console.log(results); // 结果集
    console.log(fields); // 额外的元数据（如果有的话）
}
);

// 简单插入
connection.query(
'INSERT INTO `user` (`username`, `password`) VALUES (?,?)',

['mzmm', 123456],
function (err, results) {
    console.log(results);
}
);

// 简单的删除
connection.query(
'DELETE FROM `user` WHERE `username` = ?',
['mzmm'],
function (err, results) {
    console.log(results);
}
);

// 简单的更新
connection.query(
'UPDATE `user` SET `password` =? WHERE `username` = ?',
[12345678,'test'],
function (err, results) {
    console.log(results);
}
);
```

- promise的方式

```js
const mysql = require('mysql2/promise')

async function main() {

// 创建数据库连接
const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'test'
})

// 执行增删改查语句
const [rows, fields] = await connection.query('SELECT * FROM user where username = ?', ['test'])

// 输出结果
console.log(rows)
// 输出表结构
console.log(fields)
// 关闭数据库连接
connection.end()
}

main()
```

- 但是这里得注意，如果直接写sql语句，容易出现sql注入的安全问题，因此我们要使用参数化查询，防止sql注入，而不是使用字符串拼接。


```js
const mysql = require('mysql2/promise')

async function main(username) {

    // 创建数据库连接
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'test'
    })
    // 或者可以这样写,也是推荐写法
    const sql =  'SELECT * FROM user where username = ?'
    const [rows,fields] = await connection.execute(sql, [username])
    // 这里注意一下模糊有查询的写的
    const sql = "SELECT * FROM user where username like concat('%',?,'%')"

    // 输出结果
    console.log(rows)
    // 输出表结构
    console.log(fields)
    // 关闭数据库连接
    connection.end()
}
```

#### 连接池

> 在使用上述连接过程中，如果用户访问过度且还不关闭连接`connection.end()`，就会造成大量的服务器资源的浪费，因此，我们推荐使用连接池，其实它相当于一个数组，规定了几个人可以来连接，如果连接池满了，那么就等待，直到连接池有空闲位置。同时连接池会自动管理连接，当连接池中的连接使用完毕后，会自动关闭连接，释放资源。

```js
// 导入mysql2
const mysql = require('mysql2/promise')

// 创建连接池
const pool = mysql.createPool({
    // 数据库地址
    host: 'localhost',
    // 数据库账号名
    user: 'root',
    password: '123456',
    // 数据库名
    database: 'test',
    // 如果连接池满了是否等待
    waitForConnections: true,
    // 连接池最大连接数
    connectionLimit: 10,
    // 连接池最大等待数,0表示不限制
    queueLimit: 0
})
```



### ORM框架

> 首先什么是orm，orm就是对象关系映射，通过orm可以自动吧程序中的对象和数据库关联，orm会隐藏具体数据库底层的细节，让开发者使用同样的数据操作接口，完成对不同数据库的操作

下面是orm原理图

ORM提供的API接口无须使用sql语句，它会根据具体的调用方式，自动生成最合适的sq语句操作数据

- orm的优势
    - 开发者不需要关心数据库，仅需要关心对象
    - 可以轻易的完成数据库的迁移
    - 无需拼接复杂的语句即可完成精确的查询

![alt text](image-19.png)

[Sequelize原文档](https://sequelize.org/docs/v6/getting-started/)
[Sequelize中文文档](https://www.sequelize.cn/core-concepts/assocs)

#### 安装和入门

##### 安装

```bash
# 安装orm框架本体
npm install --save sequelize
# 安装相应的数据库驱动
# 选择以下之一:
npm install --save pg pg-hstore 
npm install --save mysql2
npm install --save mariadb
npm install --save sqlite3
npm install --save tedious 
npm install --save oracledb
```

##### 连接到数据库
- 数据库的配置文件，dbConfig.json
```json
{
    "databaseName": "myschooldb",
    "username":"root",
    "password":"123456",
    "host":"localhost",
    "dialect":"mysql"
}
```

- 数据库建立连接池的文件,db.js
```js
// 首先导入sequelize
const Sequelize = require('sequelize');

// 新建一个sequelize实例
// 通常习惯读取json配置文件读取
const config = require('../config/dbConfig.json');
// 新建一个sequelize实例
const sequelize = new Sequelize(config.databaseName, config.username, config.password, {
    host: config.host,
    dialect: config.dialect
})

// 导出数据库连接池
module.exports = sequelize;
```

- index.js文件
```js
// 用来测试连接
const sequelize = require('./model/db');
// 测试连接
(async function () {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})()
```

#### 模型定义和同步




