# 目录结构

FC-Uniapp 外层目录是预定好的，一般情况下无需修改。主要展示`src`目录下的文件结构。
```tree
.
├── App.vue                     # 应用入口文件
├── components                  # uniapp全局组件目录,自动导入
│   └── FcBaseView              # FC-Uniapp基础视图组件，使用切换主题功能会用到。
│       └── FcBaseView.vue
├── env.d.ts                    # vue文件，环境变量类型定义文件
├── main.ts                     # 应用入口文件，初始化应用
├── manifest.json               # uniapp项目配置文件
├── modules                     # FC-Uniapp应用模块配置目录
│   ├── network                 # FC-Uniapp网络配置目录
│   │   ├── apis.ts             # 请求接口文件
│   │   └── request.ts          # FC-Uniapp网络请求模块配置文件
│   ├── router                  # FC-Uniapp路由模块配置目录
│   │   └── index.ts
│   ├── style                   # FC-Uniapp样式模块配置目录
│   │   ├── app.scss            # 全局样式文件
│   │   └── unocss.config.ts    # unocss配置文件
│   └── types.ts                # 自定义类型文件
├── pages                       # uniapp页面目录
│   └── index
│       └── index.vue
├── pages.json                  # uniapp页面配置文件
├── shime-uni.d.ts              # uniapp类型定义文件
├── static                      # uniapp静态资源目录
│   └── logo.png
├── uni.scss                    # uniapp全局样式文件
└── uni_modules                 # uniapp插件模块目录
```

可以看到，目录结构和`uniapp`项目的目录结构是一致的。主要关注下`modules`目录。

`modules`目录是FC-Uniapp应用模块配置目录，使用FC-Uniapp提供的模块功能，如：`路由模块`、`样式模块`、`网络请求`等等。后续都需要在该目录下配置模块。
