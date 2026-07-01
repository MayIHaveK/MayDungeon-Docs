# 示例：简单副本

一个最基础的副本示例，演示 MayDungeon 的核心流程。

## 副本配置

```yaml
# dungeons/simple_dungeon/dungeon.yml
name: "地下墓穴"
template-world: "dungeon_crypt"
min-players: 1
max-players: 4
timeout: 300
spawn:
  x: 0.5
  y: 65.0
  z: 0.5
exit-spawn:
  world: "world"
  x: 0.5
  y: 100.0
  z: 0.5
keep-inventory: true
allow-rejoin: true
```

## 副本脚本

```javascript
// dungeons/simple_dungeon/script.js

var totalMonsters = 10;

function on_init() {
    // 设置世界环境
    world.setTime(18000);
    world.setGameRule("doDaylightCycle", false);
    world.setGameRule("doMobSpawning", false);
    
    print("地下墓穴副本初始化完成");
}

function on_start() {
    // 通知玩家
    players.title("&4地下墓穴", "&7消灭所有亡灵");
    players.message("&7击败全部 &c" + totalMonsters + " &7只怪物即可通关");
    players.sound("ENTITY_WITHER_SPAWN");
    
    // 创建任务
    tasks.create("kill_all", "消灭亡灵", "击杀所有怪物");
    tasks.setProgress("kill_all", 0, totalMonsters);
    
    // 生成第一波怪物
    monsters.spawnGroup("zombie", 20, 65, 20, 5, 4.0);
    monsters.spawnGroup("skeleton", -20, 65, -20, 5, 4.0);
}

function on_monster_kill(player, monster) {
    var remaining = monsters.remaining();
    tasks.setProgress("kill_all", totalMonsters - remaining, totalMonsters);
    
    player.message("&a击杀！&7剩余: &c" + remaining);
    
    if (remaining === 0) {
        tasks.complete("kill_all");
    }
}

function on_task_complete(task) {
    if (task.getId() === "kill_all") {
        players.title("&a&l通关！", "&7恭喜完成副本");
        players.sound("UI_TOAST_CHALLENGE_COMPLETE");
        
        // 给予奖励
        players.give("DIAMOND", 3);
        
        // 延迟结束
        utils.delay(60, function() {
            dungeon.complete();
        });
    }
}

function on_player_death(player) {
    players.message("&c" + player.getName() + " &7倒下了...");
    if (players.alive().length === 0) {
        dungeon.fail("全员阵亡");
    }
}

function on_end() {
    print("副本结束，清理资源");
}
```

## 运行效果

1. 玩家进入后看到标题"地下墓穴"
2. 两批怪物在不同位置生成（5只僵尸 + 5只骷髅）
3. 每击杀一只怪物显示剩余数量
4. 全部击杀后通关，获得3颗钻石奖励
5. 全员死亡则副本失败
