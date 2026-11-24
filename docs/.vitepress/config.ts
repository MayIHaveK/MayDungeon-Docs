import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'MayDungeon',
  description: 'JavaScript 驱动的 Minecraft 地牢副本插件',
  lang: 'zh-CN',
  base: '/MayDungeon-Docs/',

  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/installation' },
      { text: '脚本引擎', link: '/guide/script-engine' },
      { text: '脚本 API', link: '/api/overview' },
      { text: '示例', link: '/examples/' },
      { text: '常见问题', link: '/faq' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '入门',
          items: [
            { text: '安装与 Java 选型', link: '/guide/installation' },
            { text: '快速开始', link: '/guide/quick-start' },
            { text: '创建副本 (v2 单包)', link: '/guide/create-dungeon' },
            { text: '配置文件 (v2 统一)', link: '/guide/config' },
            { text: '界面配置', link: '/guide/gui-config' }
          ]
        },
        {
          text: '副本功能与脚本',
          items: [
            { text: '脚本引擎与跨插件/Mod', link: '/guide/script-engine' },
            { text: '事件脚本与单文件写法', link: '/guide/events' },
            { text: '预设模板', link: '/guide/presets' },
            { text: '怪物系统', link: '/guide/monsters' },
            { text: '组队系统', link: '/guide/teams' },
            { text: '世界 Boss', link: '/guide/world-boss' }
          ]
        },
        {
          text: '玩法限制',
          items: [
            { text: '进入条件', link: '/guide/conditions' },
            { text: '体力系统', link: '/guide/stamina' },
            { text: '复活币', link: '/guide/revive-coin' }
          ]
        },
        {
          text: '服主运维',
          items: [
            { text: '世界管理与槽位引擎', link: '/guide/world-management' },
            { text: '可视化编辑器', link: '/guide/editor' },
            { text: '关服与恢复', link: '/guide/recovery' },
            { text: '性能调优', link: '/guide/performance' }
          ]
        }
      ],
      '/api/': [
        {
          text: '核心脚本 API',
          items: [
            { text: '总览', link: '/api/overview' },
            { text: 'dungeon 副本', link: '/api/dungeon' },
            { text: 'players 玩家', link: '/api/players' },
            { text: 'monsters 怪物', link: '/api/monsters' },
            { text: 'obstacles 障碍物', link: '/api/obstacles' },
            { text: 'areas 区域', link: '/api/areas' },
            { text: 'tasks 定时任务', link: '/api/tasks' },
            { text: 'world 世界', link: '/api/world' },
            { text: 'holograms 全息文字', link: '/api/holograms' },
            { text: 'npc NPC', link: '/api/npc' },
            { text: 'ranking 伤害排行', link: '/api/ranking' },
            { text: 'utils 工具与互操作', link: '/api/utils' }
          ]
        },
        {
          text: 'v2 扩展脚本 API',
          items: [
            { text: 'bossbar Boss血条', link: '/api/bossbar' },
            { text: 'scoreboard 侧边栏', link: '/api/scoreboard' },
            { text: 'stages 声明式阶段', link: '/api/stages' },
            { text: 'combat 战斗与粒子特效', link: '/api/combat' },
            { text: 'loot 掉落表与发奖', link: '/api/loot' },
            { text: 'blocks 方块机关与回滚', link: '/api/blocks' },
            { text: 'records 首通与竞速榜', link: '/api/records' }
          ]
        },
        {
          text: '命令与变量',
          items: [
            { text: '命令列表', link: '/api/commands' },
            { text: '权限节点', link: '/api/permissions' },
            { text: 'PlaceholderAPI', link: '/api/placeholders' }
          ]
        }
      ],
      '/examples/': [
        {
          text: '示例副本',
          items: [
            { text: '示例索引', link: '/examples/' },
            { text: '简单副本', link: '/examples/simple' },
            { text: '多阶段 Boss 战', link: '/examples/boss-fight' },
            { text: '世界 Boss', link: '/examples/world-boss' },
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
      message: 'MayDungeon 使用文档',
      copyright: 'Copyright © 2026 MayIHaveK'
    },

    search: { provider: 'local' },
    outline: { label: '目录', level: [2, 3] },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '最后更新' }
  }
})
