# 自定义图标/字体

| H5 | 安卓 | 苹果 | 鸿蒙 | 微信小程序 | 其它小程序 |
| :---: | :---: | :---: | :---: | :---: | :---: |
| √ | √ | √ | √ | √ | - |

使用iconfont图标/字体，是开发中经常使用到的，有文件和链接两种方式。

文件方式：把图片/字体下载到本地，打包使用

链接方式：在项目中直接引用字体文件的链接，无需下载和打包

一般情况下，在小程序平台会使用链接方式，因为打包的方式会增加包的体积。而小程序的包体大小是有限制的。

下面以[iconfont](https://www.iconfont.cn/)和[阿里妈妈刀隶体](https://www.alibabafonts.com/#/more)为例介绍如何使用。

## 下载iconfont图标和字体文件

### iconfont图标
1. 登录[iconfont](https://www.iconfont.cn/)，选择需要的图标，添加到购物车。
2. 点击购物车，选择`下载代码`。
![iconfont-1.png](/iconfont-1.png)
3. 将字体文件解压，

### 字体文件
1. 打开[阿里妈妈刀隶体](https://www.alibabafonts.com/#/more)，根据下图选择适合自己的方式。
![iconfont-2.png](/iconfont-2.png)
2. 将字体文件解压，

## 选择文件/链接方式

如果使用文件方式，则把解压后的`iconfont.ttf`或`AlimamaDaoLiTi.ttf`文件(名称可能不一样，但要使用`.ttf`文件)复制到项目的`src/static`目录下。

如果使用链接方式，则把解压后的`iconfont.ttf`或`AlimamaDaoLiTi.ttf`文件(名称可能不一样，但要使用`.ttf`文件)上传到服务器，得到图标/字体文件的链接。

## 配置字体文件路径

在`src/modules/style/app.scss`文件中，配置图标/字体。(注意文件名称和链接地址，要替换为自己的链接)
```scss:line-numbers
...
/* 定义自定义图标 */
.iconfont {
    font-family: 'iconfont';
    font-style: normal;
}

/* 定义自定义字体 */
.alimama-daoliti {
    font-family: 'AlimamaDaoLiTiTTF';
}

// 如果是小程序平台，建议从网络中加载图标字体，这样可以节约包的大小
/* #ifdef MP */
@font-face {
    font-family: 'iconfont';
    src: url("https://xxxxxx.com.xxxx.ttf") format('truetype');
}

@font-face {
    font-family: AlimamaDaoLiTiTTF;
    src: url("https://xxxxxx.com.xxxx.ttf") format("woff2");
}

/* #endif */

// 如果不是小程序平台，建议从本地加载图标字体
/* #ifndef MP */
@font-face {
    font-family: 'iconfont';
    src: url('/static/iconfont.ttf');
}

@font-face {
    font-family: AlimamaDaoLiTiTTF;
    src: url('/static/AlimamaDaoLiTi.ttf');
}

/* #endif */
```
上面的配置，从注释中可以看出，在小程序平台使用链接方式加载字体文件，而在其他平台使用文件方式加载字体文件。
但实际开发中，要根据项目的实际情况，选择其一。因为即使在小程序平台使用链接方式，但`src/static`目录下的存在图标/字体文件，也会增加包的体积。

## 使用自定义图标/字体
```vue:line-numbers
<template>
    <!-- 自定义icon -->
    <text class="iconfont" style="font-size: 100rpx;color: red">&#xe6c1</text>
    <!-- 自定义字体 -->
    <text class="alimama-daoliti text-40rpx">阿里妈妈刀隶体-ttf</text>
</template>
```

使用自定义图标/字体时，只需要在`text`标签中添加对应的类名即可。并且还可以设置字体大小、颜色等样式。

`&#xe6c1`是iconfont图标对应的编码，可以在下载文件中的`demo_index.html`中或iconfont网站中查看。