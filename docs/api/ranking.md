# ranking - 伤害排行

`ranking` 对象是插件内置的伤害排行 API，主要用于世界 Boss 副本按伤害结算奖励，也可用于普通副本的 DPS 统计。伤害数据存储在当前副本实例内，副本结束后自动销毁。

## 方法列表

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `addDamage(playerOrUuid, damage)` | void | 记录一次伤害（damage <= 0 时忽略） |
| `clear()` | void | 清空当前实例的所有伤害记录 |
| `getAll()` | List | 获取全部玩家伤害记录（按伤害降序） |
| `getTop(n)` | List | 获取伤害前 N 名玩家 |
| `getTeamTop(n)` | List | 获取伤害前 N 名队伍（按队长分组） |
| `getPlayerDamage(playerOrUuid)` | double | 获取指定玩家的累计伤害 |
| `getPlayerRank(playerOrUuid)` | int | 获取指定玩家的排名（从 1 开始，0=无记录） |
| `getTeamDamage(playerOrUuid)` | double | 获取指定玩家所在队伍的总伤害 |
| `getTotalDamage()` | double | 获取所有玩家的总伤害 |

`playerOrUuid` 参数非常灵活，可以传入：Bukkit `Player` 对象、UUID 字符串、UUID 对象或在线玩家名。

## 返回数据结构

### getTop(n) / getAll() 的每个条目

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | String | 玩家名（离线时为 UUID 字符串） |
| `uuid` | String | 玩家 UUID |
| `player` | Player \| null | Bukkit Player 对象（离线为 null） |
| `damage` | Number | 累计伤害 |
| `percent` | Number | 占总伤害的百分比（0-100） |
| `rank` | Number | 排名（从 1 开始） |

### getTeamTop(n) 的每个条目

| 字段 | 类型 | 说明 |
|------|------|------|
| `leaderName` | String | 队长名 |
| `leaderUuid` | String | 队长 UUID |
| `members` | List\<String\> | 成员 UUID 列表 |
| `totalDamage` | Number | 队伍总伤害 |
| `percent` | Number | 占总伤害的百分比（0-100） |
| `rank` | Number | 排名（从 1 开始） |

无队伍的玩家自成一队（自己即"队长"）。

## 使用示例

### 记录伤害

```javascript
// scripts/on_damage.js
var damage = event.get("damage");
if (damage > 0) {
    ranking.addDamage(trigger.getPlayer(), damage);
}
```

### 播报实时排行

```javascript
// scripts/on_start.js
tasks.startRepeating("damage_report", 600, function() {
    var top = ranking.getTop(3);
    if (top.length == 0) return;
    dungeon.broadcast("&c[世界Boss] &7当前总伤害: &f" + Math.round(ranking.getTotalDamage()));
    for (var i = 0; i < top.length; i++) {
        var e = top[i];
        dungeon.broadcast("&e#" + e.rank + " &f" + e.name
            + " &8- &e" + Math.round(e.damage)
            + " &7(" + Math.round(e.percent) + "%)");
    }
});
```

### 结算发奖

```javascript
// scripts/on_boss_reward.js
var top = ranking.getTop(10);
dungeon.broadcast("&6&l═══ 世界Boss伤害排行 ═══");
for (var i = 0; i < top.length; i++) {
    var e = top[i];
    dungeon.broadcast("&e#" + e.rank + " &f" + e.name + " &8- &e" + Math.round(e.damage));
    if (e.rank == 1) players.giveItemTo(e.uuid, "DIAMOND", 10);
    else if (e.rank <= 3) players.giveItemTo(e.uuid, "DIAMOND", 5);
    else players.giveItemTo(e.uuid, "GOLD_INGOT", 3);
}
```

### 查询单个玩家

```javascript
var damage = ranking.getPlayerDamage(trigger.getPlayer());
var rank = ranking.getPlayerRank(trigger.getPlayer());
trigger.sendMessage("&7你的伤害: &f" + Math.round(damage) + " &7排名: &f#" + rank);
```

## 与脚本自建记录的区别

内置示例副本（`world_boss`）的脚本使用 `dungeon.getMap("damage_records")` 自建伤害记录，以便额外统计首次/最近出手时间并计算 DPS。两种方式可以并存：

| 方式 | 优点 | 适用场景 |
|------|------|---------|
| `ranking` API | 零代码排序/百分比/队伍分组 | 简单的伤害排行发奖 |
| 自建 `damage_records` | 可自定义字段（DPS、出手时间等） | 需要 DPS、时间跨度等高级统计 |

## 注意事项

- 伤害记录跟随副本实例生命周期，副本结束即清空，不做持久化
- `getTeamTop` / `getTeamDamage` 按当前组队关系分组，玩家中途退队可能影响分组结果
- 离线玩家的 `name` 字段回退为 UUID 字符串、`player` 字段为 null，发奖时建议使用 `players.giveItemTo(uuid, ...)`
