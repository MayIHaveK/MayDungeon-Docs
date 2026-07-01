# 怪物系统

MayDungeon 提供了完整的怪物管理系统，支持原版怪物和 MythicMobs 自定义怪物。

## 怪物配置

在副本脚本中通过 `monsters` 对象管理怪物：

```javascript
function on_init() {
    // 生成原版怪物
    monsters.spawn("zombie", 100, 65, 100);
    
    // 生成 MythicMobs 怪物
    monsters.spawnMythic("SkeletonKing", 110, 65, 110);
    
    // 批量生成
    monsters.spawnGroup("zombie", 100, 65, 100, 5, 3.0);
    // 类型, x, y, z, 数量, 扩散半径
}
```

## 怪物波次

使用波次系统来组织怪物出现顺序：

```javascript
function on_start() {
    monsters.wave("wave_1", [
        { type: "zombie", count: 5, x: 100, y: 65, z: 100 },
        { type: "skeleton", count: 3, x: 105, y: 65, z: 105 }
    ]);
}

function on_monster_kill(player, monster) {
    if (monsters.waveCleared("wave_1")) {
        players.title("&a第一波清除！", "&7准备迎接下一波");
        monsters.wave("wave_2", [
            { type: "mythic:FireGolem", count: 2, x: 100, y: 65, z: 100 }
        ]);
    }
}
```

## 怪物属性修改

```javascript
var boss = monsters.spawnMythic("DragonBoss", 110, 70, 110);
boss.setMaxHealth(500);
boss.setDamage(15);
boss.setSpeed(0.3);
boss.setName("&4深渊巨龙");
boss.setNameVisible(true);
```

## 常用方法

| 方法 | 说明 |
|------|------|
| `monsters.spawn(type, x, y, z)` | 生成原版怪物 |
| `monsters.spawnMythic(id, x, y, z)` | 生成 MythicMobs 怪物 |
| `monsters.spawnGroup(type, x, y, z, count, radius)` | 批量生成 |
| `monsters.remaining()` | 剩余存活怪物数 |
| `monsters.killAll()` | 清除所有怪物 |
| `monsters.waveCleared(waveId)` | 检查波次是否清除 |
| `monsters.setAI(enabled)` | 全局开关 AI |

## MythicMobs 集成

确保服务器已安装 MythicMobs 插件，MayDungeon 会自动检测并启用集成。MythicMobs 怪物在副本结束时会被自动清理。

## 注意事项

- 副本结束后所有怪物会被强制清除
- 怪物生成坐标为副本世界内的坐标
- 大量怪物同时生成可能导致 TPS 下降，建议分批生成
