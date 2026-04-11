# 常见问题

## 如何更新uniapp版本依赖

uniapp官方不定时升级[HBuilder X版本](https://www.dcloud.io/hbuilderx.html)，同时也会升级uniapp版本依赖。FC-UniApp是根据vue-cli命令行创建的项目，[官方文档](https://uniapp.dcloud.net.cn/quickstart-cli.html),与官网不同，请按照下面方法进行升级。（以4.87升级到5.06为例）

1. 升级HBuilder X版本（以正式版的5.06为例）

![1](/problem/1.png)

2. 在[npmjs @dcloudio/uni-app](https://www.npmjs.com/package/@dcloudio/uni-app?activeTab=versions) 查找所需的版本，把版本号复制下来。

   例如下图中的`3.0.0-5000620260331001	`

   ![2](/problem/2.png)
   ::: warning 提示
   3.0.0表示是vue3。2.0.0表示是vue2。

   alpha表示的是开发版，对应的是HBuilder X的alpha版本。没有alpha则表示正式版。

   50006表示的是5.06版本

   一定要选择正确的版本。
   :::

3. 在项目根目录下的`package.json`文件中，把旧版本`3.0.0-4080720251210001`全部替换为最新版本`3.0.0-5000620260331001`，然后保存。

![3](/problem/3.png)

4. 把项目根目录下的`node_modules`文件夹和`package-lock.json`文件删除。注意不要删错了。

5. 重新安装依赖。`npm i` 即可。

## 如何使用插件市场中的插件

像官网介绍的那样，直接在插件市场中搜索插件，安装即可。安装的插件在`/src/uni_modules`文件夹下。
