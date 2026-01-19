# 安装使用

## 安装
终端执行下面命令clone项目到本地

```bash
git clone https://github.com/lfcleo/fc-uniapp.git
```

下载成功后，cd进入项目目录，安装项目依赖

```bash
cd fc-uniapp && npm i
```

## 运行

建议运行项目前，先更换下`manifest.json`->`基础配置`->`uni-app应用标识(AppID)`->`重新获取`。避免后续使用部分功能时，出现错误。

使用HBuilderX运行项目 也可使用uni-app命令行工具运行项目。

## 默认集成模块

| 模块 | 说明 | 是否默认集成 | 是否可移除 |
| :---: | :---: | :---: | :---: |
| `FC.Store` | 状态管理模块 | √ | x |
| `FC.Router` | 路由模块 | √ | x |
| `FC.Request` | 网络请求模块 | √ | √ |
| `FC.useSysGlobalStore().theme` | 主题模块 | x | √ |
| `FC.i18n` | 多语言模块 | x | √ |
| `FC.Upload` | 上传模块 | x | √ |
| `FC.Download` | 下载模块 | x | √ |
| `FC.Websocket` |  websocket模块 | x | √ |
| `FC.Utils` |  工具类模块 | x | √ |
| `FC.Authorize` |  系统权限模块 | x | √ |
| `FC.Updated` |  版本更新模块 | x | √ |
| `FC.JGPush` |  极光推送模块 | x | √ |
|  | 自定义iconfont和字体 | x | √ |
|  | 隐私协议弹窗 | x | √ |

## Demo插件地址

提供完整版的demo示例[uniapp插件市场](https://ext.dcloud.net.cn/plugin?id=26616)