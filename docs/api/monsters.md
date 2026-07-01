# monsters 怪物管理

`monsters` 对象用于在副本中生成和管理怪物。支持原版怪物和 MythicMobs。

## 方法一览

| 方法 | 说明 |
|------|------|
| `monsters.spawn(type, x, y, z)` | 生成原版怪物 |
| `monsters.spawnMythic(mobId, x, y, z)` | 生成 MythicMobs 怪物 |
| `monsters.spawnMythic(mobId, x, y, z, level)` | 生成指定等级的 MythicMobs 怪物 |
| `monsters.spawnGroup(groupId)` | 生成预设怪物组 |
| `monsters.killAll()` | 击杀副本中所有怪物 |
| `monsters.getAliveCount()` | 获取存活怪物数 |
| `monsters.getGroupAliveCount(groupId)` | 获取指定组存活数 |
| `monsters.isGroupCleared(groupId)` | 检查指定组是否全灭 |
| `monsters.setHealth(entity, health)` | 设置怪物血量 |
| `monsters.getKilledEntity()` | 在 on_monster_kill 中获取被击杀的实体 |
| `monsters.getKilledGroup()` | 在 on_monster_kill 中获取被击杀怪物所属组 |

## 使用示例

```javascript
// on_start.js - 生成第一波怪物
monsters.spawnMythic("dungeon_skeleton", 100, 65, 200);
monsters.spawnMythic("dungeon_skeleton", 102, 65, 200);
monsters.spawnMythic("dungeon_zombie", 98, 65, 202);

dungeon.broadcast("&c第一波怪物来袭！");
```

```javascript
// on_group_clear.js - 怪物组全灭后触发下一阶段
var phase = dungeon.getPhase();
if (phase === "wave_1") {
    dungeon.setPhase("wave_2");
    monsters.spawnGroup("wave2_mobs");
    dungeon.broadcast("&6第二波怪物出现！");
} else if (phase === "wave_2") {
    dungeon.setPhase("boss");
    monsters.spawnMythic("dungeon_boss", 100, 65, 210);
    dungeon.broadcast("&4Boss 登场！");
}
```

## 怪物组（Presets）

在 `presets.yml` 中预定义怪物组，然后通过 `monsters.spawnGroup()` 一键生成：

```yaml
groups:
  wave1_mobs:
    - type: MYTHIC
      id: dungeon_skeleton
      x: 100
      y: 65
      z: 200
      count: 3
    - type: MYTHIC
      id: dungeon_zombie
      x: 102
      y: 65
      z: 202
      count: 2
```

## MythicMobs 集成

需要服务器安装 MythicMobs 5.x。如果未安装，`spawnMythic` 方法会回退到生成原版怪物并在控制台输出警告。
