# 故障恢复

MayDungeon 提供崩服恢复机制，确保服务器异常关闭后副本状态和玩家数据的安全。

## 正常关服恢复流程

当服务器重启后，插件检测到之前有未正常结束的副本实例时：

1. **自动传送回副本**：玩家上线后自动传送回副本世界
2. **脚本重新初始化**：重新执行 `on_init.js`，恢复副本的运行环境
3. **触发重连事件**：对每位回到副本的玩家执行 `on_player_rejoin.js`

这使得副本可以从中断处继续运行，脚本通过 `dungeon.getData()` 可读取到持久化的运行时数据。

## 恢复失败处理

如果副本恢复失败（模板世界损坏、配置变更等），插件会：

1. **清除副本状态**：移除该副本实例的所有记录
2. **释放玩家**：玩家恢复到进入副本前的位置和状态
3. **正常操作**：玩家可以正常活动，不会被卡住

管理员也可以手动强制结束：

```
/md admin forceend <实例ID>
```

## 数据存储配置

副本运行数据的存储后端可在 `config.yml` 中配置：

### YAML（默认）

```yaml
storage:
  type: yaml
```

适合小型服务器，数据存储在文件中，无需额外依赖。

### SQLite

```yaml
storage:
  type: sqlite
```

单文件数据库，性能优于 YAML，适合中型服务器。

### MySQL

```yaml
storage:
  type: mysql
  host: localhost
  port: 3306
  database: maydungeon
  username: root
  password: password
```

适合大型服务器或多服联动，支持远程数据库。

## 玩家断线重连

```yaml
# dungeon.yml
allow-rejoin: true
rejoin-timeout: 120  # 允许 120 秒内重连
```

玩家断线后重连会被自动传送回副本，触发 `on_player_rejoin.js` 事件。超过重连时间则视为退出。

## 注意事项

- 恢复机制依赖持久化数据，确保 `storage` 配置正确
- 崩服后首次重启可能需要额外加载时间
- 建议定期备份 `plugins/MayDungeon/data/` 目录
- MySQL 模式下需确保数据库服务先于 Minecraft 服务启动
