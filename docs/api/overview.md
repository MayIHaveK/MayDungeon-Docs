# JS API 总览

MayDungeon 为每个副本脚本注入以下全局对象，你可以在任何事件脚本中直接使用它们。

## 通用约定

- **位置参数**：字符串格式 `"x,y,z"`
- **颜色代码**：使用 `&` 前缀（如 `&c` 红色、`&a` 绿色）
- **时间参数**：以 tick 为单位（20 tick = 1 秒）
- **材质名称**：大写英文（如 `"STONE"`、`"DIAMOND_SWORD"`）

## 可用对象

| 对象 | 用途 | 示例 |
|------|------|------|
| `dungeon` | 副本控制与状态 | `dungeon.end(true)` |
| `players` | 玩家批量操作 | `players.teleportAll("0,65,0")` |
| `monsters` | 怪物生成与管理 | `monsters.spawnMythic(...)` |
| `obstacles` | 障碍物区域操作 | `obstacles.remove("gate")` |
| `areas` | 区域定义与检测 | `areas.define("room", ...)` |
| `tasks` | 循环/延迟任务 | `tasks.startRepeating(...)` |
| `world` | 世界环境操作 | `world.setTime(14000)` |
| `utils` | 通用工具方法 | `utils.delay(20, fn)` |
| `holograms` | 全息文字（需DecentHolograms） | `holograms.create(...)` |
| `npc` | NPC系统（需Adyeshach） | `npc.create(...)` |
| `ranking` | 伤害排行（世界Boss/DPS统计） | `ranking.getTop(10)` |
| `trigger` | 事件触发者信息；无触发玩家时为 null | `trigger.getPlayerName()` |
| `event` | 部分事件注入的 Java Map 上下文，常见于 `on_damage.js` | `event.get("damage")` |
| `print()` | 控制台日志输出 | `print("hello")` |

## 事件脚本

副本生命周期中，插件会在关键节点自动执行对应的 JS 文件：

| 脚本文件 | 触发时机 | trigger |
|----------|---------|---------|
| `on_init.js` | 世界加载完成，玩家传入前 | null |
| `on_start.js` | 玩家已传入副本 | null |
| `on_player_join.js` | 玩家加入副本 | 加入的玩家 |
| `on_player_rejoin.js` | 玩家重连 | 重连的玩家 |
| `on_player_quit.js` | 玩家退出副本 | 退出的玩家 |
| `on_player_death.js` | 玩家死亡 | 死亡的玩家 |
| `on_monster_kill.js` | 怪物被击杀 | 击杀者（可能null） |
| `on_damage.js` | 玩家对副本实体造成有效伤害 | 造成伤害的玩家，额外注入 `event` Map |
| `on_group_clear.js` | 怪物组全灭 | null |
| `on_area_enter.js` | 玩家进入区域 | 进入的玩家 |
| `on_area_leave.js` | 玩家离开区域 | 离开的玩家 |
| `on_interact.js` | 右键方块 | 交互的玩家 |
| `on_entity_interact.js` | 右键实体/NPC | 交互的玩家 |
| `on_boss_reward.js` | 世界 Boss 成功结束后的专属排行奖励，先于 `on_reward.js` | null |
| `on_reward.js` | 通关（仅成功时） | null |
| `on_complete.js` | 副本成功 | null |
| `on_fail.js` | 副本失败 | null |
| `on_end.js` | 副本结束（统一收尾） | null |

## 脚本安全

所有脚本自动包含错误保护。即使脚本内部出错（如访问 null 变量），副本也会继续运行，不会崩溃。错误信息会打印到控制台（开启 debug 模式可看完整堆栈）。

## 下一步

查看各个 API 对象的详细文档：

- [dungeon 副本控制](dungeon.md)
- [players 玩家操作](players.md)
- [monsters 怪物管理](monsters.md)
- [obstacles 障碍物](obstacles.md)
- [areas 区域系统](areas.md)
- [tasks 定时任务](tasks.md)
- [world 世界操作](world.md)
- [utils 工具方法](utils.md)
- [holograms 全息文字](holograms.md)
- [npc NPC系统](npc.md)
- [ranking 伤害排行](ranking.md)
