# WebSocket长链接

| H5 | 安卓 | 苹果 | 鸿蒙 | 微信小程序 | 其它小程序 |
| :---: | :---: | :---: | :---: | :---: | :---: |
| √ | √ | √ | √ | √ | - |

FC-Uniapp 集成了下载文件模块

具有`断线重连`,`心跳发送`,`请求拦截`等功能。

以下面接口为例,实现功能

链接地址: `wss://ws.xxx.com/websocket`

## 使用方法

1. 终端执行命令安装模块<sapn class="marker-evy">（如若创建项目时已选择了该模块，可略过这一步）</sapn>
```bash
fcuni c websocket
```

2. `src/modules/network/websocket.ts`文件中配置WebSocket模块。
```ts:line-numbers
import { useAuthStore } from "@/modules/stores/auth";   // 引入auth模块的store，用于设置token

const DevURL = "wss://ws.xxx.com/websocket"  // 开发环境url
const ProURL = "wss://ws.yyy.com/websocket"  // 生产环境url

/**
 * WebSocket 工具类实例
 */
export default new FC.WebSocket({
    url: process.env.NODE_ENV === 'production' ? ProURL : DevURL,
    heartTime: 5,                   // 心跳时间间隔，单位秒
    heartMessage: 'ping',           // 心跳发送消息
    maxReconnectAttempts: 3,        // 最大重连次数
    reconnectDelay: 3000,           // 重连延迟时间，单位毫秒
    maxReconnectDelay: 30000,       // 最大重连延迟时间，单位毫秒
    reconnectDelayMultiplier: 2,    // 重连延迟时间
    heartTimeoutTime: 10,           // 心跳超时时间，单位秒
    // 请求拦截器，用于在连接前修改WebSocket连接配置，如添加header,子协议等
    requestInterceptors: (config: UniApp.ConnectSocketOption) => {
        // 示例：添加自定义header
        config.header = {
            ...config.header,
            'Authorization': 'Bearer ' + useAuthStore().token,
            'Custom-Header': 'custom-value'
        };
    },
} as FCType.WebSocketConfig);
```

上面配置了WebSocket模块的基本功能。
- `url`：WebSocket连接地址，根据环境变量判断使用开发环境还是生产环境地址。
- `heartTime`：心跳时间间隔，单位秒，默认5秒。
- `heartMessage`：心跳发送消息，默认`ping`。
- `maxReconnectAttempts`：最大重连次数，默认3次。
- `reconnectDelay`：重连延迟时间，单位毫秒，默认3000毫秒。
- `maxReconnectDelay`：最大重连延迟时间，单位毫秒，默认30000毫秒。
- `reconnectDelayMultiplier`：重连延迟时间 multiplier，默认2倍。
- `heartTimeoutTime`：心跳超时时间，单位秒，默认10秒。
- `requestInterceptors`：请求拦截器，用于在连接前修改WebSocket连接配置，如添加header,子协议等。

::: warning 提示
以上配置都是可选项。
:::

::: tip 提示
如果项目需要链接多个不同的接口，并且每个接口配置不同，可以 `new` 多个 `FC.WebSocket` 实例。
:::

3. 在需要的地方，使用链接，监听，发送，断开链接等方法
```ts:line-numbers
// 引入WebSocket模块
import websocket from "@/modules/network/websocket";

// 链接
websocket.connect()

// 监听消息
websocket.onMessage((data) => {
    console.log('收到消息:', data);
})

// 发送消息
websocket.send('Hello, WebSocket!');

// 断开链接
websocket.disconnect()
```

## 模块属性

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| `url` | `string` | WebSocket连接地址 |
| `heartTime` | `number` | 心跳发送的间隔时间（秒），如果设置为0，则不启用心跳检测 |
| `heartMessage` | `string` | 心跳消息内容，默认值为 'ping' |
| `maxReconnectAttempts` | `number` | 最大重连次数，默认值为 5，设置为 -1 表示无限重连 |
| `reconnectDelay` | `number` | 初始重连延迟（毫秒），默认值为 3000 |
| `maxReconnectDelay` | `number` | 最大重连延迟（毫秒），默认值为 30000 |
| `reconnectDelayMultiplier` | `number` | 重连延迟增长倍数，默认值为 2 |
| `heartTimeoutTime` | `number` | 心跳超时时间（秒），默认值为 heartTime * 2 |
| `requestInterceptors` | `(config: UniApp.ConnectSocketOption) => void` | 请求拦截器 |
| `onOpen` | `(event: any) => void` | 连接成功回调 |
| `onMessage` | `(message: string) => void` | 消息接收回调 |
| `onError` | `(error: UniApp.GeneralCallbackResult) => void;` | 错误回调 |
| `onClose` | `(event: any) => void` | 关闭回调 |
| `onReconnectAttempt` | `(attempt: number, delay: number) => void` | 重连尝试回调 |
| `onReconnectSuccess` | `() => void` | 重连成功回调 |
| `onReconnectFailed` | `(totalAttempts: number) => void` | 重连失败回调 |

## 移除模块

如果项目不需要 WebSocket 模块，或使用其它封装的 WebSocket，可以在终端执行
```bash
fcuni d websocket
```
并移除相关代码
