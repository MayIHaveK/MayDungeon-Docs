# 故障恢复

MayDungeon 提供了多种机制确保副本异常时数据安全和玩家体验。

## 自动恢复机制

### 服务器崩溃恢复

当服务器意外关闭时，插件在重启后会：

1. 检测未正常结束的副本实例
2. 恢复副本中玩家的位置和背包
3. 清理残留的实例世界

### 玩家断线重连

```yaml
# dungeon.yml
allow-rejoin: true
rejoin-timeout: 120  # 允许 120 秒内重连
```

断线玩家重连后会被传送回副本中的上次位置。超过重连时间则视为退出。

## 数据保护

### 背包快照

进入副本前插件会保存玩家完整背包数据：

- 背包物品
- 装备栏
- 末影箱内容
- 经验值
- 药水效果

退出副本时自动恢复。

### 位置记录

玩家进入副本前的位置和世界会被记录，异常情况下可回退：

```
/md recover <玩家名>
```

## 手动恢复命令

| 命令 | 说明 |
|------|------|
| `/md recover <玩家>` | 恢复玩家到进副本前状态 |
| `/md recover inventory <玩家>` | 仅恢复背包 |
| `/md recover position <玩家>` | 仅传送回原位置 |
| `/md cleanup` | 清理所有残留实例世界 |
| `/md forceend <副本实例ID>` | 强制结束指定副本 |

## 日志系统

所有副本运行记录保存在 `plugins/MayDungeon/logs/` 目录下：

```
logs/
├── dungeon_2024-01-15.log    # 按日期的副本日志
├── error_2024-01-15.log      # 错误日志
└── recovery.log              # 恢复操作记录
```

## 配置建议

```yaml
recovery:
  # 启用背包快照
  snapshot-inventory: true
  # 快照保留时间（小时）
  snapshot-expire: 48
  # 启动时自动清理残留世界
  auto-cleanup: true
  # 崩溃后自动恢复玩家
  auto-recover: true
```

## 常见故障处理

- **玩家卡在已删除世界**：使用 `/md recover <玩家>` 恢复
- **实例世界未删除**：使用 `/md cleanup` 手动清理
- **背包丢失**：检查 `plugins/MayDungeon/snapshots/` 下的备份文件
