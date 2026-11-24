# 事件脚本与单文件写法

MayDungeon v2 同时支持两种脚本组织方式，且两者可以混用：

1. **推荐（v2 单文件模式）**：在 `scripts/dungeon.js`（或 `scripts/main.js`）中用 `defineDungeon({ ... })` 一次性定义所有钩子，全副本只编译一次、共享顶层变量与 JIT 热代码。
2. **经典（多文件模式，100% 兼容）**：在 `scripts/` 下按事件名创建独立 `on_*.js` 文件；开启多难度时采用 **级联继承（`scripts/<难度>/` 优先，缺失自动回退根目录 `scripts/`）**，不再需要把公共脚本复制粘贴两份！

## 事件与钩子对照表

单文件 `dungeon.js` 同时识别 **camelCase** 与 **snake_case** 钩子名：

| 传统文件名 | `defineDungeon` 钩子名 | 触发时机 | `trigger` |
| --- | --- | --- | --- |
| `on_init.js` | `onInit` | 取得世界后、玩家传入前（复用世界也会执行） | `null` |
| `on_start.js` | `onStart` | 玩家全部传入副本，正式开始 | `null` |
| `on_player_join.js` | `onPlayerJoin` | 玩家加入副本 | 加入的玩家 |
| `on_player_rejoin.js` | `onPlayerRejoin` | 玩家断线重连回副本 | 重连的玩家 |
| `on_player_quit.js` | `onPlayerQuit` | 玩家退出副本 | 退出的玩家 |
| `on_player_death.js` | `onPlayerDeath` | 玩家死亡 | 死亡的玩家 |
| `on_monster_kill.js` | `onMonsterKill` | 怪物被击杀 | 击杀者（可能 `null`） |
| `on_damage.js` | `onDamage` | 玩家对副本实体造成有效伤害 | 攻击者 + `event` Map |
| `on_group_clear.js` | `onGroupClear` | 怪物组全灭（自动联动 `stages` 推进） | `null` + `event.get("group")` |
| `on_area_enter.js` | `onAreaEnter` | 玩家进入已定义区域 | 进入的玩家 |
| `on_area_leave.js` | `onAreaLeave` | 玩家离开已定义区域 | 离开的玩家 |
| `on_interact.js` | `onInteract` | 玩家右键方块 | 交互的玩家 |
| `on_entity_interact.js` | `onEntityInteract` | 玩家右键实体/NPC | 交互的玩家 |
| `on_boss_reward.js` | `onBossReward` | 世界 Boss 成功结束排行奖励（先于 `onReward`） | `null` |
| `on_reward.js` | `onReward` | 通关发奖（仅成功时） | `null` |
| `on_complete.js` | `onComplete` | 副本判定成功 | `null` |
| `on_fail.js` | `onFail` | 副本判定失败 | `null` |
| `on_end.js` | `onEnd` | 副本结束收尾（无论成败） | `null` |
| `on_reset.js` | `onReset` | `reusable` 世界还原（必须同步还原并 `return true`；若使用过 `blocks` 会自动先回滚方块） | `null` |

## 性能机制：事件存在性位图（0ns 跳过）

副本加载或首次触发时，引擎会为当前作用域生成 `int eventMask` 存在性位图。对于 `on_damage` 等每秒触发数十上百次的高频事件，如果副本未定义对应脚本，热路径通过一次位运算 **0ns 零分配直接跳过**，不会产生任何 GC 压力。

## 执行顺序

```text
onInit → onPlayerJoin(×N) → onStart → [运行时事件] → onComplete/onFail → [onBossReward] → onReward → onEnd → [onReset]
```

## 单文件写法示例（GraalJS ES2023+）

```javascript
// dungeons/demo/scripts/dungeon.js
const { warnAndStrike } = require('common/boss-utils');

defineDungeon({
  onInit({ dungeon, world, stages }) {
    world.setTime(14000);
    stages.define('wave1', { group: 'g1', next: 'boss' });
    stages.define('boss', { group: 'boss_g', completeOnClear: true });
  },
  onStart({ stages, bossbar }) {
    stages.start('wave1');
    bossbar.show('main', '&6讨伐进行中', 1.0, 'YELLOW');
  },
  onDamage({ trigger, event, combat }) {
    const dmg = event.get('damage');
    if (dmg > 50 && combat.cooldown(trigger.getPlayer(), 'fx', 1000)) {
      combat.particleRing(trigger.getPlayer(), 'FLAME', 1.5, 16);
    }
  },
  onComplete({ loot, records, players, dungeon }) {
    loot.grantFirstClear(players.getAll(), 'first_clear');
    loot.grantTable(players.getAll(), 'clear', 2);
    records.recordClear(players.getAll(), dungeon.getElapsedTime());
  }
});
```

## 难度级联覆盖示例

开启多难度后，只需把公共逻辑放在根目录 `scripts/`，在难度子目录（如 `scripts/Hard/`）里只放差异文件：

```text
scripts/
├── on_init.js      ← 所有难度自动继承
├── on_damage.js    ← 所有难度自动继承
└── Hard/
    └── on_start.js ← 仅覆盖困难难度的开场刷怪！
```
