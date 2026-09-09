# 常见问题

## 安装相关

### 支持哪些服务端版本？

插件同时兼容 1.20.x 与 1.21.x 服务端，包括 Forge/Arclight/Mohist 等混合端。GUI 与粒子已做跨版本兼容处理；脚本中 `world.spawnParticle` 同时接受 1.20.5 前后的新旧粒子枚举名（如 `DUST` / `REDSTONE`），无需按版本修改脚本。

### 启动报 "JavaScript 引擎不可用"

需要安装 NashornJS 插件。将 `NashornJs.jar` 放入 `plugins/` 目录。

### 地图不存在的警告

这是正常提示。将地图文件放入 `plugins/MayDungeon/maps/<地图名>/` 后执行 `/md admin reload`。

### 怪物不生成

检查 MythicMobs 配置是否正确放入并 reload。执行 `/mm mobs` 确认怪物已注册。

### 授权验证失败

确认 `config.yml` 中的 `bind.qq` 与发布方提供的信息一致，并检查服务器能否正常联网。若仍失败，请保留完整启动日志联系发布方；不要公开粘贴授权文件或机器信息。

### Overture 物品消耗一直提示不足

确认服务器已安装并启用 Overture，且 `item-cost` 中的 ID 与 Overture 物品 ID 完全一致，例如：

```yaml
conditions:
  item-cost:
    - "overture:example_item:1"
```

如果 Overture 未启用，`overture:` 类型会被视为不足，但不会影响插件启动。

## 使用相关

### 副本卡住不结束

检查 `on_monster_kill.js` 中的通关条件逻辑。可以用 `/md admin forceend <实例ID>` 强制结束。

### 死亡后无法复活

确认 `dungeon.yml` 中 `revive.max-revive` 大于 0。使用 `/md revive` 命令复活。

### 怪物杀完了但没触发下一阶段

确认怪物的死亡方式——摔死、岩浆等非玩家击杀也会计入。用 `/md script monsters.getAliveCount("wave_1")` 检查剩余数量。

### 障碍物（门）不消失

检查 `obstacles.yml` 中的坐标是否在地图范围内。确认 `obstacles.define()` 在 `on_init.js` 中被正确调用。

### 安装 DragonMineZ 后，副本内无法近战攻击

当前版本会在玩家进出副本世界后自动补发 DragonMineZ 状态同步，无需额外开关。请先确认 MayDungeon 已更新到最新发布版并重新进本测试。

若问题仍能复现，可临时开启：

```yaml
dungeon:
  dbz:
    debug: true
    probe-interval-ticks: 20
```

重启后复现一次，保存控制台中的 `[DBZ]`、`[DBZ-PROBE]` 和 `[DBZ-DEBUG]` 日志，然后将 `debug` 改回 `false`。诊断模式只读取状态，但日志量很大，不要长期开启。

### 命令克隆的 CustomNPCs NPC 在副本重开后还在

先检查服务端 `plugins/MayDungeon/config.yml`。如果使用 `world.copy-mode: "link"`，请改为：

```yaml
world:
  copy-mode: "copy"
```

保存后重启服务器，再新开副本验证。已有服主反馈此设置解决了脚本执行克隆命令生成的 NPC 在下一局残留的问题。

默认 `disposable` 每次创建新世界，但旧版本 `link` 连实体存档也与模板共享，运行期间实体保存可能影响模板。当前版本已将实体和 POI 文件独立复制，地形仍共享；关闭自动保存不能保证隔离。`copy` 隔离全部文件，代价是增加磁盘占用和复制耗时，也可以仅在该副本的 `dungeon.yml` 中覆盖。

如果仍有残留，请先备份模板，再恢复干净地图或通过编辑器清除误写的 NPC 并保存；改配置不会删除模板中已有的 NPC。启用了世界池的，还需在修复模板后重新生成预缓存。详见 [世界管理](./guide/world-management.md#customnpcs-与实体残留)。

### 副本外出现大片虚空

默认 `world.void-outside-template: true`，模板地图现有区块之外不会生成原版地形。需要开放式原版地形的副本应改为 `false` 并重启服务器；普通封闭副本建议保持默认值。

### 常驻副本最多三个世界，会一直占用三个吗？

不会。`world.max-instances: 3` 是上限，世界按挑战需求创建；一队反复挑战可以一直复用同一个。还原完成后每个世界独立计时，超过 `world.reuse.idle-timeout-minutes` 自动销毁；超出 `world.reuse.max-idle` 的空闲世界提前回收。没有最低常驻数量。使用 `/md admin worlds` 可以看到模式、还原结果和回收倒计时。

### reusable 可以使用 link 吗？

可以，在该副本 `dungeon.yml` 设置 `world.copy-mode: link`。作者需要自行管理实体和地图还原，且防止共享地形写盘；最多一个实例也不代表写入安全。复杂模组场景建议 `copy`。两个复制模式都需要 `scripts/on_reset.js` 同步还原并返回布尔 `true` 才会复用，缺失或失败时销毁。详见 [世界管理](./guide/world-management.md#每副本覆盖与常驻复用)。

## 性能相关

### 同时运行多个副本卡顿

先降低 `world.max-concurrent-copies` 和 `world.preload-chunks-per-tick`，并缩小 `preload-chunk-radius`。使用 CustomNPCs 等模组动态生成实体时保持 `copy-mode: "copy"`，不要为加快复制而切回 `link`。详见 [性能调优](/guide/performance)。

### 脚本执行很慢

避免在高频事件（如 `on_monster_kill`）中做大量计算。使用 `tasks.startRepeating()` 替代轮询。

## 开发相关

### 如何调试脚本

1. 在 `config.yml` 中开启 `setting.debug: true`
2. 使用 `/md script <JS代码>` 在副本内实时执行
3. 用 `print(变量)` 输出到控制台

### trigger 为 null 怎么办

某些事件（如 `on_init`、`on_end`）没有触发者。脚本已有容错包装，访问 null 的 trigger 不会崩溃，只会打印警告。
