# 性能优化

本节介绍如何优化 MayDungeon 的运行性能，确保服务器稳定。

## 常见性能瓶颈

| 瓶颈 | 原因 | 解决方案 |
|------|------|----------|
| 世界复制慢 | 模板世界过大 | 精简模板，只保留必要区块 |
| TPS 下降 | 怪物数量过多 | 分批生成，限制同时存活数 |
| 内存不足 | 实例世界未回收 | 调低 max-worlds，检查清理逻辑 |
| 磁盘 IO | 频繁创建/删除世界 | 使用 SSD，或 Slime 格式 |

## 世界优化

```yaml
# config.yml
world:
  copy-method: "slime"  # 使用 Slime 格式加速复制
  max-worlds: 10
  preload-count: 2  # 预加载实例数
  chunk-load-radius: 3  # 减少加载区块半径
```

### 模板世界瘦身

- 使用 WorldBorder 限制世界大小
- 删除无用区块（使用 MCA Selector）
- 关闭副本世界的自动保存

## 脚本优化

```javascript
// 避免：每tick遍历所有玩家
function on_timer(id) {
    // 好的做法：使用缓存变量
    if (id === "check") {
        var count = monsters.remaining();
        if (count <= 0) {
            dungeon.complete();
        }
    }
}
```

### 脚本注意事项

- 避免在高频事件中执行复杂计算
- 定时器间隔不要太短（建议 >= 20 tick）
- 使用 `dungeon.timer()` 替代循环检测

## 怪物优化

- 单次生成不超过 10 只怪物
- 控制副本内最大存活怪物数（建议 <= 30）
- 远离玩家的怪物可暂时冻结 AI

```javascript
monsters.setMaxAlive(30);
monsters.setFreezeDistance(48);
```

## 监控命令

| 命令 | 说明 |
|------|------|
| `/md status` | 查看当前运行实例状态 |
| `/md debug tps` | 查看插件对 TPS 影响 |
| `/md debug memory` | 查看内存使用 |
| `/md debug timings` | 查看各阶段耗时 |

## 推荐配置

| 服务器规模 | max-worlds | 预加载 | 建议内存 |
|-----------|-----------|--------|---------|
| 小型 (< 20人) | 5 | 1 | 4 GB |
| 中型 (20-50人) | 10 | 2 | 8 GB |
| 大型 (50+人) | 20 | 3 | 16 GB |
