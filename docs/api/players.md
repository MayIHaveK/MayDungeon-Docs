# players - 玩家操作

`players` 对象用于批量操作副本内的玩家，包括传送、物品、游戏模式等。

## 通用约定

- 位置参数格式: `"x,y,z"` | 颜色代码: `&` 前缀 | 时间: tick（20tick=1秒）| 材质: 大写英文

## 方法列表

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `teleportAll(loc)` | void | 传送所有玩家到指定位置 |
| `teleport(name, loc)` | void | 传送指定玩家到指定位置 |
| `giveItem(material, amount)` | void | 给所有玩家物品 |
| `removeItemsByLore(text)` | void | 移除所有玩家背包中含指定 Lore 文本的物品 |
| `setGameMode(mode)` | void | 设置所有玩家游戏模式 |
| `setAliveGameMode(mode)` | void | 仅设置存活玩家的游戏模式 |
| `reviveAll()` | void | 全员复活 |
| `sendMessage(msg)` | void | 向所有玩家发送消息 |
| `sendTitle(title, sub, in, stay, out)` | void | 向所有玩家发送 Title |
| `runCommand(cmd)` | void | 以控制台身份对每位玩家执行命令 |
| `getAliveCount()` | int | 获取存活玩家人数 |
| `getOnlineCount()` | int | 获取在线玩家人数 |
| `areAllDead()` | boolean | 是否全员死亡 |

## 使用示例

### 副本开始时传送并设置模式

```javascript
function on_start() {
    players.teleportAll("100,65,200");
    players.setGameMode("ADVENTURE");
    players.sendTitle("&c战斗开始", "&7准备迎战", 10, 40, 10);
}
```

### 检查全灭条件

```javascript
function on_player_death() {
    if (players.areAllDead()) {
        dungeon.broadcast("&c全员阵亡，副本失败！");
        dungeon.endWithDelay(false, 3);
    }
}
```

### 执行命令与给予物品

```javascript
function on_complete() {
    players.giveItem("DIAMOND", 5);
    players.runCommand("effect give %player% minecraft:regeneration 10 2");
    players.sendMessage("&a通关奖励已发放！");
}
```

## 注意事项

- `runCommand(cmd)` 中使用 `%player%` 占位符，会被替换为每位玩家的名字
- `setGameMode` 参数为字符串：`"SURVIVAL"`、`"ADVENTURE"`、`"CREATIVE"`、`"SPECTATOR"`
- `teleportAll` 和 `teleport` 的位置参数格式为 `"x,y,z"`
- 死亡玩家默认进入旁观模式，使用 `reviveAll()` 可复活全员
