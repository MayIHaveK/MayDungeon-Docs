# world - 世界操作

`world` 对象用于控制副本世界的环境效果，包括时间、天气、音效和粒子。

## 通用约定

- 位置参数格式: `"x,y,z"` | 颜色代码: `&` 前缀 | 时间: tick（20tick=1秒）| 材质: 大写英文

## 方法列表

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `setTime(time)` | void | 设置世界时间 |
| `setWeather(type)` | void | 设置天气：`clear` / `rain` / `thunder` |
| `playSound(loc, sound, volume, pitch)` | void | 在指定位置播放音效 |
| `spawnParticle(loc, name, count)` | void | 在指定位置生成粒子 |
| `spawnDust(loc, r, g, b, size, count)` | void | 生成彩色粉尘粒子 |
| `spawnDustTransition(loc, r1, g1, b1, r2, g2, b2, size, count)` | void | 生成渐变色粉尘粒子 |
| `drawPathToAll(target, r, g, b, density, maxDist)` | void | 为所有玩家绘制粒子引导线 |
| `drawPath(player, target, r, g, b, density, maxDist)` | void | 为指定玩家绘制粒子引导线 |

## 使用示例

### 设置副本氛围

```javascript
function on_init() {
    world.setTime(18000); // 午夜
    world.setWeather("thunder");
}
```

### Boss 出场特效

```javascript
function on_area_enter() {
    var area = dungeon.getData("_area_name");
    if (area == "boss_room") {
        world.playSound("100,65,100", "entity.ender_dragon.growl", 1.0, 0.8);
        world.spawnParticle("100,65,100", "EXPLOSION_LARGE", 20);
        world.spawnDust("100,66,100", 255, 0, 0, 2.0, 50);
    }
}
```

### 引导线指引玩家

```javascript
function on_start() {
    // 每2秒为所有玩家绘制到目标点的引导线
    tasks.startRepeating("guide", 40, function() {
        world.drawPathToAll("200,65,200", 0, 255, 0, 0.5, 30);
    });
}

function on_group_clear() {
    // Boss 死后指引到出口
    tasks.stop("guide");
    tasks.startRepeating("guide_exit", 40, function() {
        world.drawPathToAll("250,65,250", 255, 215, 0, 0.5, 30);
    });
}
```

## 跨版本粒子兼容

1.20.5 起 Bukkit 部分粒子枚举改名（如 `REDSTONE` → `DUST`、`EXPLOSION_LARGE` → `EXPLOSION`）。`spawnParticle` 会自动按名称做新旧互查，**新旧枚举名都可以直接使用**，同一份脚本在 1.20.x 和 1.21.x 服务端上无需修改：

| 新名称（1.20.5+） | 旧名称（1.20.4 及以下） |
|------|------|
| `DUST` | `REDSTONE` |
| `SMOKE` / `LARGE_SMOKE` | `SMOKE_NORMAL` / `SMOKE_LARGE` |
| `EXPLOSION` / `EXPLOSION_EMITTER` / `POOF` | `EXPLOSION_LARGE` / `EXPLOSION_HUGE` / `EXPLOSION_NORMAL` |
| `WITCH` / `ENTITY_EFFECT` | `SPELL_WITCH` / `SPELL_MOB` |
| `HAPPY_VILLAGER` / `ANGRY_VILLAGER` | `VILLAGER_HAPPY` / `VILLAGER_ANGRY` |
| `ENCHANT` / `FIREWORK` / `TOTEM_OF_UNDYING` | `ENCHANTMENT_TABLE` / `FIREWORKS_SPARK` / `TOTEM` |
| `SPLASH` / `BUBBLE` / `RAIN` | `WATER_SPLASH` / `WATER_BUBBLE` / `WATER_DROP` |
| `ITEM` / `BLOCK` | `ITEM_CRACK` / `BLOCK_CRACK` |

`spawnDust`、`drawPath` 系列方法内部也做了同样的兼容处理，无需关心服务端版本。

## 注意事项

- `setTime` 参数为 Minecraft 时间：0=日出，6000=正午，12000=日落，18000=午夜
- `sound` 参数使用 Minecraft 音效 ID，如 `"entity.wither.spawn"`
- `spawnParticle` 的 `name` 使用 Bukkit Particle 枚举名（新旧名称均可，见上表）；未知名称会在控制台打印警告
- 需要额外数据参数的粒子（如 `DUST` 需要颜色）用 `spawnParticle` 生成时会回退为 `FLAME`；彩色粒子请使用 `spawnDust` / `spawnDustTransition`
- `spawnDust` RGB 范围为 0-255，`size` 为粒子大小（0.5-4.0）
- `drawPath` 和 `drawPathToAll` 会从玩家位置到目标点绘制粒子路径，粒子仅对目标玩家可见
- `density` 控制粒子密度，`maxDist` 控制最大显示距离
