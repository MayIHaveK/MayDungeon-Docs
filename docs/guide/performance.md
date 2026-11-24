# 性能调优

本页面向服主，说明如何把 **入场加载、脚本执行与数据存储** 调优至最佳状态。

## 一、副本秒进调优（世界入场）

MayDungeon v2 结合了 **0ms 跳过阻塞预加载** 与 **L1 内存热备**，让冷启动和热门本都足够丝滑：

| 入场模式 | 典型端到端耗时 | 常驻内存 | 推荐配置 |
| --- | :---: | :---: | --- |
| **L1 内存热备 / 空闲复用** | **< 15 ms（同 Tick 瞬传）** | 极低 | `world.slots.standby: 1`（或在 `world.limits.standby-dungeons` 指定） |
| **默认冷创建（跳过阻塞预加载）** | **40 – 180 ms** | 0 MB | 保持默认 `world.preload.mode: "none"` + `world.creator: "auto"` |
| **指定核心预加载** | 视磁盘与模组而定 | 0 MB | 如需玩家传送前先等落点加载完，可按副本设为 `world.preload.mode: "spawn"` 或 `"radius"` |

::: tip 为什么 Mohist 等模组服强烈推荐 `preload.mode: "none"`？
在 Mohist / Forge 混合端上，主动登记 `ENTITY_TICKING` 区域票据等待 9–49 个区块会连带触发周围模组实体与邻接区块计算，反而拉长进本等待。保持默认 `preload.mode: "none"` 后，插件跳过阻塞等待并立即传送，由服务端仅同步加载玩家落点 1 个区块（~10ms）再按玩家视距自然流式下发周边区块，体验最快也最稳。
:::

### 推荐起点配置

```yaml
world:
  creator: "auto"
  isolation: "link"          # CustomNPCs / 复杂模组副本可按副本覆盖为 copy
  lifecycle: "disposable"
  void-outside-template: true
  view-distance: 6
  adaptive-create-interval: true
  adaptive-min-interval-ms: 150
  preload:
    mode: "none"             # 0ms 跳过阻塞预加载
    background-radius: -1
  limits:
    standby-enabled: true
    max-total-standby: 4
    min-free-oldgen-percent: 15
    standby-refill-seconds: 15
    world-boss-prewarm-seconds: 30
    standby-dungeons:
      # 为高频热门副本开启 1 个 L1 热备槽位
      # test_dungeon: 1
```

## 二、脚本性能调优（GraalJS + Truffle JIT）

1. **安装 `MayJS-GraalJS.jar`**（可脱离 `MayJS` 独立运行）并保持 `script.engine: "auto"`。
2. **搭配 GraalVM for JDK 21.0.6+（含 JVMCI 24+）**：
   - 普通 OpenJDK 21 或旧版 GraalVM `21+35-jvmci-23.1` 只能以纯解释模式运行 GraalJS；
   - 换用 **Oracle GraalVM / GraalVM CE 21.0.6+** 即可零配置开启 **Truffle JIT** 峰值编译！
3. **在线实测与切换**：
   - 执行 `/md admin engine` 查看精准 JVMCI 诊断；
   - 执行 `/md admin engine bench` 实测单次调用耗时（ns）与吞吐量（ops/s）；
   - 执行 `/md admin engine switch <graaljs|nashorn> [--save]` 免重启切换引擎。
4. **脚本编写最佳实践**：
   - 优先使用单文件 `scripts/dungeon.js`（整个副本只编译 1 次、共享 JIT 热代码）；
   - 不需要高频监听 `on_damage` 的副本不要建空 `on_damage.js`（事件位图可 0ns 直接跳过）；
   - 高频逻辑使用 `combat.cooldown(...)` 节流特效与范围伤害，避免全员遍历或每 tick 刷大量粒子。

## 三、存储与内存调优

- **推荐存储**：单服优先使用 `storage.type: sqlite`（WAL 模式单文件库，避免大量小文件 I/O 抖动）；使用 `yaml` 时保持 `yaml-format: unified`（单玩家单文件 `data/players/<uuid>.yml`）。
- **JVM 堆内存建议**：Mohist 1.20.1 模组服建议至少分配 `-Xms2G -Xmx6G` + G1GC（`-XX:+UseG1GC -XX:MaxGCPauseMillis=50`），避免老年代常驻占满导致 GC 抖动或暂停 L1 热备。
- **定期排查命令**：`/md admin worlds`、`/md admin instances`、`/md admin engine`。
