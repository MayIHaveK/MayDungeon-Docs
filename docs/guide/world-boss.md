# 世界 Boss（WORLD_BOSS）

世界 Boss 是一种特殊副本模式：活动按时间窗口开放，所有玩家/队伍加入同一个副本实例，共同攻击 Boss，并在结束时按伤害排行发放奖励。

## 与普通副本的区别

| 特性 | 普通副本 `INSTANCE` | 世界 Boss `WORLD_BOSS` |
| --- | --- | --- |
| 世界实例 | 每个队伍/玩家独立创建 | 全服共享同一个活动实例 |
| 进入方式 | `/md start <副本>` 创建新副本 | `/md start <副本>` 加入已开放活动 |
| 开放时间 | 随时进入 | 按 `world-boss.schedule` 定时开放 |
| 无人处理 | 普通副本无人会结束 | 世界 Boss 无人也保持开放，直到时间结束 |
| 结算方式 | 通关/失败奖励 | 伤害排行奖励 |

::: tip 示例地图
内置示例中，`test_dungeon` 是普通副本示例，`world_boss` 是世界 Boss 示例。两者共用 `maps/test_dungeon/` 地图模板，所以世界 Boss 示例可以沿用普通副本的坐标。
:::

## 基础配置

在 `dungeon.yml` 中设置：

```yaml
display-name: "&c&l世界Boss：暗影领主"
description: "定时开放，全服玩家共同挑战并按伤害排行发奖"
map-name: "test_dungeon"

# WORLD_BOSS = 定时开放的世界 Boss 活动
type: WORLD_BOSS

world-boss:
  # 开放时间段，支持多个
  schedule:
    - "19:00-20:00"       # 每天 19:00-20:00
    - "SAT 14:00-16:00"  # 每周六 14:00-16:00

  # 单次活动最长持续秒数；到时自动结算并触发 scripts/on_boss_reward.js
  duration: 3600

  # 最大参与人数；<= 0 表示不限制
  max-players: 100

  # 活动开始前广播提醒，单位秒
  broadcast-before: [300, 60]

  # 是否允许活动开始后中途加入
  allow-late-join: true

  # 排行模式说明：PLAYER / TEAM / BOTH；实际发奖逻辑由脚本自定义
  ranking-mode: BOTH

settings:
  min-players: 1
  max-players: 100
  # 世界 Boss 建议主要使用 world-boss.duration 控制活动时长。
  # 这里设为 0，避免普通副本 time-limit 干扰。
  time-limit: 0
  keep-inventory: true

spawn-point: "8.5, 8.0, 8.5"
```

## 时间格式

| 格式 | 说明 | 示例 |
| --- | --- | --- |
| `HH:mm-HH:mm` | 每天固定时间段 | `19:00-20:00` |
| `DAY HH:mm-HH:mm` | 每周指定日期 | `SAT 14:00-16:00` |
| 跨午夜 | 结束时间小于开始时间 | `23:00-01:00`、`SAT 23:00-01:00` |

支持星期：`MON` `TUE` `WED` `THU` `FRI` `SAT` `SUN`。

指定星期的跨午夜窗口会延续到次日凌晨，例如 `SAT 23:00-01:00` 表示周六 23:00 到周日 01:00 属于同一个开放窗口。

## 生命周期

1. 调度器每 60 秒检查一次所有 `WORLD_BOSS` 副本。
2. 进入开放窗口后自动创建世界 Boss 实例并广播。
3. 玩家使用 `/md start world_boss` 加入当前实例。
4. 玩家退出后，如果实例内无人，世界 Boss 仍保持开放。
5. Boss 被击杀、管理员停止、或 `world-boss.duration` 到期时结算。
6. 同一个开放窗口内，已结算/手动停止的 Boss 不会被再次自动拉起；离开窗口后记录清理，等待下一轮开放。

## 脚本事件

世界 Boss 复用普通副本事件，并额外推荐使用 `on_boss_reward.js`：

| 脚本 | 触发时机 |
| --- | --- |
| `on_start.js` | 活动实例创建并启动后，通常在这里生成 Boss |
| `on_player_join.js` | 每个玩家加入世界 Boss 时 |
| `on_damage.js` | 玩家造成有效伤害时，可记录伤害、倍率修正、自定义排行 |
| `on_monster_kill.js` | 副本内怪物死亡时，可检测 Boss 是否被击杀 |
| `on_boss_reward.js` | 世界 Boss 成功结束时，先于通用 `on_reward.js` 触发 |
| `on_end.js` | 活动结束收尾 |

::: info 伤害追踪
插件会在玩家造成有效伤害时触发 `scripts/on_damage.js`，并注入 `event` 上下文。默认示例使用 `dungeon.getMap("damage_records")` 自己记录伤害、首次出手时间和最近出手时间，结算时再由 JS 排序、计算 DPS 与发奖。
:::

## 生成 Boss 示例

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

## 检测击杀并结算

```javascript
// scripts/on_monster_kill.js
var p = dungeon.getPresets();
var bossGroup = p.boss.group;

if (dungeon.getData("boss_spawned") && monsters.isGroupCleared(bossGroup)) {
    dungeon.broadcast("&6世界Boss已被击败，即将结算排行...");
    tasks.stop("boss_damage_report");
    dungeon.endWithDelay(true, 5);
}
```

## 伤害记录数据结构

默认示例不依赖固定排行 API，而是在 `on_damage.js` 中把数据写入当前副本实例的临时 Map：

```javascript
var records = dungeon.getMap("damage_records");
```

`damage_records` 的 key 是玩家 UUID 字符串，value 是一个 Map，常用字段如下：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `uuid` | String | 玩家 UUID 字符串 |
| `name` | String | 最近一次记录到的玩家名 |
| `damage` | Number | 累计有效伤害 |
| `first_hit` | Number | 第一次造成伤害时的副本运行秒数 |
| `last_hit` | Number | 最近一次造成伤害时的副本运行秒数 |

### 记录伤害

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

`event.get("damage")` 是实际有效伤害，会按目标剩余生命截断；死亡时插件还会补发 `cause == "KILLING_BLOW"` 的伤害事件，避免最后一刀漏记。

### 结算排序与 DPS

```javascript
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
```

## 发奖示例

奖励推荐使用 `players.giveItemTo(...)`，不依赖 `script.allow-console-command`，也不会给已经离开当前副本的玩家发奖。

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

dungeon.broadcast("&6&l═══ 世界Boss伤害排行 ═══");
for (var i = 0; i < top.length; i++) {
    var entry = top[i];
    var reward = getReward(entry.rank);

    dungeon.broadcast("&e#" + entry.rank + " &f" + entry.name
        + " &8- &e" + Math.round(entry.damage)
        + " &7(" + Math.round(entry.percent) + "%)"
        + " &8| &7DPS &f" + Math.round(entry.dps * 10) / 10
        + " &8| &a奖励 &f" + reward.text);

    players.giveItemTo(entry.uuid, reward.material, reward.amount);
}

function getReward(rank) {
    if (rank == 1) return {material: "DIAMOND", amount: 10, text: "钻石 x10"};
    if (rank <= 3) return {material: "DIAMOND", amount: 5, text: "钻石 x5"};
    return {material: "GOLD_INGOT", amount: 3, text: "金锭 x3"};
}
```

## 管理命令

| 命令 | 说明 |
| --- | --- |
| `/md admin worldboss start <地牢>` | 手动开启世界 Boss |
| `/md admin worldboss stop <地牢>` | 手动停止并结算世界 Boss |
| `/md admin worldboss status` | 查看当前活跃世界 Boss |
| `/md start <地牢>` | 玩家加入已开放的世界 Boss |

## 测试建议

### 手动测试

```text
/md admin worldboss start world_boss
/md start world_boss
/md admin worldboss stop world_boss
```

预期：停止时触发 `on_boss_reward.js`，标题和聊天栏显示伤害 / DPS 排行，并通过 `players.giveItemTo` 发放示例奖励。

### 自动调度测试

将 `world-boss.schedule` 临时改成当前时间所在窗口，例如当前 14:30：

```yaml
world-boss:
  schedule:
    - "14:00-15:00"
```

执行 `/md admin reload` 后等待最多 60 秒，应自动开启并广播。
