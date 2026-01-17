# Pinia持久化存储

| H5 | 安卓 | 苹果 | 鸿蒙 | 微信小程序 | 其它小程序 |
| :---: | :---: | :---: | :---: | :---: | :---: |
| √ | √ | √ | √ | √ | - |

FC-Uniapp 默认集成了 Pinia 状态管理库，同时也集成了 Pinia 持久化存储插件。开箱即用，无需额外配置。

## 使用方法

正常使用pinia的写法就行。没有用过的话，下面介绍一种写法。

以 `useAuthStore`（登录认证信息） 为例，展示如何创建和使用一个 store。

在`src/modules/types.ts`中定义`Auth`类型：

```ts:line-numbers
// 登录返回结构体，【根据实际情况定义】
export interface Auth {
    token: string;			// token
    refreshToken: string;	// 刷新token
}
```

创建文件夹`src/modules/stores`，并在其中创建文件`auth.ts`。写入以下内容：
```ts:line-numbers
import { defineStore } from "pinia";
import type { Auth } from "../types";

/**
 * 认证状态管理
 * 当前应用的认证状态，包括token、refreshToken等，【根据实际情况定义】
 */
export const useAuthStore = defineStore('auth', {
    state(): Auth {
        return {
            token: "",
            refreshToken: ""
        }
    }
})
```

使用时，先引入`useAuthStore`，然后就可以在组件中使用了。

```ts:line-numbers
import { useAuthStore } from "@/modules/stores/auth"

const authStore = useAuthStore();
```

## 持久化存储

如果需要将 store 中的状态持久化存储到本地，需要在 `defineStore` 中添加 `persist` 选项。例如：
```ts:line-numbers {15-19}
import { defineStore } from "pinia";
import type { Auth } from "../types";

/**
 * 认证状态管理
 * 当前应用的认证状态，包括token、refreshToken等，【根据实际情况定义】
 */
export const useAuthStore = defineStore('auth', {
    state(): Auth {
        return {
            token: "",
            refreshToken: ""
        }
    },
    // 如果需要持久化存本地,使用下方的代码。不需要存本地则删除或注释下方代码
    persist: {
        key: 'auth',
        storage: localStorage,
    }
})
```

## 预装store

框架已经预装了一个 store，名称为 `useSysGlobalStore`。内容为：
```ts:line-numbers
import { defineStore } from "pinia";

export const useSysGlobalStore = defineStore('sysGlobal', () => {
    const language = ref('zh-Hans');    // 语言，默认中文简体zh-Hans,英文en
    const theme = ref<string | object>(""); // 主题深拷贝

    return {
        language,
        theme,
    };
}, {
    persist: {
        key: 'SYS_GLOBAL',
        storage: {
            getItem: uni.getStorageSync,
            setItem: uni.setStorageSync
        }
    }
});
```
可以看到，包含的 `language` 和 `theme` 两个状态，分别用于存储语言和主题。所以当应用使用`多语言`和`主题切换`功能时会使用到。并做了持久化存储。在 [应用主题](./theme.md) 和 [多语言](./language.md) 功能中会介绍如何使用。

