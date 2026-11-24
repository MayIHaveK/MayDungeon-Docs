# combat - 战斗技能、冷却与几何粒子预警

`combat` 对象将 Boss 技能脚本中最常见的机制（AOE 伤害、真伤、群体药水、击退/牵引、技能冷却、圆环/扇形/连线/光柱粒子及地面延时预警圈）封装为一行调用，避免手写大量三角函数和调度代码。

## 方法列表

### 技能冷却

| 方法 | 返回值 | 说明 |
| --- | --- | --- |
| `cooldown(owner, key, durationMs)` | boolean | 原子检查并消耗冷却：就绪返回 `true` 并写入新冷却，否则返回 `false`（`owner` 可传玩家、实体、玩家名或 `"boss"`） |
| `remainingCooldown(owner, key)` | long | 剩余冷却毫秒数（`0` 表示已就绪） |
| `resetCooldown(owner, key)` | void | 立即清除指定冷却 |

### 伤害、治疗、药水与位移

| 方法 | 说明 |
| --- | --- |
| `damage(target, amount, trueDamage)` | 对单体目标造成普通伤害或无视护甲真伤（`target` 可为实体或玩家名） |
| `heal(target, amount)` | 为目标恢复生命值（自动钳位至最大血量） |
| `aoeDamage(x, y, z, radius, damage, trueDamage)` | 以坐标为球心对范围内玩家造成伤害 |
| `aoeDamage(x, y, z, radius, damage, trueDamage, targetType)` | 指定目标类型：`"players"` / `"monsters"` / `"all"` |
| `aoeDamageAround(entityOrLoc, radius, damage, trueDamage)` | 以实体/位置为中心触发范围伤害 |
| `applyPotion(target, effectName, durationTicks, amplifier)` | 施加药水效果（如 `"SLOWNESS"`、`"BLINDNESS"`） |
| `aoePotion(x, y, z, radius, effectName, durationTicks, amplifier, targetType)` | 群体施加药水效果 |
| `knockback(target, originX, originY, originZ, strength, upward)` | 从指定原点向外击退目标 |
| `pull(target, destX, destY, destZ, strength)` | 将目标向指定坐标牵引 |

### 几何粒子特效与技能预警

| 方法 | 说明 |
| --- | --- |
| `particleRing(centerOrX, ..., particle, radius, points)` | 在圆周上生成粒子光环（支持传入 `Location` / 实体 / 玩家名或 `x, y, z`） |
| `particleLine(x1, y1, z1, x2, y2, z2, particle, points)` | 在两点间绘制粒子射线 |
| `particlePillar(x, y, z, particle, height, points)` | 生成垂直粒子光柱 |
| `particleCone(origin, particle, radius, angleDegrees, points)` | 按实体朝向绘制扇形预警弧 |
| `telegraph(x, y, z, radius, delayTicks, particle, onDetonate)` | **地面预警技能**：每 4 tick 刷一次脉冲圆环，等待 `delayTicks` 后自动执行 `onDetonate` 回调（副本结束自动取消） |

## 使用示例

```javascript
// Boss 地面红圈预警 -> 2 秒后引爆 AOE 真伤 + 击飞
combat.telegraph(20, 65, 20, 4.5, 40, 'FLAME', () => {
  combat.aoeDamage(20, 65, 20, 4.5, 12.0, true, 'players');
  combat.particlePillar(20, 65, 20, 'EXPLOSION_LARGE', 6.0, 12);
});
```
