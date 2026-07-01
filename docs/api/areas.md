# areas 对象

`areas` 对象用于创建和管理副本中的区域检测，当玩家进入或离开区域时触发事件。

## 方法列表

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `areas.create(id, x1, y1, z1, x2, y2, z2)` | Area | 创建矩形区域 |
| `areas.createSphere(id, x, y, z, radius)` | Area | 创建球形区域 |
| `areas.get(id)` | Area | 获取区域 |
| `areas.remove(id)` | void | 移除区域 |
| `areas.all()` | Area[] | 获取所有区域 |
| `areas.getPlayersIn(id)` | Player[] | 获取区域内玩家 |
| `areas.contains(id, player)` | boolean | 检查玩家是否在区域内 |

## Area 对象方法

| 方法 | 说明 |
|------|------|
| `area.getId()` | 获取区域 ID |
| `area.getPlayers()` | 获取区域内玩家列表 |
| `area.contains(player)` | 判断玩家是否在区域内 |
| `area.setEffect(type, level)` | 设置进入区域时的药水效果 |
| `area.setDamage(damage, interval)` | 设置区域持续伤害 |
| `area.setMessage(msg)` | 设置进入时提示消息 |
| `area.setParticle(type)` | 设置区域边界粒子效果 |

## 使用示例

```javascript
function on_init() {
    // 创建矩形触发区域
    areas.create("entrance", 95, 60, 95, 105, 80, 105);
    
    // 创建球形Boss房间区域
    areas.createSphere("boss_arena", 200, 65, 200, 20);
    
    // 创建伤害区域（岩浆地带）
    var lavaZone = areas.create("lava", 50, 60, 50, 70, 63, 70);
    lavaZone.setDamage(2.0, 20); // 每20tick造成2点伤害
    lavaZone.setParticle("FLAME");
}

function on_area_enter(player, area) {
    switch (area.getId()) {
        case "entrance":
            player.message("&7你进入了大厅...");
            break;
        case "boss_arena":
            obstacles.close("arena_gate");
            monsters.spawnMythic("BossGolem", 200, 65, 200);
            break;
    }
}

function on_area_leave(player, area) {
    if (area.getId() === "boss_arena") {
        player.teleport(200, 65, 200);
        player.message("&c你不能逃离Boss战！");
    }
}
```

## 注意事项

- 区域检测每 5 tick 执行一次（可在配置中调整）
- 大量重叠区域可能影响性能
- 区域坐标使用副本世界内的绝对坐标
