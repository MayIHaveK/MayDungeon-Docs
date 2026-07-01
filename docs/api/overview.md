# JS API 总览

MayDungeon 为每个副本脚本注入以下全局对象，你可以在任何事件脚本中直接使用它们。

## 可用对象

| 对象 | 用途 | 示例 |
|------|------|------|
| `dungeon` | 副本控制 | `dungeon.end(true)` |
| `players` | 玩家操作 | `players.sendTitle(...)` |
| `monsters` | 怪物管理 | `monsters.spawnMythic(...)` |
| `obstacles` | 障碍物 | `obstacles.remove("gate")` |
| `areas` | 区域系统 | `areas.define("room", ...)` |
| `tasks` | 定时任务 | `tasks.startRepeating(...)` |
| `world` | 世界操作 | `world.setTime(14000)` |
| `holograms` | 全息文字 | `holograms.create(...)` |
| `npc` | NPC系统 | `npc.create(...)` |
| `utils` | 工具方法 | `utils.delay(20, fn)` |
| `trigger` | 触发者 | `trigger.getPlayerName()` |
| `print` | 控制台日志 | `print("hello")` |

## 事件脚本

副本生命周期中，插件会在关键节点自动执行对应的 JS 文件：

| 脚本文件 | 触发时机 | trigger |
|----------|---------|---------|
| `on_init.js` | 世界加载完成，玩家传入前 | null |
| `on_start.js` | 玩家已传入副本 | null |
| `on_player_join.js` | 玩家加入副本 | 加入的玩家 |
| `on_player_rejoin.js` | 玩家重连 | 重连的玩家 |
| `on_monster_kill.js` | 怪物死亡 | 击杀者（可能null） |
| `on_group_clear.js` | 怪物组全灭 | null |
| `on_player_death.js` | 玩家死亡 | 死亡的玩家 |
| `on_area_enter.js` | 玩家进入区域 | 进入的玩家 |
| `on_interact.js` | 右键方块 | 交互的玩家 |
| `on_entity_interact.js` | 右键实体/NPC | 交互的玩家 |
| `on_reward.js` | 通关（仅成功时） | null |
| `on_complete.js` | 副本成功 | null |
| `on_fail.js` | 副本失败 | null |
| `on_end.js` | 副本结束（统一收尾） | null |

## 脚本安全

所有脚本自动包含错误保护。即使脚本内部出错（如访问 null 变量），副本也会继续运行，不会崩溃。错误信息会打印到控制台（开启 debug 模式可看完整堆栈）。

## 下一步

查看各个 API 对象的详细文档：

- [dungeon 副本控制](/api/dungeon)
- [monsters 怪物管理](/api/monsters)
- [world 世界操作](/api/world)
