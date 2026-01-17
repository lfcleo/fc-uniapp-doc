# 应用更新

| H5 | 安卓 | 苹果 | 鸿蒙 | 微信小程序 | 其它小程序 |
| :---: | :---: | :---: | :---: | :---: | :---: |
| x | √ | √ | x | √ | - |

小程序端应用更新是对`uni.getUpdateManager`做了层封装。App端，则需要与后端交互，可实现打开应用市场，wgt静默更新和整包更新

此功能参考[插件1](https://ext.dcloud.net.cn/plugin?id=4542)和[插件2](https://ext.dcloud.net.cn/plugin?id=7286)。

App端后端控制更新字段如下：
```ts:line-numbers
interface AppUpdated {
    describe: string;        // 版本更新内容（富文本）
    edition_url: string,     // apk、wgt包下载地址或者应用市场地址  安卓应用市场 market://details?id=xxxx 苹果store itms-apps://itunes.apple.com/cn/app/xxxxxx
    edition_force: number,   // 是否强制更新 0代表否 1代表是
    package_type: number,    // 0是整包升级（apk或者appstore或者安卓应用市场） 1是wgt升级
    edition_issue: number,   // 是否发行  0否 1是 为了控制上架应用市场审核时不能弹出热更新框
    edition_number: number,  // 版本号 最重要的manifest里的版本号 （检查更新主要以服务器返回的edition_number版本号是否大于当前app的版本号来实现是否更新）
    edition_name: string,    // 版本名称 manifest里的版本名称
    edition_silence: number, // 是否静默更新 0代表否 1代表是
}
```

## App端使用方法

1. 终端执行
```bash
fcuni c updated
```

2. 新建一个页面，用于展示更新弹窗，例如`/pages/updated/updated.vue`
```vue:line-numbers
<template>
    <view class="left-0 top-0 right-0 bottom-0 fixed flex flex-c" style="background-color: rgba(0, 0, 0, 0.65);"
        @touchmove.stop.prevent>
        <view class="top-0 w-600rpx bg-white box-border p-[40rpx_50rpx] rounded-20rpx">
            <view class="flexc flex-c mb-[30rpx]">
                <text class="text-[40rpx] font-bold">发现新版本</text>
                <text class="text-[30rpx] mt-[10rpx] text-[#cccccc] ">v{{ data.edition_name }}</text>
            </view>
            <view>
                <scroll-view class="box-border p-x-40rpx text-left" scroll-y="true">
                    <rich-text :nodes="data.describe"></rich-text>
                </scroll-view>
            </view>
            <view class="mt-[30rpx] flex items-center">
                <view class="w-full flexc items-center" v-if="!updateBtn">
                    <progress class="w-[500rpx] h-[40rpx]" border-radius="35" :percent="percent" activeColor="#3DA7FF"
                        show-info stroke-width="10" />
                    <text class="text-24rpx">正在下载，请稍后 ({{ downloadedSize }}/{{ packageFileSize }}M)</text>
                </view>

                <view class="flex w-full">
                    <view class="flex-1 flex flex-c rounded-[10rpx]  h-[80rpx]  bg-[#f8f8fa]" @click="cancel"
                        v-if="updateBtn">
                        <text class="text-[30rpx] font-400 text-[#cccccc]">稍后再说</text>
                    </view>
                    <view class="w-[20rpx]"></view>
                    <view class="flex-1 flex flex-c rounded-[10rpx]  h-[80rpx]  bg-[#1785ff]" @click="confirm"
                        v-if="updateBtn">
                        <text class="text-[30rpx] font-400 text-white">立即更新</text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
const percent = ref(0)
const updateBtn = ref(true)
const cancleBtn = ref(false)
const downloadedSize = ref('0')
const packageFileSize = ref('0')
const data = ref({
    describe: '',   //更新内容描述
    edition_url: '', //安装包下载地址或者通用应用市场地址
    edition_force: 1, //是否强制更新 0代表否 1代表是
    package_type: 0,//0是整包升级 1是wgt升级
    edition_name: '' //后端返回的版本名称
})

function download() {
    let package_type = data.value.package_type;
    const downloadTask = uni.downloadFile({
        url: data.value.edition_url,
        success: res => {
            if (res.statusCode === 200) {
                plus.runtime.install(
                    res.tempFilePath,
                    {
                        force: true //true表示强制安装，不进行版本号的校验；false则需要版本号校验，
                    },
                    function () {
                        // console.log('success', success);
                        if (package_type == 1) {
                            plus.runtime.restart();
                        }
                    },
                    function (e) {
                        //提示部分wgt包无法安装的问题
                        data.value.edition_force = 0;
                        uni.showToast({
                            title: e.message,
                            icon: 'none',
                            duration: 2500
                        })
                        setTimeout(() => {
                            uni.navigateBack()
                        }, 2000)

                    }
                );
                if (package_type == 0) {
                    // 解决安装app点击取消，更新还在的问题
                    data.value.edition_force = 0;
                    uni.navigateBack();
                }
            }
        }
    });
    // 进度条
    downloadTask.onProgressUpdate(res => {
        percent.value = res.progress;
        downloadedSize.value = (res.totalBytesWritten / Math.pow(1024, 2)).toFixed(2);
        packageFileSize.value = (res.totalBytesExpectedToWrite / Math.pow(1024, 2)).toFixed(2);
    });

}

function confirm() {
    if (data.value.package_type == 0) {
        //apk整包升级 下载地址必须以.apk结尾
        if (data.value.edition_url.includes('.apk')) {
            updateBtn.value = false;
            cancleBtn.value = false;
            download();

        } else {
            //外部下载 一般是手机应用市场或者其他h5页面
            data.value.edition_force = 0; // 解决跳转外部链接后，更新提示还在的问题
            plus.runtime.openURL(data.value.edition_url);
            uni.navigateBack({
                delta: 1
            });
        }
    } else {
        updateBtn.value = false;
        cancleBtn.value = false;
        //wgt资源包升级 下载地址必须以.wgt结尾
        download();
    }
}

function cancel() {
    uni.navigateBack({ delta: 1 });
}

onHide(() => {
    data.value.edition_force = 0;
    uni.navigateBack({ delta: 1 })
})

onLoad((e?: AnyObject) => {
    data.value = JSON.parse(e?.obj || "{}");
    if (data.value.edition_force == 0) {
        cancleBtn.value = true;
    }
})

onBackPress(() => {
    // 强制更新不允许返回
    if (data.value.edition_force == 1) {
        return true;
    }
})

</script>

<style>
page {
    background: transparent;
}
</style>
```

::: tip 注意
弹窗样式可以自定义，但`script`部分代码建议不要修改。
:::

3. 在`pages.json`中注册`/pages/updated/updated.vue`页面，注意不要放在`pages`数组的第一个位置。
```json:line-numbers
{
    "pages": [ //pages数组中第一项表示应用启动页，参考：https://uniapp.dcloud.io/collocation/pages
        {
            这里是第一项，注意不能是更新页面
        },
        {
            "path": "pages/updated/updated", // 应用更新插件，不能放在第一项
            "style": {
                "app-plus": {
                    "animationDuration": 200,
                    "animationType": "fade-in",
                    "background": "transparent",
                    "backgroundColorTop": "transparent",
                    "popGesture": "none",
                    "scrollIndicator": false,
                    "titleNView": false
                },
                "disableScroll": true
            }
        },
        ...其它页面
    ],
}
```
并且在`src/modules/router/index.ts`的`config`中添加更新弹窗页面到路由白名单中
```ts:line-numbers {4}
export const config = {
    // 路由白名单，添加更新弹窗页面到白名单中
    whiteList: [
        '/pages/updated/updated',
    ],
}
```
::: danger 注意
更新弹窗页面不能放在`pages`数组的第一个位置

更新弹窗页面要添加到路由白名单中
:::

4. 在`App.vue`中初始化更新配置
```ts:line-numbers {2,6-10}
<script setup lang="ts">
import { apiCheckAppUpdate } from '@/modules/network/apis'  // 检查app更新接口

onShow(() => {
    console.log("App Show");
    // 如果要在每次启动时检查是否有app更新，放在这里比较好些
    FC.Updated.checkUpdated({
        checkUpdateApi: apiCheckAppUpdate,  // 检查app更新接口
        pageUrl: '/pages/updated/updated',  // 更新弹窗页面路径
    })
});

</script>
```
如果是需要手动检查更新，例如在设置页面点击按钮检查更新，则这样调用
```vue:line-numbers {16}
<template>
    <FcBaseView custom-class="p-20rpx">
        <!-- #ifdef APP-PLUS || MP -->
        <button class="mt-20rpx w-full" type="primary" @click="checkUpdate">检查App/小程序更新（模拟）</button>
        <!-- #endif -->
    </FcBaseView>
</template>

<script setup lang="ts">
import { apiCheckAppUpdateTest } from '@/modules/network/apis'

async function checkUpdate() {
    try {
        const result = await FC.Updated.checkUpdated({
            checkUpdateApi: apiCheckAppUpdateTest,
            isManual: true, // 是否手动检查更新，默认false
            pageUrl: '/pages/updated/updated',
        })
    } catch (error) {
        //TODO handle the exception
        console.log(error)
    }
}
</script>
```

::: danger 注意
APP端调试时，必须要自定义基座打包调试！！！
:::

## 小程序端使用方法

1. 终端执行
```bash
fcuni c updated
```

2. 在`App.vue`中初始化更新配置
```ts:line-numbers {6}
<script setup lang="ts">

onShow(() => {
    console.log("App Show");
    // 如果要在每次启动时检查是否有app更新，放在这里比较好些
    FC.Updated.checkUpdated()
});

</script>
```

## 移除模块

如果项目不需要应用更新模块，可以在终端执行
```bash
fcuni d updated
```
并移除相关代码