# 网络请求

| H5 | 安卓 | 苹果 | 鸿蒙 | 微信小程序 | 其它小程序 |
| :---: | :---: | :---: | :---: | :---: | :---: |
| √ | √ | √ | √ | √ | - |

FC-Uniapp 默认集成了网络请求模块

封装网络请求支持`无感刷新token`,`请求拦截`,`响应拦截`,`错误拦截`,`数据解析`等功能。

以下面接口为例,实现上述完整功能

请求地址: `https://www.xxx.com/api/request`

请求方式: `POST`

请求参数: 
```json:line-numbers
{
    "username": "admin",
    "password": "123456"
}
```

响应结果: 
```json:line-numbers
{
    "code": 200,
    "msg": "success",
    "data": {
        "token": "xxxxxx",
        "refreshToken": "yyyyyy"
    }
}
```

## 使用方法

1. 在`src/modules/types.ts`文件中定义网络请求接口的响应结构体。
```ts:line-numbers
export interface Auth {
    token: string;			// token
    refreshToken: string;	// 刷新token
}
```

2. 在`src/modules/network/request.ts`文件中配置网络请求模块。
```ts:line-numbers
import { useAuthStore } from "@/modules/stores/auth"    // 引入auth模块的store，用于设置token

const DevBaseURL = "https://www.xxx.com/"  // 开发环境baseurl
const ProBaseURL = "https://www.yyy.com/"  // 生产环境baseurl
const timeout = 10000  // 网络请求超时时间

/**
 * 上传文件返回结构体，【根据实际情况定义】
 */
export interface ApiResponse<T = any> {
    code: number;
    msg: string;
    data: T;
}

/**
 * HTTP客户端实例
 */
const reqeust = new FC.Request({
    baseURL: process.env.NODE_ENV === 'production' ? ProBaseURL : DevBaseURL,   //根据环境变量判断使用baseUrl
    timeout: timeout,
    // 请求拦截
    requestInterceptors: (config: UniApp.RequestOptions) => {
        // 例如header添加token
        config.header = {
            ...config.header,
            "token": `Bearer ${useAuthStore().token}`,
            "Access-Control-Allow-Origin": "*"
        }
    },
    // 响应成功拦截
    responseSuccess: (response: UniApp.RequestSuccessCallbackResult): boolean => {
        // 例如，statusCode && code == 200时，代表数据正常。statusCode==401跳转登录页面
        if (response.statusCode == 200) {
            const data = response.data as ApiResponse;
            if (data.code == 200) {
                return true	// 只有返回true，才能正常返回数据
            }
            uni.showToast({
                title: data.msg || '网络请求错误',
                icon: 'error'
            });
        } else if (response.statusCode == 401) {
            FC.Router.toLoginPage()
        }

        return false
    },
    // 响应完成拦截
    responseComplete: () => {
        // ...
    },
    // 响应错误拦截
    responseError: (err: UniApp.GeneralCallbackResult) => {
        console.log(err)
        uni.showToast({
            title: '网络请求错误',
            icon: 'error'
        });
    },
    // 响应数据解析器 - 可以根据项目需求自定义，如果要返回完整数据，则注释这段即可
    responseParser: <T>(data: any) => {
        // 根据项目后端返回格式，提取需要的数据
        return data.data as T;
    },
    // 判断是否需要刷新token
    shouldRefreshToken: (response: UniApp.RequestSuccessCallbackResult): boolean => {
        // 自定义判断逻辑：当响应状态码为200且响应数据中的code为401时需要刷新token
        const data = response.data as ApiResponse;
        return response.statusCode == 200 && data.code == 401;
    },
    refreshTokenMethod: async (): Promise<boolean> => {
        try {
            uni.showLoading({ title: "loading...", mask: true });

            // 实现token刷新逻辑，返回包含新token的对象
            const response = await uni.request({
                url: `${process.env.NODE_ENV === 'production' ? ProBaseURL : DevBaseURL}api/refreshToken`,
                method: 'GET',
                header: {
                    'Content-Type': 'application/json',
                    'token': `Bearer ` + useAuthStore().refreshToken
                },
            });

            if (response.statusCode == 200) {
                const data = response.data as ApiResponse;
                console.log(data)
                if (data.code == 200) {
                    // 刷新token成功后，更新store中的token和refreshToken
                    useAuthStore().token = data.data.token;
                    useAuthStore().refreshToken = data.data.refreshToken;
                    return true
                }
            }
            return false
        } catch (error) {
            return false
        } finally {
            uni.hideLoading();
        }
    }
} as FCType.RequestConfig)

export default reqeust
```
上面配置中，实现了以下功能：

- 配置了网络请求的`基础URL`、`超时时间`、`请求头拦截器`、`响应成功拦截器`、`响应完成拦截器`、`响应错误拦截器`、`响应数据解析器`、`判断是否需要刷新token的方法`、`刷新token的方法`，这些方法都是可选项，根据实际情况自行选择。
- `requestInterceptors` 中在每个请求的Header中添加了`token`
- `responseSuccess` 中判断返回数据 `statusCode && code == 200` 正常返回数据，`statusCode == 401` 跳转登录页面
- `responseError` 请求错误时，展示错误提示
- `responseParser` 中根据项目后端返回格式，提取需要的数据data.data。而非返回data
- `shouldRefreshToken` 中判断返回数据 `statusCode==200 && code == 401` 时需要刷新token
- `refreshTokenMethod` 中实现了刷新token的逻辑，返回包含新token的对象。

::: warning 提示
以上配置都是可选项。
:::

::: tip 提示
如果项目需要请求多个不同的接口，并且每个接口配置不同，可以 `new` 多个 `FC.Request` 实例。
:::


3. 在`src/modules/network/apis.ts`文件中定义网络请求接口。
```ts:line-numbers
import request from "./network/request"
import type * as Types from "@/modules/types"

export function demo(data: object): Promise<Types.Auth> {
    return request.request<Types.Auth>({
        url: 'api/request',
        method: 'POST',
        data: data,
    }, true)
}
```

4. 使用网络请求接口
```ts:line-numbers
import * as API from "@/modules/network/apis";

async function testPost() {
    try {
        const authData = await API.demo({
            username: 'admin',
            password: '123456',
        })
        console.log(authData)
    } catch (error) {
        console.log(error)
    }
}
```

## 关于无感刷新token

在上述例子中，当服务器返回自定义401状态码时，会自动调用`refreshTokenMethod`方法刷新token。在此期间，再有新的请求返回401状态码时，会把这些请求添加到一个队列中，等待获取新token后重新发送。过程如下：

- <sapn class="marker-evy">请求接口，返回401状态码, 触发刷新token</sapn>
![无感刷新token1](/request/1.png)
- <sapn class="marker-evy">在请求刷新token期间，又请求了2个接口，同样返回401状态码</sapn>
![无感刷新token2](/request/2.png)
- <sapn class="marker-evy">请求刷新token接口成功，返回新的token和refreshToken</sapn>
![无感刷新token3](/request/3.png)
- <sapn class="marker-evy">使用新token重新请求之前返回401的接口，返回正常数据</sapn>
![无感刷新token4](/request/4.png)

## 模块属性

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| `baseURL` | `string` | 网络请求地址 |
| `timeout` | `number` | 网络请求超时时间 |
| `requestInterceptors` | `(config: UniApp.RequestOptions) => void` | 网络请求头拦截器 |
| `responseSuccess` | `(response: UniApp.RequestSuccessCallbackResult): boolean` | 网络请求成功拦截器 |
| `responseComplete` | `(response: UniApp.RequestCompleteCallbackResult) => void` | 网络请求完成拦截器 |
| `responseError` | `(err: UniApp.GeneralCallbackResult) => void` | 网络请求错误拦截器 |
| `responseParser` | `<T>(data: any) => T` | 网络请求响应数据解析器 |
| `shouldRefreshToken` | `(response: UniApp.RequestSuccessCallbackResult): boolean` | 判断是否需要刷新token |
| `refreshTokenMethod` | `async (): Promise<boolean>` | 刷新token方法 |

## 移除模块

如果项目不需要网络请求模块，或使用其它封装的网络请求，可以在终端执行
```bash
fcuni d request
```
并移除相关代码