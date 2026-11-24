# 性能调优

本页面向服主，说明如何开启**副本秒加载与两阶段预加载**，以及遇到加载慢、TPS 下降或内存占用偏高时如何排查与调优。修改 `config.yml` 中世界与存储相关设置后，建议重启服务器使全部配置完整生效。

## 秒加载与两阶段预加载

MayDungeon 采用**三层世界入场架构**，把不依赖当前队伍的耗时前移到入场之前、把不影响安全落地的区块加载后移到传送之后：

| 路径层级 | 触发条件 | 典型端到端入场耗时 | 常驻内存 | 适用场景 |
| --- | --- | :---: | :---: | --- |
| **L1 内存热备 / 空闲复用** | 命中 `warm-standby` 热备槽位，或命中 `reusable` 空闲世界 | **< 15 ms（同 Tick 瞬传）** | 极低（每槽仅常驻核心 3×3 共 9 块） | 热门主线本、高频刷材料本、定时世界 Boss |
| **L2 磁盘预复制池** | 命中 `world.pool` 预复制目录 | **120 – 350 ms** | 0 MB | 中低频 `disposable` 副本、大型模板 |
| **L3 两阶段冷创建** | 未配置热备或突发并发超出热备槽位 | **150 – 450 ms** | 0 MB | 冷门副本、高并发兜底 |

### 1. 开箱即用的默认加速（零常驻内存）

即使不配置热备槽位，只要保持默认配置，以下优化就会自动生效：

- **空队列 0ms 直通**：`dungeon.queue.enabled: true` 在队列空闲且槽位充足时直接推进，不再等待 1 秒定时器轮询；前一个世界释放时也会事件唤醒下一队。
- **原生 NMS 世界创建**：`world.creator: "auto"` 在启动期预绑定对应版本的 NMS / Mohist 专用创建器，跳过原版出生点搜索与出生区常载，并缓存模板种子。
- **自适应创建节流**：`world.adaptive-create-interval: true` 会在热态 NMS 很快时自动将突发创建间隔压缩至 `adaptive-min-interval-ms`（默认 `150ms`），主线程卡顿时自动拉大保护 TPS。
- **两阶段同心圆预加载**：
  - **第一阶段（阻塞入场）**：只等待出生点周围 `world.preload-core-radius`（默认 `1`，即 **3×3 = 9 个区块**），相比整圈 7×7（49 块）减少 **82%** 阻塞等待。Paper 1.20.4+ / 1.21.x 自动并发扇出急迫异步加载；Mohist / Spigot 通过非阻塞 NMS 票据（`preload-tickets-per-tick: 64`）在单 tick 内完成登记。
  - **第二阶段（后台补载）**：玩家安全落地后，外环 `preload-core-radius + 1 .. preload-chunk-radius` 区块在后台按每 tick 预算平滑补齐，不卡主线程也不阻塞进入。

### 2. 开启 L1 内存热备（真·毫秒级瞬传）

L1 热备会在服务器空闲时提前完成「目录复制 → NMS 世界构造 → 出生核心 3×3 区块常驻」。默认总开关已开启，但**不会盲目预热所有副本**——你需要显式指定要为哪些热门副本保留热备槽位。

**方式 A：在主配置 `plugins/MayDungeon/config.yml` 统一指定（推荐）**

```yaml
world:
  creator: "auto"
  adaptive-create-interval: true
  adaptive-min-interval-ms: 150
  preload-chunk-radius: 3
  preload-core-radius: 1
  preload-tickets-per-tick: 64
  preload-chunks-per-tick: 4
  preload-budget-ms: 3
  instance-view-distance: 6
  void-outside-template: true

  warm-standby:
    enabled: true
    # 全服最多常驻的 L1 热备世界总数（0-32）
    max-total: 4
    # JVM 剩余堆内存低于该百分比时暂停预热；低于 (阈值 - 5%) 时自动回收热备槽位
    min-free-memory-percent: 25
    # 后台补水巡检间隔（秒，最小 3）；每次巡检最多预热 1 个世界，避免尖峰卡顿
    refill-interval-seconds: 15
    # 定时世界 Boss 开场前多少秒自动预热 1 个热备世界（0 = 关闭）
    world-boss-prewarm-seconds: 30
    # 热门副本的热备槽位数（单副本上限 8，受 max-total 约束）
    dungeons:
      test_dungeon: 1
      boss_raid: 1
```

**方式 B：在单个副本的 `dungeons/<副本ID>/dungeon.yml` 单独声明**

```yaml
world:
  warm-standby: 1   # > 0 时优先于主配置 world.warm-standby.dungeons.<副本ID>
```

::: tip L1 热备实用说明与避坑
- **兼容 `disposable` 与 `reusable`**：`disposable` 副本同样可以开启 L1 热备——玩家领走热备世界打完照常销毁，后台在 `refill-interval-seconds` 后自动补好下一局的全新空白世界，**不需要编写 `on_reset.js`**。
- **开服预热节奏**：插件启动后约 **6 秒** 开始首次巡检，每次巡检最多预热 1 个热备世界；配置了 3 个热备槽位且间隔为 `10s` 时，约 6–30 秒全部就绪。
- **低内存服务器调优**：若测试服或小内存服仅分配 `-Xmx2G`，启动后 JVM 剩余堆内存可能接近 20%–30%。可将 `min-free-memory-percent` 调至 `15`，避免内存守卫误判暂停预热；内存低于 `10%` 时仍会自动回收保稳定。
- **与槽位上限及重载协同**：热备世界受副本 `max-instances` 与全局 `max-total-instances`、`warm-standby.max-total` 严格限制，绝不突破维度上限。执行 `/md admin reload`、保存编辑器或导入新模板时，旧热备世界会自动淘汰并按新模板重新预热。
- **世界 Boss 自动开场预热**：无需在 `warm-standby.dungeons` 中长期占用槽位，只需保持 `world-boss-prewarm-seconds: 30` 且 `max-total` 留有余量，调度器会在定时开放前 30 秒自动预热。
:::

### 3. 如何验证秒加载是否生效

1. 执行 `/md admin engine`：查看入场通道（`Paper急迫异步` / `非阻塞票据`、`核心半径=1/3`）以及已记录的 `P50 / P95 / 最近耗时 / 瞬进率`。
2. 开服等待约 10–30 秒后执行 `/md admin worlds`：
   - 列表中出现 `[L1热备就绪]` 即表示热备世界已准备完毕；
   - 进本后再次执行 `/md admin worlds`，顶部会显示 `入场统计: 总计=… P50=…ms P95=…ms (L1热备=… 复用=… 磁盘池=… 新建=…)`。

---

## 先确认瓶颈

| 现象 | 优先检查 |
| --- | --- |
| 热门副本首局进本仍要等 1 秒以上 | 是否在 `warm-standby.dungeons` 配置了槽位、`/md admin worlds` 是否出现 `[L1热备就绪]`、堆内存是否低于 `min-free-memory-percent` |
| 非热备冷创建耗时偏高 | 模板地图大小、磁盘速度、`copy-mode`、`preload-core-radius`、`creator` 是否成功绑定 NMS |
| 多队同时开本时卡顿 | `max-concurrent-copies`、`adaptive-min-interval-ms`、队列并发、区块预加载预算 |
| 副本运行一段时间后内存上升 | `instance-view-distance`、`idle-chunk-unload`、`warm-standby.max-total`、控制台世界回收警告 |
| 怪物阶段 TPS 下降 | 同时存活怪物数、技能频率、脚本定时器间隔、是否启用 GraalJS + GraalVM JDK 21 |
| 玩家数据保存造成波动 | 存储后端和保存间隔 |

可使用 `/md admin engine`、`/md admin worlds` 和 `/md admin instances` 查看实时状态，结合服务端 TPS/MSPT 或 spark 定位瓶颈发生在入场阶段还是战斗阶段。

## 推荐起点

```yaml
world:
  creator: "auto"
  max-concurrent-copies: 2
  create-interval: 1000
  adaptive-create-interval: true
  adaptive-min-interval-ms: 150
  copy-mode: "copy"
  idle-chunk-unload: true
  preload-chunk-radius: 3
  preload-core-radius: 1
  preload-tickets-per-tick: 64
  preload-chunks-per-tick: 4
  preload-budget-ms: 3
  instance-view-distance: 6
  void-outside-template: true
  warm-standby:
    enabled: true
    max-total: 4
    min-free-memory-percent: 25
    refill-interval-seconds: 15
    world-boss-prewarm-seconds: 30
    dungeons:
      # 为高频热门副本开启 1 个 L1 热备槽位
      # test_dungeon: 1
  pool:
    enabled: false

dungeon:
  queue:
    enabled: true
    max-concurrent: 1
```

上述示例在全局使用 `copy` 以最大程度隔离模板文件；插件默认值为 `link`。每个副本可在自己的 `dungeon.yml` 中单独覆盖 `copy-mode`、生命周期和 `warm-standby`。CustomNPCs 等复杂模组场景建议使用 `copy`；详见 [世界管理](./world-management.md#customnpcs-与实体残留)。

### 地图加载慢排查

- `copy-mode: "copy"` 会增加复制耗时和磁盘占用，但能完整隔离模板文件。仅在确认运行环境不会写入共享地形文件时使用 `link`；不支持硬链接时会自动降级为复制。Linux XFS / Btrfs 环境会自动探测 CoW Reflink 以兼顾毫秒级克隆与写入隔离。
- 精简模板世界，只保留副本需要的区块；删除 `playerdata`、`stats` 等无关数据。
- 保持 `preload-core-radius: 1`（3×3 共 9 块），不要把它调到和 `preload-chunk-radius` 一样大，否则会重新退化为整圈全阻塞等待。
- 保持 `void-outside-template: true`，避免玩家视距越出模板时现场生成原版地形。
- 高频副本优先开启 `warm-standby`（无需写还原脚本）；地图可由脚本完整还原且希望反复复用同一个世界时，可额外结合 `mode: "reusable"`。

### 运行时内存偏高

- 将 `instance-view-distance` 设为 `4-6`；设为 `0` 表示跟随服务端默认视距。部分混合端不支持单世界设置接口，需以实际加载区块数验证。
- 保持 `idle-chunk-unload: true` 与 `void-outside-template: true`。
- 控制 `warm-standby.max-total`（通常 `2-4` 个热门副本即可）与 `max-idle-worlds`，避免常驻世界过多。
- 用 `/md admin worlds` 查看热备世界、空闲世界、加载区块数和回收倒计时；若持续停在回收失败状态，请保存日志，不要手动删除仍处于加载状态的目录。

## 按需常驻与多开

每个副本设置 `world.mode: reusable`、`world.max-instances: 3`，表示最多三个独立槽位，不会自动创建三个世界。只有一队反复挑战时，复用一个即可；出现并发才增加。`world.reuse.max-idle` 限制空闲保留数，`idle-timeout-minutes` 控制每个世界还原完成后的闲置回收时间。

常驻可以减少重复创建开销，但空闲世界仍可能占用内存或有模组 tick。建议先保留一个空闲世界，并设置全局 `world.max-idle-worlds`；还可以用全局 `world.max-total-instances` 限制总量。超过槽位上限的队伍排队，不通过增加复制线程强行开更多世界。

两个生命周期都允许 `link` / `copy`。只限制一个实例、自行生成删除实体的副本也可选 `link`，但必须同时避免地形文件写盘；单实例和自动删除 NPC 都不是文件隔离。还原脚本需覆盖未加载实体、地图变化和外部任务，不能仅写 `return true` 当作自动还原。见 [还原脚本](./world-management.md#还原脚本)。

## 旧文件预复制池（L2）

旧文件预复制池可以把地图复制提前到后台，但入场时仍需加载世界和预加载核心区块；多数场景直接用上方的 **L1 内存热备 (`warm-standby`)** 体验更好。`world.pool` 仅对 `disposable` 且 `max-instances: 0` 生效，常驻和有限槽位模式跳过预热：

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

## 怪物与脚本性能

- **脚本引擎加速**：安装 `MayJS-GraalJS.jar`（**可脱离 MayJS 独立运行**，无需额外安装 MayJS）并保持 `script.engine: "auto"`，即可在 JDK 21+ 上自动启用 **GraalJS 24.2.2**、原生 ES2023+ 语法及语句数/超时双重熔断保护；使用 **GraalVM JDK 21** 运行服务端还可零配置启用 **Truffle JIT** 峰值编译性能。执行 `/md admin engine` 可确认是否已启用 JIT。
- 单波尽量控制在 10 只以内，同时存活怪物建议不超过 30 只。
- 大批怪物分波生成，避免同一 tick 创建大量实体。
- 周期任务通常不要短于 20 tick；高频事件（如 `on_damage`）中避免全员遍历、命令连发和大量粒子。
- 用 `monsters.remaining()` 判断清场，无需自行扫描世界实体。
- 结束阶段记得取消不再需要的定时任务。

## 存储选择

| 场景 | 建议 |
| --- | --- |
| 单服、小规模 | YAML |
| 单服、玩家数据较多 | SQLite |
| 多服共享或独立数据库 | MySQL |

`stamina.save-interval`、`daily-limit.save-interval` 和 `revive-coin.save-interval` 越短，写入越频繁。默认值通常足够；只有确认写入是瓶颈后再逐步提高，不要把间隔设得过长。
