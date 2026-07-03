# 事件系统

MayDungeon 使用事件驱动模型，副本在关键节点自动执行对应的 JS 脚本文件。

## 事件列表

副本 `scripts/` 目录下的每个 JS 文件对应一个事件：

| 脚本文件 | 触发时机 | trigger 对象 |
|----------|----------|--------------|
| `on_init.js` | 世界加载完成，玩家传入前 | null |
| `on_start.js` | 玩家已传入副本，副本正式开始 | null |
| `on_player_join.js` | 玩家首次加入副本 | 加入的玩家 |
| `on_player_rejoin.js` | 玩家断线重连回副本 | 重连的玩家 |
| `on_player_quit.js` | 玩家退出副本 | 退出的玩家 |
| `on_player_death.js` | 玩家死亡 | 死亡的玩家 |
| `on_monster_kill.js` | 怪物被击杀 | 击杀者（可能 null） |
| `on_group_clear.js` | 怪物组全部清除 | null |
| `on_area_enter.js` | 玩家进入已定义区域 | 进入的玩家 |
| `on_area_leave.js` | 玩家离开已定义区域 | 离开的玩家 |
| `on_interact.js` | 玩家右键方块 | 交互的玩家 |
| `on_entity_interact.js` | 玩家右键实体/NPC | 交互的玩家 |
| `on_reward.js` | 副本通关（仅成功时触发） | null |
| `on_complete.js` | 副本判定为成功 | null |
| `on_fail.js` | 副本判定为失败 | null |
| `on_end.js` | 副本结束（统一收尾，无论成功失败） | null |

## trigger 对象

当事件与特定玩家相关时，`trigger` 对象可用于获取触发者信息：

```javascript
// on_player_death.js
var playerName = trigger.getPlayerName();
dungeon.broadcast("&c" + playerName + " 阵亡了！");
```

无关联玩家的事件中 `trigger` 为 null，使用前无需判空（不会报错，但调用方法会返回空值）。

## 事件上下文数据

部分事件会通过 `dungeon.getData()` 提供额外上下文：

| 事件 | 数据 key | 说明 |
|------|----------|------|
| `on_area_enter` / `on_area_leave` | `_area_name` | 触发区域名称 |
| `on_group_clear` | `_group_name` | 被清除的怪物组名 |
| `on_monster_kill` | `_monster_type` | 被击杀怪物类型 |
| `on_entity_interact` | `_interact_npc_id` | 被交互的 NPC ID |

## 执行顺序

```
on_init → on_player_join(×N) → on_start → [运行时事件] → on_complete/on_fail → on_reward(仅成功) → on_end
```

## 使用示例

### 完整副本流程

```javascript
// on_init.js
areas.define("boss_room", "100,60,100", "130,80,130");
obstacles.define("gate", "99,60,114", "99,64,116", "IRON_BARS");
dungeon.setBlockBreak(false);
world.setTime(18000);
```

```javascript
// on_start.js
dungeon.broadcast("&a副本开始！前往标记点消灭怪物！");
monsters.spawnMultiple("wave1", "ZOMBIE", "110,65,110", 10, 5);
tasks.startRepeating("guide", 40, function() {
    world.drawPathToAll("115,65,115", 0, 255, 0, 0.5, 30);
});
```

```javascript
// on_group_clear.js
var group = dungeon.getData("_group_name");
if (group == "wave1") {
    obstacles.remove("gate");
    dungeon.broadcast("&a大门开启！Boss 房间已解锁！");
    monsters.spawnMythic("boss", "DragonKing", "115,65,115", 1, 0);
}
if (group == "boss") {
    dungeon.broadcast("&6恭喜通关！");
    dungeon.endWithDelay(true, 5);
}
```

```javascript
// on_player_death.js
var name = trigger.getPlayerName();
dungeon.broadcast("&c" + name + " 倒下了！存活: " + players.getAliveCount());
if (players.areAllDead()) {
    dungeon.end(false);
}
```

## 注意事项

- 事件脚本文件不存在时会被安全忽略，不会报错
- 脚本内部异常会被捕获并输出到控制台，不会导致副本崩溃
- 避免在事件脚本中执行死循环或极耗时操作
- 每个脚本文件独立执行，变量不在脚本间共享（使用 `dungeon.setData` 传递数据）
