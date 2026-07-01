# 示例：Boss 战

一个包含多阶段 Boss 机制的副本示例。

## 副本配置

```yaml
# dungeons/boss_fight/dungeon.yml
name: "炎龙巢穴"
template-world: "dungeon_dragon_lair"
min-players: 2
max-players: 4
timeout: 600
spawn:
  x: 0.5
  y: 65.0
  z: 0.5
keep-inventory: false
```

## 副本脚本

```javascript
// dungeons/boss_fight/script.js

var boss = null;
var phase = 1;
var bossMaxHp = 500;

function on_init() {
    world.setTime(18000);
    world.setGameRule("doDaylightCycle", false);
    
    // 创建区域
    areas.create("arena", -20, 60, -20, 20, 80, 20);
    
    // 关闭竞技场大门
    obstacles.create("arena_gate", "door", 0, 65, -20);
    obstacles.get("arena_gate").setBlock("OBSIDIAN");
    obstacles.get("arena_gate").setSize(5, 4, 1);
}

function on_start() {
    players.title("&4炎龙巢穴", "&7击败炎龙守护者");
    players.message("&7进入竞技场开始战斗...");
    
    tasks.create("defeat_boss", "击败炎龙", "消灭炎龙守护者");
    
    // 创建Boss血条显示
    var h = holograms.create("boss_hp", 0, 75, 0);
    h.addLine("&4&l炎龙守护者");
    h.addLine("&c" + bossMaxHp + " / " + bossMaxHp);
}

function on_area_enter(player, area) {
    if (area.getId() === "arena" && boss === null) {
        spawnBoss();
        obstacles.close("arena_gate");
        players.message("&c大门已关闭！击败Boss才能离开！");
    }
}

function spawnBoss() {
    boss = monsters.spawnMythic("FireDragon", 0, 65, 0);
    boss.setMaxHealth(bossMaxHp);
    boss.setName("&4炎龙守护者");
    players.sound("ENTITY_ENDER_DRAGON_GROWL");
    
    dungeon.timer("boss_check", 20, true);
    dungeon.timer("boss_skill", 100, true);
}

function on_timer(id) {
    if (id === "boss_check" && boss !== null) {
        var hp = boss.getHealth();
        var h = holograms.get("boss_hp");
        h.setLine(1, "&c" + Math.floor(hp) + " / " + bossMaxHp);
        
        // 阶段切换
        if (hp < bossMaxHp * 0.5 && phase === 1) {
            phase = 2;
            enterPhase2();
        }
        if (hp < bossMaxHp * 0.2 && phase === 2) {
            phase = 3;
            enterPhase3();
        }
    }
    
    if (id === "boss_skill") {
        useBossSkill();
    }
}

function enterPhase2() {
    players.title("", "&c炎龙狂暴了！");
    players.sound("ENTITY_WITHER_SPAWN");
    monsters.spawnGroup("blaze", 10, 65, 10, 3, 5.0);
}

function enterPhase3() {
    players.title("", "&4最终阶段！");
    players.message("&c炎龙进入了最终形态！");
    players.effect("SLOWNESS", 100, 1);
}

function useBossSkill() {
    if (boss === null) return;
    
    var skill = utils.random(1, 3);
    switch (skill) {
        case 1: // 火球
            players.message("&c炎龙释放了火焰吐息！");
            players.effect("WITHER", 40, 0);
            break;
        case 2: // 冲击波
            players.message("&c炎龙发动了地面冲击！");
            players.sound("ENTITY_GENERIC_EXPLODE");
            break;
        case 3: // 召唤小怪
            monsters.spawnGroup("magma_cube", 5, 65, 5, 2, 3.0);
            break;
    }
}

function on_monster_kill(player, monster) {
    if (monster === boss || monsters.remaining() === 0) {
        bossDead();
    }
}

function bossDead() {
    boss = null;
    tasks.complete("defeat_boss");
    obstacles.open("arena_gate");
    holograms.remove("boss_hp");
    
    players.title("&a&l胜利！", "&7炎龙已被击败");
    players.sound("UI_TOAST_CHALLENGE_COMPLETE");
    players.give("NETHER_STAR", 1);
    
    utils.delay(100, function() {
        dungeon.complete();
    });
}
```

## 机制说明

- **阶段 1** (100%-50%)：Boss 基础攻击 + 定时技能
- **阶段 2** (50%-20%)：Boss 狂暴 + 召唤烈焰人
- **阶段 3** (20%-0%)：最终形态，给予玩家减速
