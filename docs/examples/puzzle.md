# 示例：解谜副本

以机关解谜为核心的副本，演示区域检测、障碍物和交互触发器。

## 副本配置

```yaml
# dungeons/puzzle_dungeon/dungeon.yml
name: "遗迹谜题"
template-world: "dungeon_ruins"
min-players: 1
max-players: 2
timeout: 480
spawn:
  x: 0.5
  y: 65.0
  z: 0.5
keep-inventory: true
```

## 副本脚本

```javascript
// dungeons/puzzle_dungeon/script.js

var puzzlesSolved = 0;
var totalPuzzles = 3;

function on_init() {
    world.setTime(6000);
    
    // 创建房间区域
    areas.create("room_1", 0, 60, 0, 20, 70, 20);
    areas.create("room_2", 25, 60, 0, 45, 70, 20);
    areas.create("room_3", 50, 60, 0, 70, 70, 20);
    
    // 创建房间之间的门
    obstacles.create("door_1", "door", 20, 65, 10);
    obstacles.get("door_1").setBlock("IRON_BLOCK");
    obstacles.get("door_1").setSize(1, 3, 3);
    
    obstacles.create("door_2", "door", 45, 65, 10);
    obstacles.get("door_2").setBlock("IRON_BLOCK");
    obstacles.get("door_2").setSize(1, 3, 3);
    
    obstacles.create("door_final", "door", 70, 65, 10);
    obstacles.get("door_final").setBlock("GOLD_BLOCK");
    obstacles.get("door_final").setSize(1, 3, 3);
    
    // 创建 NPC 引导
    var guide = npc.create("guide", "&e遗迹守卫", 5, 65, 5);
    guide.setLookAtPlayer(true);
    guide.setInteractAction(function(player) {
        guide.say("&f解开三个房间的谜题才能打开最终之门。");
    });
}

function on_start() {
    players.title("&6遗迹谜题", "&7解开所有机关");
    tasks.create("puzzles", "解谜进度", "解开 3 个房间的谜题");
    tasks.setProgress("puzzles", 0, totalPuzzles);
}

// 谜题 1：踩踏板
function on_area_enter(player, area) {
    if (area.getId() === "room_1") {
        player.message("&e[提示] &7找到隐藏的压力板...");
    }
}

function on_interact(player, block) {
    var type = block.getType();
    var x = block.getX();
    var z = block.getZ();
    
    // 谜题 1：按正确顺序按下按钮
    if (type === "STONE_BUTTON" && x === 10 && z === 15) {
        solvePuzzle(1, player);
    }
    
    // 谜题 2：拉拉杆
    if (type === "LEVER" && x === 35 && z === 10) {
        solvePuzzle(2, player);
    }
    
    // 谜题 3：对准的红石火把
    if (type === "REDSTONE_TORCH" && x === 60 && z === 5) {
        solvePuzzle(3, player);
    }
}

function solvePuzzle(num, player) {
    puzzlesSolved++;
    tasks.setProgress("puzzles", puzzlesSolved, totalPuzzles);
    
    player.message("&a谜题 " + num + " 已解开！");
    players.sound("BLOCK_NOTE_BLOCK_PLING");
    
    // 打开对应的门
    if (num === 1) obstacles.open("door_1");
    if (num === 2) obstacles.open("door_2");
    
    // 全部解开
    if (puzzlesSolved >= totalPuzzles) {
        allSolved();
    }
}

function allSolved() {
    tasks.complete("puzzles");
    obstacles.open("door_final");
    
    players.title("&a谜题全解！", "&7最终之门已开启");
    players.sound("UI_TOAST_CHALLENGE_COMPLETE");
    
    // 奖励房间入口开启
    var h = holograms.create("reward", 72, 67, 10);
    h.addLine("&6&l奖励房间");
    h.addLine("&7进入领取奖励");
    
    areas.create("reward_room", 73, 60, 5, 85, 70, 15);
}

function on_area_enter(player, area) {
    if (area.getId() === "reward_room") {
        player.give("DIAMOND", 5);
        player.give("GOLDEN_APPLE", 2);
        player.message("&a你获得了奖励！");
        
        utils.delay(60, function() {
            dungeon.complete();
        });
    }
}
```

## 设计思路

- 三个房间依次解锁，每个房间有不同类型的交互谜题
- 使用 `obstacles` 控制房间之间的通道
- NPC 提供提示信息
- 全部解谜后开启奖励房间
