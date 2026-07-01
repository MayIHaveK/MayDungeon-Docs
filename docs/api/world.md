# world 世界操作

`world` 对象提供对副本实例世界的控制能力。

## 方法一览

| 方法 | 说明 |
|------|------|
| `world.setTime(ticks)` | 设置世界时间 |
| `world.getTime()` | 获取当前世界时间 |
| `world.setWeather(type)` | 设置天气：`CLEAR`、`RAIN`、`THUNDER` |
| `world.setBlock(x, y, z, material)` | 设置方块 |
| `world.getBlock(x, y, z)` | 获取方块类型名 |
| `world.fillBlocks(x1, y1, z1, x2, y2, z2, material)` | 批量填充方块 |
| `world.playEffect(x, y, z, effect, data)` | 播放粒子效果 |
| `world.playSound(x, y, z, sound, volume, pitch)` | 在坐标播放音效 |
| `world.explosion(x, y, z, power, fire, breakBlocks)` | 创建爆炸 |
| `world.lightning(x, y, z, damage)` | 召唤闪电 |
| `world.getWorldName()` | 获取副本世界名称 |

## 使用示例

```javascript
// on_init.js - 副本初始化设置环境
world.setTime(18000); // 设为夜晚
world.setWeather("THUNDER"); // 雷暴天气
```

```javascript
// on_complete.js - 通关时打开出口
world.fillBlocks(100, 64, 200, 102, 66, 200, "AIR"); // 移除墙壁
world.playEffect(101, 65, 200, "END_GATEWAY_SPAWN", 0);
world.playSound(101, 65, 200, "ENTITY_ENDER_DRAGON_DEATH", 1.0, 1.0);
```

```javascript
// 动态关门效果
world.fillBlocks(95, 64, 195, 97, 67, 195, "IRON_BARS");
dungeon.broadcastSound("BLOCK_IRON_DOOR_CLOSE", 1.0, 0.8);
dungeon.broadcast("&c大门关闭了！无路可退！");
```

## 注意事项

- 所有坐标均为副本实例世界内的绝对坐标
- 方块操作是同步的，大量操作建议分帧执行（使用 `tasks.startRepeating`）
- 副本世界在结束后会被完整删除，不需要担心方块修改的持久化问题
