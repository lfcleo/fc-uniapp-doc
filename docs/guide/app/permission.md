# 系统权限

| H5 | 安卓 | 苹果 | 鸿蒙 | 微信小程序 | 其它小程序 |
| :---: | :---: | :---: | :---: | :---: | :---: |
| - | √ | √ | - | - | - |

上架App应用时，在使用一些功能时，需要申请用户授权。iOS端很好处理，只需要在`manifest.json`中配置说明即可。Android端则需要在使用权限时弹窗提示说明。基于此封装了`FC.Permission`，解决了Android端权限申请的问题。

此功能参考[插件1](https://ext.dcloud.net.cn/plugin?name=uni-registerRequestPermissionTips)和[插件2](https://ext.dcloud.net.cn/plugin?id=22675)。

## 使用方法

1. 终端执行
```bash
fcuni c authorize
```
2. 在`manifest.json`中配置所需的权限，

::: danger 注意
未使用的权限不要配置。不用的权限也要及时移除。
:::

3. 创建`src/modules/authorize/index.ts`文件，配置权限说明
```ts:line-numbers
export const AuthorizeConfig = {
    "ACCESS_COARSE_LOCATION,ACCESS_FINE_LOCATION": {
        name: "定位",	// 当前权限的名称
        explain: "填写调用定位描述"	// 权限说明
    },
    "CALL_PHONE": {
        name: "电话",	// 当前权限的名称
        explain: "填写调用拨打电话描述"	// 权限说明
    },
    "WRITE_EXTERNAL_STORAGE,READ_EXTERNAL_STORAGE,READ_MEDIA_IMAGES": {
        name: "存储",	// 当前权限的名称
        explain: "填写调用存储描述"		// 权限说明
    },
    "CAMERA": {
        name: "相机",	// 当前权限的名称
        explain: "填写调用相机描述"		// 权限说明
    }
}
```
::: tip 注意
根据实际情况定义。
:::

4. 在`App.vue`中初始化权限配置
```ts:line-numbers {2-4,8-10}
<script setup lang="ts">
// #ifdef APP-PLUS
import { AuthorizeConfig } from "@/modules/authorize";
// #endif

onLaunch(() => {
    console.log("App Launch");
    // #ifdef APP-PLUS
    FC.Authorize.init(AuthorizeConfig)
    // #endif
});

</script>
```

5. 在项目中正常使用权限，例如
```ts
function getLocation() {
    uni.getLocation({
        type: 'wgs84',
        success: (res: UniApp.GetLocationSuccess) => {
            console.log(res)
        },
        fail: async (err) => {
            console.log(err)
        }
    })
}
```

6. 如果是APP端，必须要自定义基座打包调试！！！
::: danger 注意
APP端调试时，添加了调用权限代码，必须要自定义基座打包调试！！！
:::

## 移除模块

如果项目不需要权限模块，或使用其它封装的权限模块，可以在终端执行
```bash
fcuni d authorize
```
并移除相关代码