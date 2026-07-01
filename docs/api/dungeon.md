# dungeon 副本控制

`dungeon` 对象是脚本中最核心的全局变量，用于控制副本的整体流程。

## 方法一览

| 方法 | 说明 |
|------|------|
| `dungeon.end(success)` | 结束副本，`true` 表示通关成功 |
| `dungeon.fail(reason)` | 立即判定副本失败 |
| `dungeon.setPhase(name)` | 设置当前阶段名（用于脚本逻辑分支） |
| `dungeon.getPhase()` | 获取当前阶段名 |
| `dungeon.getData(key)` | 获取副本自定义数据 |
| `dungeon.setData(key, value)` | 设置副本自定义数据 |
| `dungeon.getElapsedTime()` | 获取副本已运行时间（秒） |
| `dungeon.getTimeLimit()` | 获取副本时间限制（秒） |
| `dungeon.setTimeLimit(seconds)` | 动态修改时间限制 |
| `dungeon.getPlayerCount()` | 获取当前在副本中的玩家数 |
| `dungeon.broadcast(message)` | 向副本内所有玩家发送消息 |
| `dungeon.broadcastTitle(title, subtitle, fadeIn, stay, fadeOut)` | 发送标题 |
| `dungeon.broadcastActionBar(message)` | 发送 ActionBar |
| `dungeon.broadcastSound(sound, volume, pitch)` | 播放音效 |
| `dungeon.getDungeonId()` | 获取副本模板 ID |
| `dungeon.getInstanceId()` | 获取当前实例 UUID |

## 使用示例

```javascript
// on_monster_kill.js - 击杀 Boss 后通关
var killed = dungeon.getData("boss_killed") || 0;
killed++;
dungeon.setData("boss_killed", killed);

if (killed >= 3) {
    dungeon.broadcast("&a所有 Boss 已被击杀！副本通关！");
    dungeon.end(true);
}
```

```javascript
// on_start.js - 设置阶段并限时
dungeon.setPhase("wave_1");
dungeon.setTimeLimit(300); // 5 分钟限时
dungeon.broadcast("&e副本开始！你有 5 分钟完成挑战！");
```

## 注意事项

- `dungeon.end(true)` 会触发 `on_reward.js` → `on_complete.js` → `on_end.js` 的完整流程
- `dungeon.end(false)` 或 `dungeon.fail()` 会触发 `on_fail.js` → `on_end.js`
- `setData` / `getData` 的数据在副本结束后自动清理，不会持久化
