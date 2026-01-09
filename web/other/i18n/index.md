# 国际化

## 安装

```shell
pnpm i vue-i18n
```

## 使用

> tips: 国际化的原理很简单，就是在全局对象上挂载`i18n`对象，我们通过改变`i18n`对象下`locale`属性去加载我们预先定义好的语言包,通过`localStorage`把`locale`值存下来进行持久化

1. 准备好语言包`src/locales/lang/zh-cn.ts`,这里以中文为例

```ts
export default {
    login: {
        name: 'mzmm03',
        slogan: '简单的基础权限框架系统',
        describe: '基于Electron + Vue3 + Pinia + Element-Plus 搭建的中后台管理系统模板',
        signInTitile: '用户登录',
        accountLogin: '账号登录',
        mobileLogin: '手机号登录',
        rememberMe: '记住密码',
        signIn: '登 录',
        signTrueInfoError: '请输入正确信息',
        signInOther: '其他登录方式',
        userPlaceholder: '用户名',
        userError: '请输入用户名',
        PWPlaceholder: '请输入密码',
        PWError: '请输入密码',
        admin: '管理员',
        user: '用户',
        mobilePlaceholder: '手机号码',
        mobileError: '请输入手机号码',
        mobileTrueError: '请输入正确的手机号码',
        CaptchaPlaceholder: '请输入验证码',
        smsPlaceholder: '短信验证码',
        smsError: '请输入短信验证码',
        smsGet: '获取验证码',
        smsSend: '已发送短信至手机',
        losePWD: '忘记密码？',
        noAccount: '还没有账号？',
        createAccount: '创建新账号',
        wechatLoginTitle: '二维码登录',
        wechatLoginMsg: '请使用微信扫描二维码登录 | 模拟3秒后自动扫描',
        wechatLoginResult: '已扫描 | 请在设备中点击授权登录'
    },
    user: {
        dynamic: '近期动态',
        info: '个人信息',
        settings: '设置',
        nightmode: '黑夜模式',
        nightmode_msg: '适合光线较弱的环境下使用，当前黑暗模式为beta版本',
        language: '语言',
        language_msg: '翻译进行中, 暂翻译了本视图的文本'
    }
}
```



2. src目录下新建文件夹`src/locales/index.ts`

```ts
import { createI18n } from "vue-i18n";

// 自己的包
import zh from './lang/zh-cn'
import en from './lang/en'

// lement-plus语言包
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import English from "element-plus/dist/locale/en.mjs";

const messages = {
    'zh-cn': {
        el: zhCn,
        ...zh
    },
    'en': {
        el: English,
        ...en
    }
}

const i18n = createI18n({
    locale: localStorage.getItem('lang') || 'zh-cn', // 初始化语言配置
    messages
})

export default i18n
```


3. 在`src/main.ts`中使用

```ts
import { createApp } from 'vue'
import App from './App.vue'
// 国际化
import i18n from './locales'
const app = createApp(App)
app.use(i18n)


app.mount('#app')
```


4. 定义好切换按钮逻辑

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t,locale } = useI18n();
const config = reactive({
    LANG:[
        {
            name: '简体中文',
            value: 'zh-cn'
        },
        {
            name: 'English',
            value: 'en'
        }
    ]
})
const langConfig = ( item: {
    name: string;
    value: string;
}) => {
    locale.value = item.value;

    localStorage.setItem('lang', item.value);
}
</script>


<template>
    <el-dropdown trigger="click" @command="langConfig">
        <el-button circle class="langIcon">
            <svg class="svgLang" t="1767786861529" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4917" width="1em" height="1em"><path d="M891.2 948.8l-33.6-96H699.2l-33.6 96H564.8l153.6-403.2h115.2l153.6 403.2h-96zM780.8 632l-57.6 148.8h115.2L780.8 632zM526.4 780.8L569.6 680c-14.4-9.6-28.8-19.2-38.4-28.8 72-81.6 129.6-182.4 172.8-302.4h129.6v-96H468.8l72-24c-9.6-33.6-33.6-86.4-57.6-129.6l-105.6 33.6c19.2 38.4 38.4 86.4 48 120H70.4v96h134.4c43.2 120 105.6 220.8 177.6 302.4C296 718.4 185.6 766.4 56 800c19.2 24 48 72 62.4 96 134.4-38.4 249.6-96 340.8-172.8 19.2 19.2 43.2 38.4 67.2 57.6z m-220.8-432h288C560 440 512 516.8 454.4 584 392 516.8 339.2 440 305.6 348.8z" p-id="4918" fill="currentColor"></path></svg>
        </el-button>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item
                    v-for="item in config.LANG"
                    :key="item.value"
                    :command="item"
                >{{ item.name }}</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>
```

5. 在页面中使用(三种情况)

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const validatorSms = (_,value: string,callback: any) => {
    if( !value ){
        // 在ts逻辑代码中使用
        callback(new Error(t('login.smsError')));
    }else {
        callback();
    }
}
</script>

<template>
    <!-- 直接在标签中使用 -->
    <h4>{{ t( 'login.slogan') }}</h4>

    <!-- 在属性中绑定使用 -->
    <el-tab-pane :label="t('login.accountLogin')" lazy>
        <div style="height: 300px">
            <loginForm/>
        </div>
    </el-tab-pane>
</template>
```