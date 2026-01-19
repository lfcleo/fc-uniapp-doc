# 极光推送

| H5 | 安卓 | 苹果 | 鸿蒙 | 微信小程序 | 其它小程序 |
| :---: | :---: | :---: | :---: | :---: | :---: |
| x | √ | √ | x | x | x |

文档：

[客户端公用API](https://github.com/jpush/jpush-hbuilder-plugin/blob/master/doc/API.md)

[安卓API](https://github.com/jpush/jpush-hbuilder-plugin/blob/master/doc/ANDROID.md)

[苹果API](https://github.com/jpush/jpush-hbuilder-plugin/blob/master/doc/IOS.md)

[服务端REST API](https://docs.jiguang.cn/jpush/server/push/server_overview)

## 使用方法

1. 注册极光推送账号，并创建应用，获取`AppKey`和`Secret`(过程略)

2. 终端执行
```bash
fcuni c jgpush
```

3. 插件市场安装[jpush](https://ext.dcloud.net.cn/plugin?id=4035)和[jcore](https://ext.dcloud.net.cn/plugin?id=4028)，以`jpush`为例(`jcore`过程一样):

- 插件市场打开`jpush`和`jcore`插件，选择云打包

![1](/jgpush/1.jpg)

- 选择程序的包名

![2](/jgpush/2.jpg)

- 上面一步完成后，会给成功的提示。然后回到项目中，在`manifest.json`->`安卓/iOS原生插件配置`中选择云端插件

![3](/jgpush/3.jpg)
![4](/jgpush/4.jpg)

- 完成后，会在`manifest.json`->`安卓/iOS原生插件配置`中看到需要配置的参数，根据实际情况填写

![5](/jgpush/5.jpg)

::: warning 注意
根据实际情况填写`manifest.json`->`安卓/iOS原生插件配置`中的参数，`AppKey`是必填项

下方还会有各个安卓平台的`appid`，要去各个平台的开发者中心注册获取（后台推送会用到）
:::

4. 在`manifest.json`->`安卓/iOS模块配置`中勾选`Push(推送消息)`。（uniPush 1.0和uniPush 2.0不用勾选）

5. 在`src/modules/jgPush/index.ts`文件中配置极光推送参数。
```ts:line-numbers
export const jPushConfig = {
    loggerEnable: process.env.NODE_ENV !== 'production',
    connectEventListener: (result: any) => {
        const connectEnable = result.connectEnable;
        console.log("jpush连接状态回调：", connectEnable);
    },
    notificationListener: (result: any) => {
        console.log("jpush通知事件回调：", result);
        const notificationEventType = result.notificationEventType;
        // 推送消息被点击时
        if (notificationEventType === 'notificationOpened') {
            // 点击推送消息的逻辑
            console.log("通知已被打开");
        }
    },
    customMessageListener: (result: any) => {
        console.log("jpush自定义消息事件回调：", result);
    },
    inMessageListener: (result: any) => {
        console.log("jpush应用内消息事件回调：", result);
    },
    localNotificationListener: (result: any) => {
        console.log("jpush本地通知事件回调：", result);
    },
} as FCType.JGPushConfig;
```

6. `App.vue`中初始化极光推送
```ts:line-numbers {2-4,8-10}
<script setup lang="ts">
// #ifdef APP-PLUS
import { jPushConfig } from "@/modules/jgPush";
// #endif

onLaunch(() => {
    console.log("App Launch");
    // #ifdef APP-PLUS
    FC.JGPush.init(jPushConfig)
    // #endif
});

</script>
```

::: danger 注意
配置完成后，需重新打包自定义基座调试
:::

7. 在[极光推送后台](https://www.jiguang.cn/console/push)测试推送功能

![6](/jgpush/6.png)

![7](/jgpush/7.png)

::: warning 注意
根据实际情况配置上述选项

如果未添加各大安卓应用市场的appid，则测试推送时，要确保应用在前台运行，否则不会收到推送
:::

更多用法请参考[插件市场极光推送](https://ext.dcloud.net.cn/plugin?id=4035)中的介绍

## 移除模块

如果项目不需要极光推送模块，可以在终端执行
```bash
fcuni d jgpush
```
并移除相关插件和代码