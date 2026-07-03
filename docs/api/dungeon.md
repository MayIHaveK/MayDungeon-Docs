# dungeon - 副本控制

`dungeon` 对象用于控制当前副本的状态、数据和行为，是最核心的 API 对象。

## 通用约定

- 位置参数格式: `"x,y,z"` | 颜色代码: `&` 前缀 | 时间: tick（20tick=1秒）| 材质: 大写英文

## 方法列表

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `getName()` | String | 获取副本 ID |
| `getDisplayName()` | String | 获取副本显示名 |
| `getPlayers()` | List | 所有在线玩家名列表 |
| `getAlivePlayers()` | List | 存活玩家名列表 |
| `getPlayerCount()` | int | 玩家总数 |
| `getData(key)` | Object | 读取运行时数据 |
| `setData(key, value)` | void | 设置运行时数据 |
| `getInt(key, default)` | int | 读取整型数据，不存在返回 default |
| `addInt(key, amount)` | int | 整型数据增量，返回新值 |
| `getKillCount(mobName)` | int | 指定怪物击杀数 |
| `getTotalKills()` | int | 总击杀数 |
| `getQuitCount(playerName)` | int | 指定玩家退出次数 |
| `end(success)` | void | 立即结束副本（true=成功/false=失败） |
| `endWithDelay(success, sec)` | void | 延迟指定秒数后结束副本 |
| `broadcast(msg)` | void | 向副本内所有玩家广播消息 |
| `broadcastTitle(title, sub, in, stay, out)` | void | 发送 Title（淡入/停留/淡出为tick） |
| `getElapsedTime()` | int | 副本已运行时间（秒） |
| `getState()` | String | 副本状态：RUNNING / COMPLETED / FAILED |
| `cancelTask(id)` | void | 取消内部任务 |
| `disbandTeam()` | void | 解散当前队伍 |
| `setBlockBreak(bool)` | void | 允许/禁止破坏方块 |
| `setBlockPlace(bool)` | void | 允许/禁止放置方块 |
| `setPvp(bool)` | void | 允许/禁止 PVP |
| `getParams()` | Object | 获取副本启动参数 |
| `getPresets()` | Object | 获取 presets.yml 全部数据 |
| `getPreset(path)` | Object | 点分路径获取预设值 |

## 使用示例

### 基本副本流程控制

```javascript
function on_start() {
    dungeon.broadcast("&a副本开始！祝你好运！");
    dungeon.broadcastTitle("&6副本开始", "&e消灭所有怪物", 10, 40, 10);
    dungeon.setBlockBreak(false);
    dungeon.setBlockPlace(false);
    dungeon.setPvp(false);
}
```

### 使用运行时数据跟踪进度

```javascript
function on_monster_kill() {
    var phase = dungeon.getInt("phase", 1);
    if (dungeon.getTotalKills() >= phase * 10) {
        dungeon.addInt("phase", 1);
        dungeon.broadcast("&b进入第 " + (phase + 1) + " 阶段！");
    }
}
```

### 延迟结束副本

```javascript
function on_group_clear() {
    if (dungeon.getKillCount("boss") > 0) {
        dungeon.broadcast("&6恭喜通关！5秒后传送回大厅...");
        dungeon.endWithDelay(true, 5);
    }
}
```

## 注意事项

- `end()` 调用后副本立即进入结束流程，后续代码仍会执行但操作可能无效
- `setData` 存储的数据仅在本次副本运行期间有效，副本结束后清除
- `getPreset(path)` 使用点分路径，如 `"boss.health"` 对应 presets.yml 中的嵌套结构
- `broadcastTitle` 的 in/stay/out 参数单位为 tick
