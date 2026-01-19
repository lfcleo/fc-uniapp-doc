# 路由跳转和拦截

| H5 | 安卓 | 苹果 | 鸿蒙 | 微信小程序 | 其它小程序 |
| :---: | :---: | :---: | :---: | :---: | :---: |
| √ | √ | √ | √ | √ | - |

FC-Uniapp 已经集成了路由跳转和拦截功能。
路由跳转可以很方便的传递参数
路由拦截，则可以设置白名单、拦截条件和跳转页面。

## 路由拦截

`src/modules/router/index.ts`中可以自定义设置白名单、拦截条件和跳转页面。

### 白名单

白名单是指不需要拦截的路由路径。
可以在`src/modules/router/index.ts`的`config`中设置白名单。例如把登录页加入白名单。
```ts:line-numbers
...
    whiteList: [
        "/pages/test/index",
    ],
...
```
### 拦截条件

拦截条件是指满足某个条件时才会拦截路由跳转。
可以在`src/modules/router/index.ts`的`config`中设置拦截条件。例如当用户未登录时，返回true。
```ts:line-numbers
import { userUserStore } from "@/modules/stores/user"   //注意这里需要创建userUserStore这个store
...
    shouldInterceptRoute(): boolean {
        return userUserStore().id == 0
    },
...
```

### 跳转页面

可以在`src/modules/router/index.ts`的`config`中设置跳转页面。例如跳转到登录页。
```ts:line-numbers
...
    redirectToLoginPage(): void {
        uni.navigateTo({ url: "/pages/login/index" })
    },
...
```

## 路由跳转

以`/pages/test/index.vue`页面为例, 展示无参数跳转和有参数跳转。

::: warning 注意
要在路由拦截中判断是否需要拦截路由`/pages/test/index`。
:::

1. 创建页面`src/pages/test/index.vue`，并在`pages.json`中配置路由。例如：

```json
"pages": [
    ...
    {
        "path": "pages/test/index",
        "style": {
            "navigationBarTitleText": "测试页面"
        }
    },
    ...
]
```

2. 在需要的地方调用路由跳转方法
```ts:line-numbers
// 无参数跳转
FC.Router.testIndex()
// 有参数跳转
FC.Router.testIndex({ id: 123 })
```

3. 如果路由跳转传递参数，则可以在页面中这样获取参数
`src/pages/test/index.vue`
```ts:line-numbers
<script setup lang="ts">
const id = ref(0)

onLoad((e?: AnyObject) => {
    id.value = e?.id
})
</script>
```

::: tip 提示
`FC.Router.xxxx()`路由跳转的名称方法，是根据`page.json`中的`path`配置生成的。仅保留最后两个路径段(2个路径则取最后1个)。并转为了驼峰式命名。例如：

`/pages/demo` ==> `FC.Router.demo()`

`/pages/demo/locale` ==> `FC.Router.demoLocale()`

`/pages/demo/locale/index` ==> `FC.Router.localeIndex()`

... 以此类推

所以在创建页面并配置路由时，不仅要保证`path`路径唯一，也要保证`path`最后两个路径段(2个路径则取最后1个)也要是唯一的。
:::

::: warning 提示
想要使用`uni.navigateTo`api中提供的其它参数， 例如`animationType`,`success`、`fail`、`complete`等回调函数，则可以直接使用`uni.navigateTo`进行跳转，也是可以的，例如：

uni.navigateTo({

        url: "/pages/test/index",
        animationType: "pop-out",
})

如果要进行参数传递，则可以用下面的写法

uni.navigateTo({ 

        url: "/pages/test/index" + FC.Router.parseParams(data),
        animationType: "pop-out",
})

:::