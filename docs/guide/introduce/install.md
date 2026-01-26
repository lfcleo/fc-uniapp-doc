# 安装使用

使用 crate-fc-uniapp 脚手架创建项目，可以对默认集成的模块进行自定义选择。

## 安装
终端执行脚手架安装

```bash
npm create fc-uniapp
```
根据指示输入项目名称、所需功能模块。等待项目创建完成后执行

```bash
# 进入项目目录
cd <项目名称>

# 安装依赖
npm i
```

## 运行

建议运行项目前，先更换下`manifest.json`->`基础配置`->`uni-app应用标识(AppID)`->`重新获取`。避免后续使用部分功能时，出现错误。

使用HBuilderX运行项目 也可使用uni-app命令行工具运行项目。

## 默认集成模块

| 模块 | 说明 | 是否默认集成 | 是否可移除 |
| :---: | :---: | :---: | :---: |
| `FC.Store` | 状态管理模块 | √ | x |
| `FC.Router` | 路由模块 | √ | x |
| `FC.Request` | 网络请求模块 | x | √ |
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