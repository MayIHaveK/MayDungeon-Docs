# 示例：生存挑战

限时生存类副本，演示波次系统、难度递增和计时功能。

## 副本配置

```yaml
# dungeons/survival_challenge/dungeon.yml
name: "无尽试炼"
template-world: "dungeon_arena"
min-players: 1
max-players: 4
timeout: 0  # 无超时，存活即胜利
spawn:
  x: 0.5
  y: 65.0
  z: 0.5
keep-inventory: false
```

## 副本脚本

```javascript
// dungeons/survival_challenge/script.js

var wave = 0;
var maxWaves = 10;
var waveInterval = 200; // 10秒间隔
var startTime = 0;

function on_init() {
    world.setTime(13000);
    world.setGameRule("doDaylightCycle", false);
    
    // 竞技场区域
    areas.create("arena", -25, 60, -25, 25, 80, 25);
    
    // 补给箱区域
    areas.create("supply", -2, 64, -2, 2, 66, 2);
}

function on_start() {
    startTime = dungeon.getElapsedTime();
    
    players.title("&c无尽试炼", "&7坚持10波！");
    players.message("&7每波间隔 10 秒，难度递增");
    players.message("&7中央有补给箱，善用之！");
    
    tasks.create("waves", "生存波次", "坚持到第10波");
    tasks.setProgress("waves", 0, maxWaves);
    
    // 波次信息全息
    var h = holograms.create("wave_info", 0, 72, 0);
    h.addLine("&6&l当前波次");
    h.addLine("&f0 / " + maxWaves);
    
    // 延迟开始第一波
    utils.delay(100, function() {
        nextWave();
    });
}

function nextWave() {
    wave++;
    
    if (wave > maxWaves) {
        victory();
        return;
    }
    
    tasks.setProgress("waves", wave, maxWaves);
    holograms.get("wave_info").setLine(1, "&f" + wave + " / " + maxWaves);
    
    players.title("&e第 " + wave + " 波", "&7" + getWaveDesc(wave));
    players.sound("BLOCK_NOTE_BLOCK_BELL");
    
    spawnWave(wave);
}

function getWaveDesc(w) {
    if (w <= 3) return "简单";
    if (w <= 6) return "中等";
    if (w <= 9) return "困难";
    return "地狱";
}

function spawnWave(w) {
    var count = 3 + w * 2; // 5, 7, 9, 11...
    var types = getWaveTypes(w);
    
    for (var i = 0; i < types.length; i++) {
        var num = Math.ceil(count / types.length);
        var angle = (2 * Math.PI / types.length) * i;
        var x = Math.floor(Math.cos(angle) * 15);
        var z = Math.floor(Math.sin(angle) * 15);
        monsters.spawnGroup(types[i], x, 65, z, num, 3.0);
    }
}

function getWaveTypes(w) {
    if (w <= 2) return ["zombie"];
    if (w <= 4) return ["zombie", "skeleton"];
    if (w <= 6) return ["zombie", "skeleton", "spider"];
    if (w <= 8) return ["zombie", "skeleton", "spider", "witch"];
    return ["zombie", "skeleton", "spider", "witch", "vindicator"];
}

function on_monster_kill(player, monster) {
    // 10% 概率掉落补给
    if (utils.chance(10)) {
        var loc = player.getLocation();
        world.dropItem(loc.x, loc.y, loc.z, "GOLDEN_APPLE", 1);
    }
    
    if (monsters.remaining() === 0) {
        players.message("&a波次清除！下一波即将到来...");
        utils.delay(waveInterval, function() {
            nextWave();
        });
    }
}

function on_player_death(player) {
    players.message("&c" + player.getName() + " 阵亡了！");
    
    if (players.alive().length === 0) {
        dungeon.fail("坚持到了第 " + wave + " 波");
    }
}

function on_area_enter(player, area) {
    if (area.getId() === "supply" && wave % 3 === 0) {
        player.give("GOLDEN_APPLE", 1);
        player.message("&a获得补给！");
    }
}

function victory() {
    tasks.complete("waves");
    monsters.killAll();
    
    var elapsed = dungeon.getElapsedTime() - startTime;
    var minutes = Math.floor(elapsed / 60);
    var seconds = elapsed % 60;
    
    players.title("&a&l试炼通过！", "&7用时: " + minutes + "分" + seconds + "秒");
    players.sound("UI_TOAST_CHALLENGE_COMPLETE");
    players.give("NETHER_STAR", 1);
    players.give("DIAMOND", 10);
    
    utils.delay(100, function() {
        dungeon.complete();
    });
}
```

## 波次设计

| 波次 | 难度 | 怪物种类 | 数量 |
|------|------|----------|------|
| 1-2 | 简单 | 僵尸 | 5-7 |
| 3-4 | 简单 | 僵尸、骷髅 | 9-11 |
| 5-6 | 中等 | 僵尸、骷髅、蜘蛛 | 13-15 |
| 7-8 | 困难 | +女巫 | 17-19 |
| 9-10 | 地狱 | +卫道士 | 21-23 |
