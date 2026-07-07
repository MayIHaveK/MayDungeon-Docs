# 示例副本

本节提供完整的副本脚本示例，帮助你快速理解 MayDungeon 的开发流程。

## 示例列表

### [简单副本](/examples/simple)
一个最基础的副本示例，包含怪物生成、击杀计数和通关逻辑。适合初学者了解基本结构。

### [Boss 战](/examples/boss-fight)
包含 Boss 战机制的普通副本，演示多阶段 Boss、技能释放和团队配合。

### [世界 Boss 示例](/examples/world-boss)
定时开放的全服 Boss 活动示例，演示 `WORLD_BOSS` 配置、共享实例、伤害排行和排行奖励。

### [解谜副本](/examples/puzzle)
以机关解谜为核心的副本，演示区域检测、障碍物控制和交互触发器。

### [生存挑战](/examples/survival)
限时生存类副本，演示波次系统、难度递增和排行榜功能。

## 如何运行示例

1. 将示例文件复制到 `plugins/MayDungeon/dungeons/` 下
2. 准备对应的模板世界
3. 执行 `/md admin reload`
4. 普通副本使用 `/md start <ID>` 创建并进入；世界 Boss 先由调度器或 `/md admin worldboss start <ID>` 开放，再用 `/md start <ID>` 加入

## 示例项目结构

```
dungeons/
└── example_simple/
    ├── dungeon.yml
    └── script.js
```

## 注意

示例中的坐标需要根据你的实际模板世界进行调整。模板世界需要自行构建，示例仅提供脚本逻辑参考。
