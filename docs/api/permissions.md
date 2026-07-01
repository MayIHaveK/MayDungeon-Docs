# 权限节点

MayDungeon 使用标准 Bukkit 权限系统，兼容 LuckPerms 等权限插件。

## 权限列表

### 玩家权限

| 权限节点 | 默认 | 说明 |
|----------|------|------|
| `maydungeon.join` | true | 允许加入副本 |
| `maydungeon.join.<副本ID>` | true | 允许加入特定副本 |
| `maydungeon.leave` | true | 允许离开副本 |
| `maydungeon.team` | true | 允许使用队伍功能 |
| `maydungeon.info` | true | 允许查看副本信息 |

### 管理权限

| 权限节点 | 默认 | 说明 |
|----------|------|------|
| `maydungeon.admin` | op | 管理员命令 |
| `maydungeon.admin.create` | op | 创建副本 |
| `maydungeon.admin.delete` | op | 删除副本 |
| `maydungeon.admin.reload` | op | 重载配置 |
| `maydungeon.admin.forceend` | op | 强制结束副本 |
| `maydungeon.admin.recover` | op | 恢复玩家 |
| `maydungeon.admin.cleanup` | op | 清理世界 |

### 编辑器权限

| 权限节点 | 默认 | 说明 |
|----------|------|------|
| `maydungeon.editor` | op | 使用编辑器 |
| `maydungeon.editor.test` | op | 测试副本 |

### 调试权限

| 权限节点 | 默认 | 说明 |
|----------|------|------|
| `maydungeon.debug` | op | 调试命令 |

### 特殊权限

| 权限节点 | 默认 | 说明 |
|----------|------|------|
| `maydungeon.bypass.cooldown` | op | 绕过副本冷却 |
| `maydungeon.bypass.limit` | op | 绕过每日次数限制 |
| `maydungeon.bypass.requirement` | op | 绕过进入条件 |

## LuckPerms 配置示例

```
/lp group default permission set maydungeon.join true
/lp group vip permission set maydungeon.bypass.cooldown true
/lp group admin permission set maydungeon.admin true
```

## 副本独立权限

可以为每个副本设置独立的进入权限：

```yaml
# dungeon.yml
permission: "maydungeon.join.abyss_dungeon"
```

未配置时默认所有拥有 `maydungeon.join` 的玩家均可进入。
