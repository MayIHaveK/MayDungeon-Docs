# 世界管理与统一槽位引擎

MayDungeon v2 将原先割裂的三套世界缓存与 6 个碎片预加载参数收口为单一 **世界槽位引擎（`WorldSlotEngine`）**：

- 想 **首局秒进（`< 15ms`）** → 配置 `world.slots.standby: 1`（支持 `disposable`，无需写还原脚本）
- 想 **打完不销毁直接复用** → 配置 `world.lifecycle: reusable`（配合 `onReset` / `blocks.restoreAll()`）
- 想 **避免模组服卡预加载** → 保持默认 `world.preload.mode: none`（0ms 跳过阻塞预加载，交由服务端传送自然流式加载）

## 1. 准备模板地图

1. 确认地图当前未被服务器加载，执行 `/md admin import <世界名>`（或在停服时放入 `plugins/MayDungeon/maps/<地图名>/`）。
2. 在副本的 `dungeon.yml` 设置 `map-name: "<地图名>"`。
3. 执行 `/md admin reload`。

## 2. 统一配置模型（全局默认 + 单副本按需覆盖）

```yaml
# config.yml（全局默认）
world:
  instance-dir: "instances"
  creator: "auto"                 # auto（NMS/Mohist 专用路径）/ bukkit
  isolation: "link"               # link（硬链接地形，快）/ copy（完整隔离，CustomNPCs推荐）
  lifecycle: "disposable"         # disposable（每局销毁）/ reusable（还原复用）
  void-outside-template: true
  view-distance: 6

  slots:
    max-active: 0                 # 单副本槽位上限（0 = 不限）
    standby: 0                    # 默认 L1 热备数
    idle-keep: 1                  # reusable 模式空闲留存数
    idle-timeout-minutes: 10      # 空闲超时销毁（分钟）

  preload:
    mode: "none"                  # none（0ms跳过，默认）/ spawn（仅等落点1块）/ radius（等核心半径）
    radius: 1                     # 仅 mode=radius 生效（1 = 3x3）
    background-radius: -1         # 传送后后台补载半径（-1 = 关闭）
    budget-ms: 3
    timeout-seconds: 60

  limits:
    max-total-worlds: 0           # 全服世界上限
    standby-enabled: true
    max-total-standby: 4          # 全服 L1 热备总上限
    max-total-idle: 8             # 全服空闲复用总上限
    min-free-oldgen-percent: 15   # 老年代（Old Gen）可用百分比守卫（0 = 关闭）
    standby-refill-seconds: 15
    world-boss-prewarm-seconds: 30
    standby-dungeons:
      ldz: 1
```

在单个副本 `dungeons/<id>/dungeon.yml` 中只需覆写有差异的字段：

```yaml
world:
  isolation: "copy"
  lifecycle: "reusable"
  slots:
    max-active: 3
    standby: 1
    idle-keep: 1
  preload:
    mode: "spawn"
```

> 旧版键名（`copy-mode`、`mode`、`max-instances`、`reuse.*`、`warm-standby.*`、`preload-core-radius`、`preload-chunk-radius`）均保持 100% 向下兼容；旧 `world.pool` 已标记废弃，建议统一使用 `world.slots.standby`。

## 3. L1 热备与老年代（Old Gen）堆内存守卫

- **兼容 `disposable` 与 `reusable`**：玩家领走 L1 热备世界后，后台在 `standby-refill-seconds` 自动补好下一个全新空白世界。
- **老年代内存守卫**：v2 内存守卫直接采样 JVM **Old Gen / Tenured** 真实占用，彻底消除 G1GC 年轻代未回收时误判堆满暂停预热的假告警。
- **世界 Boss 自动开场预热**：保持 `world-boss-prewarm-seconds: 30`，世界 Boss 定时开启前 30 秒自动预热 1 个世界，无需长期占槽。

## 4. `reusable` 常驻复用与自动方块回滚

常驻复用模式需要 `scripts/on_reset.js` 或单文件 `scripts/dungeon.js` 中的 `onReset` 钩子同步完成还原并显式返回布尔 `true`：

```javascript
// scripts/dungeon.js 中的 onReset 钩子（也可继续使用 scripts/on_reset.js）
defineDungeon({
  onReset({ blocks, event }) {
    // 若本局使用过 blocks API 修改方块，还原前已自动触发回滚，此处亦可显式确认
    blocks.restoreAll();
    return true;
  }
});
```

## 5. CustomNPCs 与复杂模组隔离

若副本使用 CustomNPCs 或会写入区域实体的 Mod，建议在该副本 `dungeon.yml` 中配置 `world.isolation: "copy"`，确保与模板目录完全隔离。

## 6. 日常检查命令

- `/md admin worlds [副本ID|all] [页码]`：查看热备、运行、空闲复用世界状态及 P50/P95 入场统计。
- `/md admin engine`：查看脚本引擎、JVMCI 建议、预加载模式与 L1 热备老年代水位诊断。
