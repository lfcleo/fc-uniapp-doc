# 上传文件

| H5 | 安卓 | 苹果 | 鸿蒙 | 微信小程序 | 其它小程序 |
| :---: | :---: | :---: | :---: | :---: | :---: |
| √ | √ | √ | √ | √ | - |

FC-Uniapp 集成了上传文件模块

具有`无感刷新token`,`请求拦截`,`响应拦截`,`错误拦截`,`上传进度`,`多文件上传`等功能。

以下面接口为例,实现上述完整功能

请求地址: `https://www.xxx.com/api/upload`

请求参数: 
```json:line-numbers
{
    "name": "test"
}
```

响应结果: 
```json:line-numbers
https://www.xxx.com/api/upload/test.txt
```
::: tip 提示
响应结果和`uni.uploadFile`的返回类型保持一致。见:[uni.uploadFile](https://uniapp.dcloud.net.cn/api/request/network-file.html#uploadfile)
:::

## 使用方法

1. 终端执行
```bash
fcuni c upload
```

2. 在`src/modules/network/upload.ts`文件中配置上传文件模块。
```ts:line-numbers
import { useAuthStore } from "@/modules/stores/auth";   // 引入auth模块的store，用于设置token

const DevBaseURL = "https://www.xxx.com/"  // 开发环境baseurl
const ProBaseURL = "https://www.yyy.com/"  // 生产环境baseurl
const timeout = 10000  // 上传文件超时时间

/**
 * 上传客户端实例
 */
export default new FC.Upload({
    baseURL: process.env.NODE_ENV === 'production' ? ProBaseURL : DevBaseURL,
    timeout: timeout,
    // 上传拦截器
    uploadInterceptors: (config: UniApp.UploadFileOption) => {
        // 例如header添加token
        config.header = {
            ...config.header,
            "token": useAuthStore().token ? `Bearer ${useAuthStore().token}` : "",
            "Access-Control-Allow-Origin": "*"
        };
    },
    // 上传成功拦截器
    uploadSuccess: (response: UniApp.UploadFileSuccessCallbackResult): boolean => {
       if (response.statusCode == 200) {
            // 注意返回的response.data是字符串类型,同官网保持一致
            console.log("文件上传成功返回数据", response.data)
            return true; // 只有返回true，才能正常返回数据
        } else if (response.statusCode == 401) {
            FC.Router.toLoginPage();
        } else {
            uni.showToast({
                title: '文件上传失败',
                icon: 'error'
            });
        }

        return false;
    },
    // 上传完成拦截器
    uploadComplete: () => {
        // 处理上传完成逻辑
    },
    // 上传错误拦截器
    uploadError: (err: UniApp.GeneralCallbackResult) => {
        console.log(err);
        uni.showToast({
            title: '文件上传错误',
            icon: 'error'
        });
    }
} as FCType.UploadConfig);

```
上面配置中，实现了以下功能：
- 配置`基础URL`、`超时时间`、`请求头拦截器`、`响应成功拦截器`、`响应完成拦截器`、`响应错误拦截器`，这些方法都是可选项，根据实际情况自行选择。
- `uploadInterceptors`中在每个请求的Header中添加了`token`
- `uploadSuccess`中判断返回数据 `statusCode == 200` 正常返回数据，`statusCode == 401` 跳转登录页面
- `uploadError`请求错误时，展示错误提示

::: warning 提示
以上配置都是可选项。
:::

::: tip 提示
如果项目需要请求多个不同的接口，并且每个接口配置不同，可以 `new` 多个 `FC.Upload` 实例。
:::

3. 在`src/modules/network/apis.ts`文件中定义上传文件接口。
```ts:line-numbers
/**
 * 测试API--上传文件
 * @param data - 测试API--上传文件请求参数
 * @returns Promise<string> - 测试API--上传文件返回
 */
export function apiUploadFile(
    name: string,
    filePath: string,
    data?: object
): Promise<string> {
    return upload.upload({
        url: 'upload',
        name: name,
        filePath: filePath,
        formData: data,
    }, true)
}

/**
 * 测试API--上传文件并监听进度
 * @param name - 上传文件的名称
 * @param filePath - 上传文件的路径
 * @param data - 测试API--上传文件请求参数
 * @param onProgressUpdate - 上传进度回调函数，可选
 * @returns Promise<string> - 测试API--上传文件返回
 */
export function apiUploadFileOnProgress(
    name: string,
    filePath: string,
    data?: object,
    onProgressUpdate?: (progress: UniApp.OnProgressUpdateResult) => void
): Promise<string> {
    return upload.upload({
        url: 'upload',
        name: name,
        filePath: filePath,
        formData: data,
    }, true, onProgressUpdate)
}

/**
 * 测试API--上传多文件文件
 * @param data - 测试API--上传多文件文件请求参数
 * @returns Promise<string> - 测试API--上传多文件文件返回的字符串
 */
export function apiUploadMultiFile(
    name: string,
    files: UniNamespace.UploadFileOptionFiles[],
    data?: object
): Promise<string> {
    return upload.upload({
        url: 'upload',
        name: name,
        files: files,
        formData: data,
    }, true)
}

/**
 * 测试API--上传多文件文件并监听进度
 * @param name - 上传文件的名称
 * @param files - 上传文件的数组
 * @param data - 测试API--上传多文件文件请求参数
 * @param onProgressUpdate - 上传进度回调函数，可选
 * @returns Promise<string> - 测试API--上传多文件文件返回的字符串
 */
export function apiUploadMultiFileOnProgress(
    name: string,
    files: UniNamespace.UploadFileOptionFiles[],
    data?: object,
    onProgressUpdate?: (progress: UniApp.OnProgressUpdateResult) => void
): Promise<string> {
    return upload.upload({
        url: 'upload',
        name: name,
        files: files,
        formData: data,
    }, true, onProgressUpdate)
}
```

::: tip 提示
上面给出了4个方法，分别是：
- `apiUploadFile` 上传单文件
- `apiUploadFileOnProgress` 上传单文件并监听进度
- `apiUploadMultiFile` 上传多文件
- `apiUploadMultiFileOnProgress` 上传多文件并监听进度

根据实际情况选择合适的方法。
:::

4. 使用上传文件接口
```ts:line-numbers
import * as API from "@/modules/network/apis";
...
// 测试上传单文件
function testUploadFile() {
    uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album'],
        success: async (res) => {
            try {
                resData.value = await API.apiUploadFile('file', res.tempFilePaths[0], {
                    name: 'test',
                })
            } catch (error) {
                console.log(error)
            }
        },
        fail(err) {
            console.log(err)
        }
    })
}

// 测试上传单文件并监听进度
function testUploadFileOnProgress() {
    upProgress.value = 0
    uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album'],
        success: async (res) => {
            try {
                resData.value = await API.apiUploadFileOnProgress('file', res.tempFilePaths[0], {
                    name: 'test',
                }, (progressEvent) => {
                    upProgress.value = progressEvent.progress
                })
            } catch (error) {
                console.log(error)
            }
        },
        fail(err) {
            console.log(err)
        }
    })
}

// 测试上传多文件
async function testUploadMultiFile() {
    uni.chooseImage({
        count: 9,
        sizeType: ['compressed'],
        sourceType: ['album'],
        success: async (res) => {
            let files: UniNamespace.UploadFileOptionFiles[] = [];
            if (Array.isArray(res.tempFiles)) {
                res.tempFiles.forEach((item: any) => {
                    files.push({
                        name: item.name,
                        uri: item.path || item.uri,
                    })
                });
            }
            try {
                resData.value = await API.apiUploadMultiFile('files', files, {
                    name: 'test',
                })
            } catch (error) {
                console.log(error)
            }
        },
        fail(err) {
            console.log(err)
        }
    })
}

// 测试上传多文件并监听进度
function testUploadMultiFileOnProgress() {
    upProgress.value = 0
    uni.chooseImage({
        count: 9,
        sizeType: ['compressed'],
        sourceType: ['album'],
        success: async (res) => {
            let files: UniNamespace.UploadFileOptionFiles[] = [];
            if (Array.isArray(res.tempFiles)) {
                res.tempFiles.forEach((item: any) => {
                    files.push({
                        name: item.name,
                        uri: item.path || item.uri,
                    })
                });
            }
            try {
                resData.value = await API.apiUploadMultiFileOnProgress('files', files, {
                    name: 'test',
                }, (progressEvent) => {
                    console.log(progressEvent)
                    upProgress.value = progressEvent.progress
                })
            } catch (error) {
                console.log(error)
            }
        },
        fail(err) {
            console.log(err)
        }
    })
}
```
::: tip 提示
同样的上面给出了4个方法，分别是：
- `testUploadFile` 上传单文件
- `testUploadFileOnProgress` 上传单文件并监听进度
- `testUploadMultiFile` 上传多文件
- `testUploadMultiFileOnProgress` 上传多文件并监听进度
:::

## 模块属性

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| `baseURL` | `string` | 上传文件地址 |
| `timeout` | `number` | 上传文件超时时间 |
| `uploadInterceptors` | `(config: UniApp.UploadFileOption) => void` | 上传文件头拦截器 |
| `uploadSuccess` | `(response: UniApp.UploadFileSuccessCallbackResult) => boolean` | 上传文件成功拦截器 |
| `uploadComplete` | `() => void` | 上传文件完成拦截器 |
| `uploadError` | `(err: UniApp.GeneralCallbackResult) => void` | 上传文件错误拦截器 |
| `shouldRefreshToken` | `(response: UniApp.UploadFileSuccessCallbackResult) => boolean` | 判断是否需要刷新token |
| `refreshTokenMethod` | `() => Promise<boolean>` | 刷新token方法 |

## 移除模块

如果项目不需要上传文件模块，或使用其它封装的上传文件，可以在终端执行
```bash
fcuni d upload
```
并移除相关代码
