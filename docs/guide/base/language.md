# 多语言

| H5 | 安卓 | 苹果 | 鸿蒙 | 微信小程序 | 其它小程序 |
| :---: | :---: | :---: | :---: | :---: | :---: |
| √ | √ | √ | √ | √ | - |

多语言切换功能依赖`FC.Store`模块。

## 使用方法

1. 终端执行以下命令安装`vue-i18n`插件：
```bash
npm install vue-i18n@9.14.5
```

2. 终端执行以下命令安装多语言模块：
```bash
fcuni c locale
```

3. 以`中文简体`和`英文`为例，在`src/modules/locale`目录下，创建`zh-Hans.json`和`en.json`文件。例如：
```json:line-numbers
{
    "hello": "你好",
    "world": "世界"
}
```
```json:line-numbers
{
    "hello": "Hello",
    "world": "World"
}
```

4. 在`src/modules/locale/index.ts`文件中，引入多语言模块。例如：
```ts:line-numbers
import en from './en.json'			//英文
import zhHans from './zh-Hans.json'	//中文简体

export const localMessages = {
    'en': en,
    'zh-Hans': zhHans
}
```

5. 在`src/main.ts`文件中，引入多语言模块。例如：
```ts:line-numbers
...
import { localMessages } from '@/modules/locale'

export function createApp() {
    const app = createSSRApp(App);
    app.use(FC.Store.pinia)
    app.use(FC.i18n.init(localMessages))    //初始化多语言模块
    return {
        app,
    };
}
```

6. 在`src/App.vue`中初始化
```vue:line-numbers {4}
...
onLaunch(() => {
    console.log("App Launch");
    FC.Store.initLocale()   //默认是中文简体
    ...
});
...
```

7. 在`vue`文件中，使用如下：
```vue:line-numbers
<template>
    <view>
        <text>{{ $t('hello') }}</text>
        <text>{{ $t('world') }}</text>
    </view>
</template>
```

8. 切换多语言如下：
```ts:line-numbers
...
const globalState = FC.useSysGlobalStore()

globalState.language = 'zh-Hans' //切换到中文简体
globalState.language = 'en' //切换到英文
```

## 移除模块

终端执行
```bash
fcuni d locale
```
```bash
npm uninstall vue-i18n
```
并移除相关代码