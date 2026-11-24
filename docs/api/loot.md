# loot - 权重掉落表与多源发奖

`loot` 对象统一处理权重抽取、保底/首通奖励与多来源物品发放（原版物品、MythicMobs `mm:`、Overture `ot:`、Vault 金币 `money:`、受控命令）。既可以在脚本内用 `defineTable(...)` 注册，也可以直接在 `dungeon.yml` / `presets.yml` 的 `loot.<表名>` 节点配置。

## 方法列表

| 方法 | 返回值 | 说明 |
| --- | --- | --- |
| `defineTable(tableId, entries)` | void | 注册内存掉落表；条目支持 `item`、`amount`、`min`/`max`、`weight`（>0 进权重池）、`chance`（无权重时的独立概率 `0.0-1.0`）、`money`、`command` |
| `roll(tableId, rolls)` | List | 按权重抽取 `rolls` 次并返回抽中条目列表（不发奖，供脚本自行展示/二次加工） |
| `grantTable(players, tableId)` | int | 为指定玩家或玩家列表按掉落表发放 1 轮奖励（`players` 传 `null` 自动发给副本全员） |
| `grantTable(players, tableId, rolls)` | int | 指定权重抽取次数并发奖，返回成功发放条目总数 |
| `grantFirstClear(players, tableId)` | int | 仅向尚未通关过本副本（`records.isFirstClear(p)`）的玩家发放首通奖励表 |
| `grantItem(player, itemSpec, amount)` | boolean | 统一发放单个奖励：原版材质名、`mm:ItemId`、`ot:ItemId` 或 `money:500` |

## 配置示例（`dungeon.yml` 内联掉落表）

```yaml
presets:
  loot:
    clear_rewards:
      - item: "DIAMOND"
        min: 2
        max: 5
        weight: 60
      - item: "mm:DragonCore"
        amount: 1
        weight: 15
      - item: "ot:star_shard"
        amount: 3
        weight: 25
      - money: 1000
        chance: 1.0
```

```javascript
// onComplete 钩子中一行发奖（先发首通，再记录通关！）
loot.grantFirstClear(players.getAll(), 'first_clear_bonus');
loot.grantTable(players.getAll(), 'clear_rewards', 2);
records.recordClear(players.getAll(), dungeon.getElapsedTime());
```
