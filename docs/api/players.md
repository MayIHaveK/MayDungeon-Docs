# players 对象

`players` 对象用于管理副本中的所有玩家，提供消息发送、状态控制等功能。

## 方法列表

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `players.all()` | Player[] | 获取所有在副本中的玩家 |
| `players.count()` | int | 当前玩家数量 |
| `players.alive()` | Player[] | 获取存活玩家 |
| `players.dead()` | Player[] | 获取死亡玩家 |
| `players.message(msg)` | void | 向所有玩家发送消息 |
| `players.title(title, subtitle)` | void | 向所有玩家显示标题 |
| `players.actionbar(msg)` | void | 向所有玩家发送 ActionBar |
| `players.sound(sound)` | void | 向所有玩家播放音效 |
| `players.teleport(x, y, z)` | void | 传送所有玩家 |
| `players.give(item, amount)` | void | 给所有玩家物品 |
| `players.effect(type, duration, level)` | void | 给所有玩家药水效果 |
| `players.setGameMode(mode)` | void | 设置游戏模式 |

## 单个玩家对象 (Player)

通过事件参数或 `players.all()` 获取的单个玩家对象：

| 方法 | 说明 |
|------|------|
| `player.getName()` | 获取玩家名 |
| `player.getHealth()` | 获取当前生命值 |
| `player.setHealth(hp)` | 设置生命值 |
| `player.getLocation()` | 获取位置 |
| `player.teleport(x, y, z)` | 传送玩家 |
| `player.message(msg)` | 发送消息 |
| `player.title(title, sub)` | 显示标题 |
| `player.give(item, amount)` | 给予物品 |
| `player.hasItem(item)` | 检查是否持有物品 |
| `player.removeItem(item, amount)` | 移除物品 |

## 使用示例

```javascript
function on_start() {
    players.message("&a副本开始！消灭所有怪物！");
    players.title("&6深渊副本", "&7祝你好运");
    players.sound("ENTITY_ENDER_DRAGON_GROWL");
}

function on_player_death(player) {
    players.message("&c" + player.getName() + " 倒下了！");
    if (players.alive().length === 0) {
        dungeon.fail("全员阵亡");
    }
}
```
