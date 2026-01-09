<!--
 * @Author: mzmm403
 * @description: Where there is a will there is a way
-->

# 第三方登录(微信)

## 准备工作

1. 注册开放平台账号

[微信开放平台](https://open.weixin.qq.com/)
[微博开放平台](https://open.weibo.com/)
[qq 开发平台](https://q.qq.com/#/)

2. 申请接入(创建应用)
3. 填写公司的信息
4. 填写应用地址，这个地址(域名)必须与项目部署的域名保持一致(配置回调域)
5. 得到`AppID`和`AppSecret`

详细的相关文章：
[第三方登录](https://www.qsqhome.com/#/shareReport)


## 代码示例

> 以前端的electron项目为示例，有如下代码

1. 在页面上挂载一个微信登录按钮


`renderer/src/views/Login.vue`
```vue
<template>
    <el-button type="success" circle size="large" @click="wxLogin">
        <el-icon size="large">
            <ChatDotRound />
        </el-icon>
    </el-button>
</template>

<script setup>
const wxLogin = () => {

    // 向主进程通信
    window.electron.ipcRender.invoke('readererToMain',{
        name: 'wx',
        event: 'event',
        data: null
    })


    // 获取达到主进程发来的微信授权码
    window.electron.ipcRender.once('main-to-render', async (e,data) => {
        // data => 微信授权码code
        let res = await Login({
            code: data.data
        })
    })
}
</script>
```
`main/index.js`

```js
import EventRouter from ./EventRouter
import { BrowserWindow } from 'electron'

const eventRouter = new EventRouter()
eventRouter.addApi('BrowserWindow',BrowserWindow)
eventRouter.addRoutes(routers)
```


`main/router/router.template.js`

```js
import EventRoute from "./EventRoute"

const routers = new Array()
const path = require('path')



// 微信登录
// 微信绑定
routers.push(
    new EventRoute('wx','event',(api, data = {}) => {

        let token = data.data?.token

        const wxWindow = new api.BrowserWindow({
            width: 900,
            height: 670,
            show: false,
            parent: api.window
            autoHideMenuBar: true,
            ...(process.platform === 'linux' ? { icon } : {}),
            webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
            }
        })

        wxWindow.on('ready-to-show', () => {
            wxWindow.show()
        })

        // 打开微信提供的页面 => 地址由后端给前端提供
        // 这里实际上的逻辑是前端请求这个api，后端和微接口交互最后返回二维码页面
        wnWindow.loadURL('http://www.xxx.com/aa/bb')

        // 用户扫码成功其实就是进行页面跳转
        // 监听url发生变化然后触发方法
        wxWindow.webContents.on('will-navigate',(e)=>{
            const webContents = wxWindow.webContents
            const filter = {url: ['*://www.xxx.cn/aa/*']}

            webContents.session.webRequest.onBeforeSendHeaders(filter,(details,callback) => {
                details.url = details.url.replace("www.xxx.cn","www.xxx.cn:8888")
                details.requestHeaders['WechatOauthType'] = 'login'
                if(token){
                    details.requestHeaders['WechatOauthType'] = 'bind'
                    details.requestHeaders['Authorization'] = token
                }
                callback({requestHeaders: details.requestHeaders})
            })

            weContents.session.webRequest.onCompleted(filter, (details) => {
                const params = new URLSearchParams(new URL(details.url).search)
                const code = params.get("code")

                if(token){
                    api.window.webContents.send('main-to-render', {
                        name: 'wx-bind',
                        event: 'event',
                        data: code
                    })
                } else {
                    api.window.webContents.send('main-to-render', {
                        name: 'wx-login',
                        event: 'event',
                        data: code
                    })
                }

                wxWindow.close()
                wxWindow.destroy()
            })

        })
    })
)

export default routers
```
**filter在这里是为了区分要拦截哪些地址，类似于黑名单，在这个黑名单里面就要拦截**

对于整个微信登录和绑定的流程如下

1. 在渲染进程上挂载微信的登录按钮
2. 点击按钮向主进程通讯，要主进程打开一个新的窗口
3. 主进程请求后端api，后端返回从微信哪里获取到的二维码页面
4. 用户进行扫码并获取到是否授权的页面
5. 此时用户点击授权按钮，`will-navigate`捕获到url发生变化
6. `onBeforeSendHeaders`在这个授权请求发出去之前修改请求头用来区分「微信登录」还是「微信绑定」
7. 请求发送完后在`onCompleted`中拿到回调url，并且在url中解析出微信授权码`code`
8. 根据token是否存在，向渲染线程发送不同的任务（登录 / 绑定）
9. 渲染进程接收到对用的任务类型和参数调用对应的后端接口进行业务请求