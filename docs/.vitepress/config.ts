import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'MayDungeon',
  description: 'JS 驱动的 Minecraft 地牢副本插件',
  lang: 'zh-CN',
  base: '/MayDungeon-Docs/',

  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/installation' },
      { text: 'API', link: '/api/overview' },
      { text: '示例', link: '/examples/' },
      { text: 'FAQ', link: '/faq' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '入门',
          items: [
            { text: '安装', link: '/guide/installation' },
            { text: '快速开始', link: '/guide/quick-start' },
            { text: '创建副本', link: '/guide/create-dungeon' },
            { text: '配置文件', link: '/guide/config' }
          ]
        },
        {
          text: '核心概念',
          items: [
            { text: '事件系统', link: '/guide/events' },
            { text: '预设模板', link: '/guide/presets' },
            { text: '怪物系统', link: '/guide/monsters' },
            { text: '组队系统', link: '/guide/teams' },
            { text: '世界 Boss', link: '/guide/world-boss' }
          ]
        },
        {
          text: '系统机制',
          items: [
            { text: '进入条件', link: '/guide/conditions' },
            { text: '体力系统', link: '/guide/stamina' },
            { text: '复活币', link: '/guide/revive-coin' }
          ]
        },
        {
          text: '进阶',
          items: [
            { text: '世界管理', link: '/guide/world-management' },
            { text: '编辑模式', link: '/guide/editor' },
            { text: '崩服恢复', link: '/guide/recovery' },
            { text: '性能优化', link: '/guide/performance' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'JS API 参考',
          items: [
            { text: '总览', link: '/api/overview' },
            { text: 'dungeon 副本', link: '/api/dungeon' },
            { text: 'players 玩家', link: '/api/players' },
            { text: 'monsters 怪物', link: '/api/monsters' },
            { text: 'obstacles 障碍物', link: '/api/obstacles' },
            { text: 'areas 区域', link: '/api/areas' },
            { text: 'tasks 任务', link: '/api/tasks' },
            { text: 'world 世界', link: '/api/world' },
            { text: 'holograms 全息', link: '/api/holograms' },
            { text: 'npc NPC', link: '/api/npc' },
            { text: 'ranking 伤害排行', link: '/api/ranking' },
            { text: 'utils 工具', link: '/api/utils' }
          ]
        },
        {
          text: '命令与权限',
          items: [
            { text: '命令列表', link: '/api/commands' },
            { text: '权限节点', link: '/api/permissions' },
            { text: '占位符', link: '/api/placeholders' }
          ]
        }
      ],
      '/examples/': [
        {
          text: '示例副本',
          items: [
            { text: '示例索引', link: '/examples/' },
            { text: '简单副本', link: '/examples/simple' },
            { text: '多阶段Boss战', link: '/examples/boss-fight' },
            { text: '世界 Boss 示例', link: '/examples/world-boss' },
            { text: '解谜副本', link: '/examples/puzzle' },
            { text: '生存挑战', link: '/examples/survival' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/MayIHaveK/MayDungeon' }
    ],

    footer: {
      message: 'MayDungeon - 用 JavaScript 创造无限可能的副本',
      copyright: 'Copyright © 2025 MayIHaveK'
    },

    search: {
      provider: 'local'
    },

    outline: {
      label: '目录',
      level: [2, 3]
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    lastUpdated: {
      text: '最后更新'
    }
  }
})
