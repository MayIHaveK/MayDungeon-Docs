# tasks 对象

`tasks` 对象用于创建和管理副本中的任务目标，为玩家提供明确的指引。

## 方法列表

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `tasks.create(id, name, description)` | Task | 创建任务 |
| `tasks.get(id)` | Task | 获取任务 |
| `tasks.remove(id)` | void | 移除任务 |
| `tasks.complete(id)` | void | 完成任务 |
| `tasks.fail(id)` | void | 失败任务 |
| `tasks.all()` | Task[] | 获取所有任务 |
| `tasks.active()` | Task[] | 获取进行中的任务 |
| `tasks.setProgress(id, current, max)` | void | 设置任务进度 |

## Task 对象方法

| 方法 | 说明 |
|------|------|
| `task.getId()` | 获取任务 ID |
| `task.getName()` | 获取任务名称 |
| `task.getProgress()` | 获取当前进度 |
| `task.getMaxProgress()` | 获取最大进度 |
| `task.isComplete()` | 是否已完成 |
| `task.setVisible(visible)` | 设置是否在 UI 中显示 |

## 使用示例

```javascript
function on_start() {
    tasks.create("kill_zombies", "消灭僵尸", "击杀所有僵尸 (0/10)");
    tasks.setProgress("kill_zombies", 0, 10);
    
    tasks.create("find_key", "寻找钥匙", "在迷宫中找到金钥匙");
}

var zombieKills = 0;

function on_monster_kill(player, monster) {
    if (monster.getType() === "ZOMBIE") {
        zombieKills++;
        tasks.setProgress("kill_zombies", zombieKills, 10);
        if (zombieKills >= 10) {
            tasks.complete("kill_zombies");
        }
    }
}

function on_interact(player, block) {
    if (block.getType() === "GOLD_BLOCK") {
        tasks.complete("find_key");
        player.message("&a你找到了金钥匙！");
    }
}

function on_task_complete(task) {
    players.message("&a任务完成: " + task.getName());
    if (tasks.active().length === 0) {
        dungeon.complete();
    }
}
```

## 任务显示

任务进度会通过 BossBar 或 Scoreboard 显示给玩家（可在配置中选择）：

```yaml
# config.yml
tasks:
  display: "bossbar"  # bossbar / scoreboard / actionbar
  show-progress: true
  complete-sound: "ENTITY_PLAYER_LEVELUP"
```
