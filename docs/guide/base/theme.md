# 应用主题

| H5 | 安卓 | 苹果 | 鸿蒙 | 微信小程序 | 其它小程序 |
| :---: | :---: | :---: | :---: | :---: | :---: |
| √ | √ | √ | √ | √ | - |

FC-Uniapp 提供了静态和动态两种切换方式。

该模块依赖`FC.Store`模块和`src/components/FcBaseView/FcBaseView.vue`组件。

## 静态切换主题使用方法

1. 新建`src/modules/style/theme.ts`文件，配置主题。例如：
```ts:line-numbers
// 默认主题（浅色）
export const themeData = {
    "navbar": {				//系统导航栏主题
        "backgroundColor": "#fff",
        "frontColor": "#000000",	//注意，原生导航栏，这里的值只能为#000000或#ffffff
    },
    "tabbar": {				//系统tabbar主题
        "backgroundColor": "#fff",	//tab 的背景色
        "color": "#333333",			//tab 上的文字默认颜色
        "selectedColor": "#1296db",	//tab 上的文字选中时的颜色
        "borderStyle": 'black'		//tab 上边框的颜色， 仅支持 black/white
    },
    "--bg": "#f8f8f8",      // 背景色
    "--bg1": "#e8e8e8",     // 背景色1
    "--bg2": "#f0f0f0",     // 背景色2
    "--bg3": "#ffffff",     // 背景色3
    "--color": "#333333",   // 文字颜色
    "--color1": "#000000",  // 文字颜色1
    "--color2": "#646464",  // 文字颜色2
    "--color3": "#808080",  // 文字颜色3
    "--border": "#e0e0e0",  // 边框颜色
    "--border1": "#d0d0d0", // 边框颜色1
    "--border2": "#c0c0c0", // 边框颜色2
    "--border3": "#b0b0b0", // 边框颜色3
};

// 主题2（深色）
export const themeData1 = {
    "navbar": {				//系统导航栏主题
        "backgroundColor": "#333",
        "frontColor": "#ffffff",	//注意，原生导航栏，这里的值只能为#000000或#ffffff
    },
    "tabbar": {				//系统tabbar主题
        "backgroundColor": "#333333",	//tab 的背景色
        "color": "#ffffff",			//tab 上的文字默认颜色
        "selectedColor": "#1296db",	//tab 上的文字选中时的颜色
        "borderStyle": 'white'		//tab 上边框的颜色， 仅支持 black/white
    },
    "--bg": "#1e1e1e",      // 背景色
    "--bg1": "#282828",     // 背景色1
    "--bg2": "#333333",     // 背景色2
    "--bg3": "#424242",     // 背景色3
    "--color": "#ffffff",   // 文字颜色
    "--color1": "#e0e0e0",  // 文字颜色1
    "--color2": "#a0a0a0",  // 文字颜色2
    "--color3": "#808080",  // 文字颜色3
    "--border": "#e0e0e0",  // 边框颜色
    "--border1": "#d0d0d0", // 边框颜色1
    "--border2": "#c0c0c0", // 边框颜色2
    "--border3": "#b0b0b0", // 边框颜色3
};
```
::: warning 提示
示例中的字段并不是固定的，可根据实际情况定义。但需注意`navbar`和`tabbar`的内容结构要和示例中的保持一致。这是更改系统导航栏和tabbar的主题样式所需的字段。
:::

2. 在`src/modules/style/unocss.config.ts`文件中配置主题，使用起来方便些。
```ts:line-numbers
...
    shortcuts: [
        ...
        {
            // 背景色类
            'fc-bg': 'bg-[var(--bg)]',
            'fc-bg1': 'bg-[var(--bg1)]',
            'fc-bg2': 'bg-[var(--bg2)]',
            'fc-bg3': 'bg-[var(--bg3)]',
            // 文本颜色类
            'fc-text': 'text-[var(--color)]',
            'fc-text1': 'text-[var(--color1)]',
            'fc-text2': 'text-[var(--color2)]',
            'fc-text3': 'text-[var(--color3)]',
            // 边框颜色类
            'fc-border': 'border-color-[var(--border)]',
            'fc-border1': 'border-color-[var(--border1)]',
            'fc-border2': 'border-color-[var(--border2)]',
            'fc-border3': 'border-color-[var(--border3)]',
        }
    ],
...
```
使用了unocss的快捷类，配置了背景色、文本颜色、边框颜色等类。注意类名和变量名要保持一致。`nav`和`tabbar`不用定义。

::: warning 提示
这一步是可选的。如果不配置，也可以在代码中直接使用变量名。要用`var(--bg)`、`var(--color)`等。
:::

3. 在`src/App.vue`文件中，设置使用默认主题，例如：
```ts:line-numbers
...
import { themeData } from "@/modules/style/theme"
...
onLaunch(() => {
    ...
    FC.Store.initTheme(themeData)
});
```

4. 在`src/components/FcBaseView/FcBaseView.vue`文件中，引入主题。例如：

```vue:line-numbers {2-38,34-37}
<script setup lang="ts">
// 获取全局store
const sysGlobalStore = FC.useSysGlobalStore();

// 计算组件的样式，应用默认主题变量
const computedStyle = computed(() => {
    // #ifdef APP-PLUS
    // 安卓修改底部安全区域背景色
    if (uni.getSystemInfoSync().platform === 'android') {
        var Color = plus.android.importClass("android.graphics.Color");
        plus.android.importClass("android.view.Window");
        var mainActivity = plus.android.runtimeMainActivity();
        var window_android = mainActivity.getWindow();
        window_android.setNavigationBarColor(Color.parseColor(sysGlobalStore.theme['--bg']));
    }
    // #endif
    return {
        ...sysGlobalStore.theme as object, 		// 应用所有主题变量
    };
});

onShow(() => {
    setTimeout(() => {
        // 设置全局系统导航栏主题
        if ('navbar' in sysGlobalStore.theme) {
            uni.setNavigationBarColor(sysGlobalStore.theme.navbar as object)
        }

        // 设置全局系统tabbar主题，用uni.showTabBar判断是否是tabbar页面
        uni.showTabBar({
            success: () => {
                if ('tabbar' in sysGlobalStore.theme) {
                    uni.setTabBarStyle(sysGlobalStore.theme.tabbar as object)
                }
            }
        })
    }, 10)
})

</script>

<style lang="scss" scoped>
.base-view {
    //通用过渡效果
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

// WebKit 浏览器 (Chrome, Safari) 自定义滚动条样式
.base-view::-webkit-scrollbar {
    width: 0;
    height: 0;
}
</style>
```

在`<style>`中添加了`transition`，当主题切换时，会有一个平滑的过渡效果。在页面中使用

```vue:line-numbers
<template>
    <FcBaseView custom-class="p-20rpx">
        <view class="fc-border fc-bg ">
            <text class="fc-text">11111</text>
            <text class="fc-text1">22222</text>
            <text class="fc-text2">22222</text>
        </view>
    </FcBaseView>
</template>
```
::: tip 提示
在每个页面，包括后续创建的新页面，都要引入`FcBaseView.vue`组件，并在需要的组件中使用`unocss.config.ts`中定义的类。如果每个页面需要做单独class配置，
可以在`FcBaseView.vue`组件中添加`custom-class`属性
:::

5. 切换主题

只需要在合适的地方，设置`FC.useSysGlobalStore().theme`即可。例如：
```ts:line-numbers
<switch @change="switchTheme" />
...
import { themeData, themeData1 } from "@/modules/style/theme"

// 获取全局store
const sysGlobalStore = FC.useSysGlobalStore();
// 切换主题
const switchTheme = (e: any) => {
    sysGlobalStore.theme = e.detail.value ? themeData1 : themeData;
};
```

## 动态切换主题使用方法

动态切换主题的方法和使用静态切换主题的方法一样。只是需要访问接口，并保证接口返回的主题数据格式和`themeData`一致。

上面步骤保持不变，新加网络请求获取主题数据。例如：
```ts:line-numbers
...
// 网络请求获取主题
const apiTheme = ref<TypeAppTheme>();
// 网络请求获取应用主题
async function getAppTheme() {
    try {
        apiTheme.value = await apiAppTheme();
    } catch (error) {
        console.error("获取应用主题失败:", error);
    }
}
...
```

::: warning 提示
apiAppTheme 是一个网络请求接口，用于获取应用主题数据。返回的主题数据格式和`themeData`一致。
:::

切换主题只需要把`FC.useSysGlobalStore().theme`设置为`apiTheme.value`即可