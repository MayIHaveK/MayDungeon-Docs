# 事件系统

MayDungeon 使用事件驱动模型，副本脚本通过定义特定函数来响应副本生命周期中的各种事件。

## 生命周期事件

在脚本中定义以下函数即可监听对应事件：

| 函数名 | 触发时机 | 参数 |
|--------|----------|------|
| `on_init()` | 副本初始化完成 | 无 |
| `on_start()` | 所有玩家就绪，副本开始 | 无 |
| `on_end()` | 副本结束（完成或超时） | 无 |
| `on_player_join(player)` | 玩家进入副本 | player |
| `on_player_quit(player)` | 玩家离开副本 | player |
| `on_player_death(player)` | 玩家死亡 | player |
| `on_player_respawn(player)` | 玩家重生 | player |
| `on_monster_spawn(monster)` | 怪物生成 | monster |
| `on_monster_kill(player, monster)` | 玩家击杀怪物 | player, monster |
| `on_area_enter(player, area)` | 玩家进入区域 | player, area |
| `on_area_leave(player, area)` | 玩家离开区域 | player, area |
| `on_task_complete(task)` | 任务完成 | task |
| `on_interact(player, block)` | 玩家交互方块 | player, block |
| `on_timer(id)` | 定时器触发 | timer id |
| `on_trigger(id, player)` | 自定义触发器 | id, player |

## 使用示例

```javascript
function on_init() {
    // 设置区域检测
    areas.create("boss_room", 100, 60, 100, 120, 80, 120);
    // 注册定时器，每 20 tick 触发
    dungeon.timer("check_progress", 20, true);
}

function on_area_enter(player, area) {
    if (area.getId() === "boss_room") {
        monsters.spawn("boss_dragon", 110, 65, 110);
        players.message("&4Boss 已苏醒！");
    }
}

function on_timer(id) {
    if (id === "check_progress") {
        if (monsters.remaining() === 0) {
            dungeon.complete();
        }
    }
}
```

## 事件执行顺序

1. `on_init` → 世界加载完毕时
2. `on_player_join` → 每位玩家传入时
3. `on_start` → 全员就绪后
4. 各运行时事件 → 副本进行中
5. `on_end` → 副本结束时

## 注意

- 事件函数未定义时会被安全忽略
- 事件处理中的异常会被捕获并输出到调试日志
- 避免在事件中执行耗时操作，否则可能阻塞主线程
