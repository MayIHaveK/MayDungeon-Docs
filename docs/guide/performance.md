# 性能调优

本页面向服主，说明遇到加载慢、TPS 下降或内存占用偏高时应如何调整。修改 `config.yml` 后，建议重启服务器使世界和存储相关设置完整生效。

## 先确认瓶颈

| 现象 | 优先检查 |
|------|----------|
| 进入副本等待很久 | 模板地图大小、磁盘速度、`copy-mode` |
| 多队同时开本时卡顿 | `max-concurrent-copies`、队列并发、区块预加载预算 |
| 副本运行一段时间后内存上升 | 实例视距、空闲区块卸载、控制台中的世界回收警告 |
| 怪物阶段 TPS 下降 | 同时存活怪物数、技能频率、脚本定时器间隔 |
| 玩家数据保存造成波动 | 存储后端和保存间隔 |

可使用 `/md admin instances` 查看当前实例，结合服务端自带的 TPS/MSPT 信息或 spark 定位高峰发生在创建阶段还是战斗阶段。

## 推荐起点

```yaml
world:
  max-concurrent-copies: 2
  create-interval: 1000
  copy-mode: "copy"
  idle-chunk-unload: true
  preload-chunk-radius: 3
  preload-chunks-per-tick: 4
  instance-view-distance: 6
  void-outside-template: true
  pool:
    enabled: false

dungeon:
  queue:
    enabled: true
    max-concurrent: 1
```

上述示例使用 `copy` 隔离模板文件；插件默认值仍为 `link`。每个副本可覆盖复制方式和生命周期，CustomNPCs 等复杂模组场景建议使用 `copy`。当前 `link` 只共享地形文件，仍要求作者防止共享文件写盘。详见 [世界管理](./world-management.md#customnpcs-与实体残留)。

### 地图加载慢

- `copy-mode: "copy"` 会增加复制耗时和磁盘占用，但能隔离模板文件。只有确认运行环境不会写入共享存档文件时，才考虑 `link`；文件系统不支持硬链接时会自动回退为完整复制。使用 CustomNPCs 等模组动态生成实体的副本应保持 `copy`。
- 精简模板世界，只保留副本需要的区块；删除 `playerdata`、`stats` 等无关数据。
- `preload-chunk-radius` 越大，首次进入前加载的区块越多。小地图通常使用 `2-3` 即可。
- 适当提高 `preload-chunks-per-tick` 可缩短等待，但会增加单 tick 压力；卡顿时应降低。
- 地图变化能由作者完整还原时，可以使用 `reusable`，成功还原后复用世界，省去连续刷本的重复复制和加载；不能完整还原的副本保持 `disposable`。

### 运行时内存偏高

- 将 `instance-view-distance` 设为 `4-6`；设为 `0` 表示跟随服务端默认视距。部分混合端不支持单世界设置接口，配置可能不生效，需以实际加载区块数验证。
- 保持 `idle-chunk-unload: true`。
- 保持 `void-outside-template: true`，避免玩家越界时生成大量新地形。确实依赖模板外原版地形的地图才关闭它。
- 用 `/md admin worlds` 查看空闲世界、加载区块数和回收倒计时；`reusable` 结束后暂时保留空闲世界是正常行为。若持续停在回收失败状态，请保存日志，不要手动删除仍处于加载状态的目录。

## 按需常驻与多开

每个副本设置 `world.mode: reusable`、`world.max-instances: 3`，表示最多三个独立槽位，不会自动创建三个世界。只有一队反复挑战时，复用一个即可；出现并发才增加。`world.reuse.max-idle` 限制空闲保留数，`idle-timeout-minutes` 控制每个世界还原完成后的闲置回收时间。

常驻可以减少重复创建开销，但空闲世界仍可能占用内存或有模组 tick。建议先保留一个空闲世界，并设置全局 `world.max-idle-worlds`；还可以用全局 `world.max-total-instances` 限制总量。超过槽位上限的队伍排队，不通过增加复制线程强行开更多世界。

两个生命周期都允许 `link` / `copy`。只限制一个实例、自行生成删除实体的副本也可选 `link`，但必须同时避免地形文件写盘；单实例和自动删除 NPC 都不是文件隔离。还原脚本需覆盖未加载实体、地图变化和外部任务，不能仅写 `return true` 当作自动还原。见 [还原脚本](./world-management.md#还原脚本)。

## 世界池

旧文件预复制池可以把地图复制提前到后台，但入场时仍需加载世界。它只对 `disposable` 且 `max-instances: 0` 生效，常驻和有限槽位模式跳过预热：

```yaml
world:
  pool:
    enabled: true
    dungeons:
      test_dungeon:
        cache-size: 2
    refill-interval: 30
```

先从 `cache-size: 1` 或 `2` 开始观察。低频副本不建议配置缓存。

## 怪物与脚本

- 单波尽量控制在 10 只以内，同时存活怪物建议不超过 30 只。
- 大批怪物分波生成，避免同一 tick 创建大量实体。
- 周期任务通常不要短于 20 tick；高频事件中避免全员遍历、命令连发和大量粒子。
- 用 `monsters.remaining()` 判断清场，无需自行扫描世界实体。
- 结束阶段记得取消不再需要的定时任务。

## 存储选择

| 场景 | 建议 |
|------|------|
| 单服、小规模 | YAML |
| 单服、玩家数据较多 | SQLite |
| 多服共享或独立数据库 | MySQL |

`stamina.save-interval`、`daily-limit.save-interval` 和 `revive-coin.save-interval` 越短，写入越频繁。默认值通常足够；只有确认写入是瓶颈后再逐步提高，不要把间隔设得过长。
