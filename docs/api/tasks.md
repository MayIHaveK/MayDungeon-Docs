# tasks - 定时任务

`tasks` 对象用于创建循环和延迟任务，适用于周期性检测、延时触发等场景。

## 通用约定

- 位置参数格式: `"x,y,z"` | 颜色代码: `&` 前缀 | 时间: tick（20tick=1秒）| 材质: 大写英文

## 方法列表

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `startRepeating(name, ticks, callback)` | void | 创建循环任务，每隔指定 tick 执行 |
| `startDelayed(name, ticks, callback)` | void | 创建延迟任务，指定 tick 后执行一次 |
| `stop(name)` | void | 停止指定任务 |
| `isRunning(name)` | boolean | 查询任务是否运行中 |

## 使用示例

### 周期性检查通关条件

```javascript
function on_start() {
    tasks.startRepeating("check_win", 20, function() {
        if (monsters.isGroupCleared("all_mobs")) {
            dungeon.broadcast("&a所有怪物已清除，副本通关！");
            tasks.stop("check_win");
            dungeon.endWithDelay(true, 5);
        }
    });
}
```

### 倒计时系统

```javascript
function on_start() {
    dungeon.setData("countdown", 300); // 300秒

    tasks.startRepeating("timer", 20, function() {
        var left = dungeon.addInt("countdown", -1);
        if (left == 60) {
            dungeon.broadcast("&e还剩 60 秒！");
        } else if (left == 10) {
            dungeon.broadcast("&c还剩 10 秒！");
        } else if (left <= 0) {
            tasks.stop("timer");
            dungeon.broadcast("&4时间到！副本失败！");
            dungeon.end(false);
        }
    });
}
```

### 延迟触发 Boss 阶段

```javascript
function on_area_enter() {
    var area = dungeon.getData("_area_name");
    if (area == "boss_trigger") {
        dungeon.broadcast("&e3秒后 Boss 将出现...");
        tasks.startDelayed("spawn_boss", 60, function() {
            monsters.spawnMythic("boss", "DragonKing", "100,65,100", 1, 0);
            dungeon.broadcastTitle("&4Boss 出现", "&c击败它！", 10, 40, 10);
        });
    }
}
```

## 注意事项

- 任务名称（name）在副本内唯一，重复创建同名任务会覆盖旧任务
- 循环任务会持续运行直到手动 `stop()` 或副本结束
- 延迟任务执行一次后自动停止
- 副本结束时所有任务自动清理，无需手动停止
- 20 ticks = 1 秒，所以 `ticks: 20` 表示每秒执行一次
