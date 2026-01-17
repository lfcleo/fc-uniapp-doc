# 工具类

FC-Uniapp 提供了一些比较实用的工具类，用于简化开发过程。持续更新

终端执行
```bash
fcuni c utils
```

## 防抖

防抖是指在事件触发后，等待一定时间后再执行回调函数。如果在等待时间内事件再次触发，则重新计时。

```ts 
<button type="primary" class="mt-20rpx w-full" @click="testDebounce">同步防抖</button>
<button type="primary" class="mt-20rpx w-full" @click="testAsyncDebounce">异步防抖</button>
...
// 使用防抖函数包装同步方法
const testDebounce = FC.Utils.debounce(() => {
    uni.showToast({
        title: "同步防抖测试执行了",
        icon: "none"
    })
    // 这里可以添加实际的同步操作
}, 500, false);

// 使用防抖函数包装异步API调用
const testAsyncDebounce = FC.Utils.debounce(async () => {
    try {
        const result = await apiTestGet();
        console.log('异步防抖API结果:', result);
        uni.showToast({
            title: "异步防抖网络请求成功",
            icon: "none"
        })
    } catch (error) {
        console.error('API请求失败:', error);
    }
}, 500, false);
```

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| `args` | `Function` | 要包装的函数 |
| `delay` | `number` | 等待时间，单位毫秒,默认500毫秒 |
| `immediate` | `boolean` | 是否立即执行第一次调用 |

## 节流

节流是指在事件触发后，等待一定时间后再执行回调函数。如果在等待时间内事件再次触发，则忽略该次触发。

```ts 
<button type="primary" class="mt-20rpx w-full" @click="testThrottle">同步节流</button>
<button type="primary" class="mt-20rpx w-full" @click="testAsyncThrottle">异步节流</button>
...
// 使用节流函数包装同步方法
const testThrottle = FC.Utils.throttle(() => {
    uni.showToast({
        title: "同步节流测试执行了",
        icon: "none"
    })
    // 这里可以添加实际的同步操作
}, 1000);

// 使用节流函数包装异步API调用
const testAsyncThrottle = FC.Utils.throttle(async () => {
    try {
        console.log('开始节流调用API接口');
        const result = await apiTestGet();
        console.log('异步节流API结果:', result);
        uni.showToast({
            title: "异步节流网络请求成功",
            icon: "none"
        })
    } catch (error) {
        console.error('节流API请求失败:', error);
    }
});
```

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| `args` | `Function` | 要包装的函数 |
| `delay` | `number` | 等待时间，单位毫秒,默认500 |
| `options.leading` | `boolean` | 是否立即执行第一次调用 |
| `options.trailing` | `boolean` | 是否在等待时间结束后执行最后一次调用 |

