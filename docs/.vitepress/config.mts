import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "FC-Uniapp",
    description: "uniapp快速开发框架",
    base: "/fc-uniapp-doc/",
    head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
    cleanUrls: true,
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        logo: { src: '/favicon.ico', type: "image/png", width: 24, height: 24 },
        nav: [
            { text: '指南', link: '/guide/introduce/install' },
            { text: '模板', link: '/template' },
            { text: '插件市场', link: 'https://ext.dcloud.net.cn/plugin?id=26616' },
        ],

        outline: 'deep',    // 侧边栏目录深度

        search: {
            provider: 'local',
            options: {
                locales: {
                    root: {
                        translations: {
                            button: {
                                buttonText: '搜索文档',
                                buttonAriaLabel: '搜索文档'
                            },
                            modal: {
                                noResultsText: '无法找到相关结果',
                                resetButtonTitle: '清除查询条件',
                                footer: {
                                    selectText: '选择',
                                    navigateText: '切换',
                                    closeText: '关闭'
                                }
                            }
                        }
                    }
                }
            }
        },

        sidebar: {
            '/guide/': {
                base: '/guide/',
                items: [
                    {
                        base: "/guide/introduce",
                        text: "简介",
                        collapsed: false,
                        items: [
                            { text: '什么是FC-Uniapp?', link: '/index' },
                            { text: '安装使用', link: '/install' },
                            { text: '目录结构', link: '/directory' },
                        ]
                    },
                    {
                        base: "/guide/base",
                        text: "基础功能",
                        collapsed: false,
                        items: [
                            { text: 'Pinia持久化存储', link: '/pinia' },
                            { text: '路由跳转和拦截', link: '/router' },
                            { text: '自定义图标/字体', link: '/iconfont' },
                            { text: '应用主题', link: '/theme' },
                            { text: '多语言', link: '/language' },
                            { text: '网络请求', link: '/request' },
                            { text: '网络上传', link: '/upload' },
                            { text: '网络下载', link: '/download' },
                            { text: 'WebSocket长链接', link: '/websocket' },
                            { text: '工具类', link: '/util' },
                        ]
                    },
                    {
                        base: "/guide/app",
                        text: "APP/小程序专题",
                        collapsed: false,
                        items: [
                            { text: '隐私协议弹窗', link: '/privacy' },
                            { text: '系统权限', link: '/permission' },
                            { text: '应用更新', link: '/update' },
                            { text: '极光推送', link: '/jgpush' },
                        ]
                    },
                    {
                        text: '常见问题',
                        link: '/problem'
                    }
                ]
            }
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/lfcleo/fc-uniapp' },
            { icon: 'gitee', link: 'https://gitee.com/lfcleo/fc-uniapp' },
        ]
    }
})
