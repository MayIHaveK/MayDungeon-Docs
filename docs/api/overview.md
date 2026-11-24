# JS API 总览

MayDungeon v2 为每个副本脚本（无论是新一代单文件 `scripts/dungeon.js` 还是传统 `on_*.js`）自动注入以下全局对象与跨插件/Mod 互操作能力。

## 通用约定

- **位置参数**：字符串格式 `"x,y,z"`（部分新 API 如 `combat` / `blocks` 也直接支持数值坐标或 `Location`）
- **颜色代码**：使用 `&` 前缀（如 `&c` 红色、`&a` 绿色）
- **时间参数**：除注明秒/毫秒的方法外，以 tick 为单位（20 tick = 1 秒）
- **材质名称**：大写英文（如 `"STONE"`、`"DIAMOND_SWORD"`）

## 可用对象（共 18 个核心/扩展 API + 工具函数）

### 原有核心 API（100% 向后兼容）

| 对象 | 用途 | 示例 |
|---|---|---|
| `dungeon` | 副本控制、状态与 `getConfig()` 配置读取 | `dungeon.end(true)` / `dungeon.getConfigInt("time-limit", 600)` |
| `players` | 玩家批量操作与发物品 | `players.teleportAll("0,65,0")` |
| `monsters` | 怪物生成与管理（原版 + MythicMobs） | `monsters.spawnMythic(...)` |
| `obstacles` | 障碍物区域操作 | `obstacles.remove("gate")` |
| `areas` | 区域定义与检测 | `areas.define("room", ...)` |
| `tasks` | 循环/延迟任务 | `tasks.startRepeating(...)` |
| `world` | 世界环境操作与粒子 | `world.setTime(14000)` |
| `utils` | 通用工具 + 跨插件/Mod 探针 | `utils.delay(20, fn)` / `utils.getPlugin("Vault")` |
| `holograms` | 全息文字（需 DecentHolograms） | `holograms.create(...)` |
| `npc` | NPC 系统（需 Adyeshach） | `npc.create(...)` |
| `ranking` | 伤害排行（世界 Boss / DPS 统计） | `ranking.getTop(10)` |

### v2 新增扩展 API

| 对象 | 用途 | 示例 |
|---|---|---|
| [`bossbar`](bossbar.md) | 动态 Boss 血条、阶段条与倒计时条 | `bossbar.countdown("t", "&e剩余 %time%s", 300, "BLUE")` |
| [`scoreboard`](scoreboard.md) | 副本侧边栏 HUD（支持 PAPI 与离本还原） | `scoreboard.show("&6副本", ["&7阶段: 1"])` |
| [`stages`](stages.md) | 声明式多阶段/波次编排与清场自动推进 | `stages.define("wave1", { group: "g1", next: "boss" })` |
| [`combat`](combat.md) | AOE/真伤、药水、位移、冷却与粒子预警圈 | `combat.telegraph(0, 65, 0, 4, 40, "FLAME", fn)` |
| [`loot`](loot.md) | 权重掉落表、首通奖励与多源发奖 | `loot.grantTable(players.getAll(), "clear", 2)` |
| [`blocks`](blocks.md) | 方块机关门与差分自动回滚 | `blocks.openDoor("gate", 0, 65, 0, 0, 68, 2)` |
| [`records`](records.md) | 通关统计、首通判定、竞速榜与个人 KV | `records.recordClear(players.getAll(), dungeon.getElapsedTime())` |

### 运行时上下文与模块工具

| 标识符 | 用途 |
|---|---|
| `trigger` | 事件触发者信息；无触发玩家时为 `null` |
| `event` | 事件上下文 Map（如 `on_damage` 的 `damage`、`on_group_clear` 的 `group`） |
| `print(...)` | 控制台日志输出 |
| `require(path)` | 加载 `plugins/MayDungeon/libs/<path>.js` 跨副本共享库或 `./相对路径` |
| `defineDungeon(hooks)` | 在单文件 `scripts/dungeon.js` 中一次性注册全部生命周期钩子 |
| `Java.type(className)` | **原生跨插件与跨 Forge/Mohist/NeoForge/Fabric Mod 类访问**（GraalJS 与 Nashorn 均兼容） |

## 进一步阅读

- [脚本引擎、Java 选型与 Java.type 跨插件/Mod 互操作](/guide/script-engine)
- [事件脚本、单文件写法与难度级联继承](/guide/events)
