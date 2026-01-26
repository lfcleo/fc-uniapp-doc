# 下载文件

| H5 | 安卓 | 苹果 | 鸿蒙 | 微信小程序 | 其它小程序 |
| :---: | :---: | :---: | :---: | :---: | :---: |
| √ | √ | √ | √ | √ | - |

FC-Uniapp 集成了下载文件模块

具有`无感刷新token`,`请求拦截`,`响应拦截`,`错误拦截`,`下载进度`等功能。

以下面接口为例,实现上述完整功能

请求地址: `https://www.xxx.com/api/download`

响应结果: 
```json:line-numbers
https://www.xxx.com/api/download/test.txt
```
::: tip 提示
响应结果和`uni.downloadFile`的返回类型保持一致。见:[uni.downloadFile](https://uniapp.dcloud.net.cn/api/request/network-file.html#downloadfile)
:::

## 使用方法

1. 终端执行命令安装模块<sapn class="marker-evy">（如若创建项目时已选择了该模块，可略过这一步）</sapn>
```bash
fcuni c download
```

2. `src/modules/network/download.ts`文件中配置下载文件模块。
```ts:line-numbers
import { useAuthStore } from "@/modules/stores/auth";    // 引入auth模块的store，用于设置token

const DevBaseURL = "https://www.xxx.com/"	// 开发环境baseurl
const ProBaseURL = "https://www.yyy.com/"	// 生产环境baseurl
const timeout = 100000	// 网络请求超时时间

/**
 * 下载文件客户端实例
 */
export default new FC.Download({
    baseURL: process.env.NODE_ENV === 'production' ? ProBaseURL : DevBaseURL,
    timeout: timeout,
    // 下载拦截器
    downloadInterceptors: (config: UniApp.DownloadFileOption) => {
        // 例如header添加token
        config.header = {
            ...config.header,
            "token": useAuthStore().token ? `Bearer ${useAuthStore().token}` : "",
            "Access-Control-Allow-Origin": "*"
        };
    },
    // 下载成功拦截器
    downloadSuccess: (response: UniApp.DownloadSuccessData): boolean => {
        if (response.statusCode == 200) {
            console.log("文件下载成功返回数据", response)
            return true; // 只有返回true，才能正常返回数据
        } else if (response.statusCode == 401) {
            FC.Router.toLoginPage();
        }else{
            uni.showToast({
                title: '文件下载失败',
                icon: 'error'
            });
        }

        return false;
    },
    // 下载完成拦截器
    downloadComplete: () => {
        // 处理下载完成逻辑
    },
    // 下载错误拦截器
    downloadError: (err: UniApp.GeneralCallbackResult) => {
        console.log(err);
        uni.showToast({
            title: '文件下载错误',
            icon: 'error'
        });
    }
} as FCType.DownloadConfig);

```
上面配置了下载文件模块的基本功能。
- 配置`基础URL`、`超时时间`、`请求头拦截器`、`响应成功拦截器`、`响应完成拦截器`、`响应错误拦截器`，这些方法都是可选项，根据实际情况自行选择。
- `downloadInterceptors`中在每个请求的Header中添加了`token`
- `downloadSuccess`中判断返回数据 `statusCode == 200` 正常返回数据，`statusCode == 401` 跳转登录页面
- `downloadError`请求错误时，展示错误提示

::: warning 提示
以上配置都是可选项。
:::

::: tip 提示
如果项目需要请求多个不同的接口，并且每个接口配置不同，可以 `new` 多个 `FC.Download` 实例。
:::

3. `src/modules/apis.ts`文件中定义下载文件接口。
```ts:line-numbers
/**
 * 测试API--下载文件
 * @param url - 下载文件的URL
 * @returns Promise<UniApp.DownloadSuccessData> - 测试API--下载文件返回的结果
 */
export function apiDownloadFile(url: string): Promise<UniApp.DownloadSuccessData> {
    return download.download({
        url: 'download',
    }, true)
}

/**
 * 测试API--下载文件并监听进度
 * @param url - 下载文件的URL
 * @param onProgressUpdate - 下载进度回调函数，可选
 * @returns Promise<UniApp.DownloadSuccessData> - 测试API--下载文件返回的结果
 */
export function apiDownloadFileOnProgress(
    url: string,
    onProgressUpdate?: (progress: UniApp.OnProgressDownloadResult) => void
): Promise<UniApp.DownloadSuccessData> {
    return download.download({
        url: 'download',
    }, true, onProgressUpdate)
}
```

::: tip 提示
上面给出了2个方法，分别是：
- `apiDownloadFile`：下载文件，不监听进度
- `apiDownloadFileOnProgress`：下载文件并监听进度

根据实际情况选择合适的方法。
:::

4. 调用下载文件接口
```ts:line-numbers
import * as API from "@/modules/apis";
...
async function testDownloadFile() {
    try {
        const data = await API.apiDownloadFile('test.txt')
        console.log(data)
        resData.value = JSON.stringify(data)
        uni.showToast({
            title: '下载成功',
            icon: 'success'
        })
    } catch (error) {
        console.log(error)
    }
}

async function testDownloadFileOnProgress() {
    downProgress.value = 0
    try {
        const data = await API.apiDownloadFileOnProgress(
            'test.txt',
            (progressEvent) => {
                console.log(progressEvent)
                downProgress.value = progressEvent.progress
            })
        resData.value = JSON.stringify(data)
        uni.showToast({
            title: '下载成功',
            icon: 'success'
        })
    } catch (error) {
        console.log(error)
    }
}
```
::: tip 提示
同样的上面给出了2个方法，分别是：
- `testDownloadFile`：下载文件，不监听进度
- `testDownloadFileOnProgress`：下载文件并监听进度
:::

## 模块属性

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| `baseURL` | `string` | 下载文件地址 |
| `timeout` | `number` | 下载文件超时时间 |
| `downloadInterceptors` | `(config: UniApp.DownloadFileOption) => void` | 下载文件头拦截器 |
| `downloadSuccess` | `(response: UniApp.DownloadSuccessData) => boolean` | 下载文件成功拦截器 |
| `downloadComplete` | `() => void` | 下载文件完成拦截器 |
| `downloadError` | `(err: UniApp.GeneralCallbackResult) => void` | 下载文件错误拦截器 |
| `shouldRefreshToken` | `(response: UniApp.DownloadSuccessData) => boolean` | 判断是否需要刷新token |
| `refreshTokenMethod` | `() => Promise<boolean>` | 刷新token方法 |

## 移除模块

如果项目不需要下载文件模块，或使用其它封装的下载文件，可以在终端执行
```bash
fcuni d download
```
并移除相关代码
