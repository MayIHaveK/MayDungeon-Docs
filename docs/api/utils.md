# utils - 工具方法

`utils` 对象提供通用的工具函数，包括延时、随机数、命令执行等。

## 通用约定

- 位置参数格式: `"x,y,z"` | 颜色代码: `&` 前缀 | 时间: tick（20tick=1秒）| 材质: 大写英文

## 方法列表

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `delay(ticks, callback)` | void | 延迟执行回调 |
| `schedule(ticks, repeat, callback)` | int | 创建定时任务，返回任务 ID |
| `cancelSchedule(taskId)` | void | 取消由 schedule 创建的任务 |
| `random(min, max)` | int | 随机整数，范围 [min, max] |
| `randomDouble(min, max)` | double | 随机浮点数，范围 [min, max) |
| `broadcast(msg)` | void | 全服广播消息 |
| `runCommand(cmd)` | void | 以控制台执行命令 |
| `runCommandAsPlayer(name, cmd)` | void | 以指定玩家身份执行命令 |
| `log(msg)` | void | 输出日志到控制台 |

## 使用示例

### 延迟执行

```javascript
function on_start() {
    dungeon.broadcast("&e3秒后开始战斗...");
    utils.delay(60, function() {
        monsters.spawnMultiple("wave1", "ZOMBIE", "100,65,100", 10, 5);
        dungeon.broadcast("&c战斗开始！");
    });
}
```

### 随机事件

```javascript
function on_monster_kill() {
    var roll = utils.random(1, 100);
    if (roll <= 10) {
        // 10% 概率掉落额外奖励
        var player = trigger.getPlayerName();
        utils.runCommandAsPlayer(player, "give " + player + " diamond 1");
        dungeon.broadcast("&6" + player + " 获得了额外奖励！");
    }
}
```

### 自定义定时器

```javascript
function on_start() {
    var taskId = utils.schedule(100, true, function() {
        var count = monsters.getAliveCount("enemies");
        dungeon.broadcast("&7剩余怪物: &c" + count);
        if (count == 0) {
            utils.cancelSchedule(taskId);
        }
    });
}
```

## 注意事项

- `delay` 是一次性延迟，`schedule` 可通过 `repeat` 参数决定是否循环
- `schedule` 返回任务 ID，需保存以便后续取消
- `random(min, max)` 包含两端（闭区间），`randomDouble` 不包含 max（左闭右开）
- `broadcast` 是全服广播，与 `dungeon.broadcast` 不同（后者仅副本内）
- `runCommand` 以控制台权限执行，`runCommandAsPlayer` 以玩家权限执行
- `log` 输出到服务器控制台，用于调试
