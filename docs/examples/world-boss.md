# 世界 Boss 示例

内置 `world_boss` 示例展示了如何制作一个定时开放、全服共享、按伤害排行发奖的世界 Boss 活动。

## 示例目录

```text
plugins/MayDungeon/dungeons/world_boss/
├── dungeon.yml
├── presets.yml
└── scripts/
    ├── on_start.js
    ├── on_damage.js
    ├── on_monster_kill.js
    ├── on_boss_reward.js
    ├── on_player_join.js
    └── on_end.js
```

::: tip
`world_boss` 示例和普通 `test_dungeon` 示例共用 `maps/test_dungeon/` 地图模板，因此坐标可以直接沿用普通副本示例，不需要重新找点。
:::

## dungeon.yml 要点

```yaml
display-name: "&c&l世界Boss：暗影领主"
description: "定时开放，全服玩家共同挑战并按伤害排行发奖"
map-name: "test_dungeon"
type: WORLD_BOSS

world-boss:
  schedule:
    - "19:00-20:00"
    - "SAT 14:00-16:00"
  duration: 3600
  max-players: 100
  broadcast-before: [300, 60]
  allow-late-join: true
  ranking-mode: BOTH

settings:
  max-players: 100
  time-limit: 0

spawn-point: "8.5, 8.0, 8.5"
```

关键点：

- `type: WORLD_BOSS` 表示这是世界 Boss 活动。
- `map-name: test_dungeon` 表示复用普通示例地图。
- `world-boss.duration` 控制单次活动最长持续时间。
- `settings.time-limit` 建议设为 `0`，避免普通副本时限干扰。
- `world-boss.max-players <= 0` 表示不限制参与人数。

## presets.yml 要点

```yaml
monsters:
  boss:
    type: "mythic:WorldBossShadowLord"
    level: 5

boss:
  group: "world_boss"
  location: "-11,13,8"
  scatter: 0.0
```

这里继续使用普通副本示例里的 Boss 房坐标 `-11,13,8`。

## 开启活动并生成 Boss

```javascript
// scripts/on_start.js
var p = dungeon.getPresets();
var bossDef = p.monsters.boss;
var bossCfg = p.boss;

dungeon.broadcast("&c世界Boss已经降临，输入 /md start world_boss 加入战斗！");

if (bossDef.type.indexOf("mythic:") === 0) {
    monsters.spawnMythicLevel(bossCfg.group, bossDef.type.substring(7),
        bossCfg.location, 1, bossCfg.scatter || 0, bossDef.level || 1);
} else {
    monsters.spawnMultiple(bossCfg.group, bossDef.type,
        bossCfg.location, 1, bossCfg.scatter || 0);
}

dungeon.setData("boss_spawned", true);
```

在 `WORLD_BOSS` 实例中通过怪物 API 生成的怪物会自动带上世界 Boss 标记；实际伤害记录推荐放在 `on_damage.js` 中。

## 伤害事件记录

```javascript
// scripts/on_damage.js
var damage = event.get("damage");
if (damage <= 0) return;

var elapsed = dungeon.getElapsedTime();
var records = dungeon.getMap("damage_records");
var player = trigger.getPlayer();
var uuid = player.getUniqueId().toString();
var record = records.get(uuid);

if (record == null) {
    record = dungeon.newMap();
    record.put("uuid", uuid);
    record.put("name", trigger.getPlayerName());
    record.put("damage", 0.0);
    record.put("first_hit", elapsed);
    records.put(uuid, record);
}

record.put("name", trigger.getPlayerName());
record.put("damage", Number(record.get("damage")) + damage);
record.put("last_hit", elapsed);
```

`event` 是 Java `Map`，常用字段包括 `damage`、`finalDamage`、`rawDamage`、`target`、`targetUuid`、`targetType`、`targetName`、`isWorldBoss`、`cause`、`instanceId`。其中 `damage` 是实际有效伤害；死亡补记事件的 `cause` 为 `KILLING_BLOW`。

## 击杀后结算

```javascript
// scripts/on_monster_kill.js
var p = dungeon.getPresets();
var bossGroup = p.boss.group;

if (dungeon.getData("boss_spawned") && monsters.isGroupCleared(bossGroup)) {
    dungeon.broadcast("&6世界Boss已被击败，即将结算伤害排行...");
    dungeon.endWithDelay(true, 5);
}
```

成功结束后，插件会触发 `on_boss_reward.js`。

## 伤害排行发奖

```javascript
// scripts/on_boss_reward.js
var top = getDamageTop(10);

if (top.length == 0) {
    dungeon.broadcastTitle("&6世界Boss结算", "&7本次没有有效伤害记录", 10, 80, 20);
    dungeon.broadcast("&7本次活动没有有效伤害记录。");
    return;
}

dungeon.broadcastTitle("&6世界Boss结算完成",
    "&e#1 " + top[0].name + " &7伤害 &f" + Math.round(top[0].damage), 10, 100, 30);

for (var i = 0; i < top.length; i++) {
    var entry = top[i];
    var reward = getReward(entry.rank);

    dungeon.broadcast("&e#" + entry.rank + " &f" + entry.name
        + " &7- &c" + Math.round(entry.damage)
        + " &7DPS " + Math.round(entry.dps * 10) / 10
        + " &a奖励 " + reward.text);

    // 不依赖控制台命令权限；玩家必须在线且仍在当前副本内。
    players.giveItemTo(entry.uuid, reward.material, reward.amount);
}

function getDamageTop(limit) {
    var records = dungeon.getMap("damage_records");
    var rows = [];
    var total = 0;
    var it = records.entrySet().iterator();
    while (it.hasNext()) {
        var mapEntry = it.next();
        var record = mapEntry.getValue();
        var damage = Number(record.get("damage")) || 0;
        if (damage <= 0) continue;
        total += damage;

        var firstHit = Number(record.get("first_hit")) || 0;
        var lastHit = Number(record.get("last_hit")) || firstHit;
        var span = Math.max(1, lastHit - firstHit);
        rows.push({
            uuid: String(record.get("uuid") || mapEntry.getKey()),
            name: String(record.get("name") || mapEntry.getKey()),
            damage: damage,
            dps: damage / span
        });
    }

    rows.sort(function(a, b) { return b.damage - a.damage; });
    if (limit > 0 && rows.length > limit) rows = rows.slice(0, limit);
    for (var i = 0; i < rows.length; i++) {
        rows[i].rank = i + 1;
        rows[i].percent = total > 0 ? rows[i].damage / total * 100.0 : 0.0;
    }
    return rows;
}

function getReward(rank) {
    if (rank == 1) return {material: "DIAMOND", amount: 10, text: "钻石 x10"};
    if (rank <= 3) return {material: "DIAMOND", amount: 5, text: "钻石 x5"};
    return {material: "GOLD_INGOT", amount: 3, text: "金锭 x3"};
}
```

::: tip Nashorn / JS 写法
`dungeon.getMap("damage_records")` 返回 Java Map，需要用 `entrySet().iterator()` 遍历；整理后的 `top` 是 JS 数组，可以使用 `top.length`、`top[i]`、`entry.name`。
:::

## 测试流程

### 手动测试

```text
/md admin worldboss start world_boss
/md start world_boss
```

然后击杀 Boss，或执行：

```text
/md admin worldboss stop world_boss
```

预期：标题和聊天栏显示伤害 / DPS 排行，并通过 `players.giveItemTo` 发放示例奖励。

### 自动调度测试

把 `world-boss.schedule` 临时改成当前时间所在窗口，例如当前 14:30：

```yaml
world-boss:
  schedule:
    - "14:00-15:00"
```

执行 `/md admin reload`，等待最多 60 秒，应自动开启世界 Boss。

### 跨午夜测试

```yaml
world-boss:
  schedule:
    - "SAT 23:00-01:00"
```

该窗口表示周六 23:00 到周日 01:00，同一开放窗口内 Boss 被击杀或手动停止后不会再次自动开启。
