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
  copy-mode: "link"
  idle-chunk-unload: true
  preload-chunk-radius: 3
  preload-chunks-per-tick: 4
  instance-view-distance: 6
  void-outside-template: true
  pool:
    enabled: false

dungeon:
  queue:
    enabled: false
    max-concurrent: 3
```

### 地图加载慢

- 优先使用 `copy-mode: "link"`。文件系统不支持硬链接时插件会自动回退为完整复制。
- 精简模板世界，只保留副本需要的区块；删除 `playerdata`、`stats` 等无关数据。
- `preload-chunk-radius` 越大，首次进入前加载的区块越多。小地图通常使用 `2-3` 即可。
- 适当提高 `preload-chunks-per-tick` 可缩短等待，但会增加单 tick 压力；卡顿时应降低。
- 玩家频繁重复进入同一地图时，再考虑为该副本启用世界池。

### 运行时内存偏高

- 将 `instance-view-distance` 设为 `4-6`；设为 `0` 表示跟随服务端默认视距。
- 保持 `idle-chunk-unload: true`。
- 保持 `void-outside-template: true`，避免玩家越界时生成大量新地形。确实依赖模板外原版地形的地图才关闭它。
- 用 `/md admin instances` 确认已经结束的实例不再出现。若控制台持续提示实例世界无法回收，请保存日志并重启服务器，不要手动删除仍处于加载状态的世界目录。

## 世界池

世界池适合固定热门副本，可减少玩家点击开始后的等待时间，但会预先占用磁盘和内存：

```yaml
world:
  pool:
    enabled: true
    dungeons:
      test_dungeon:
        cache-size: 2
        instance-keep: false
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
