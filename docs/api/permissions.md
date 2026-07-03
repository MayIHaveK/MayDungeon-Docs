# 权限节点

MayDungeon 的权限设计简洁，仅使用两个核心权限节点。

## 权限列表

| 权限节点 | 默认值 | 说明 |
|----------|--------|------|
| `maydungeon.start` | `true` | 允许使用基础玩家命令（开始、加入、离开副本等） |
| `maydungeon.admin` | `op` | 允许使用管理命令（reload、import、forceend 等） |

## 说明

- `maydungeon.start` 默认所有玩家拥有，如需限制副本准入，可通过权限插件撤销
- `maydungeon.admin` 默认仅 OP 拥有，用于管理和调试操作
- 编辑器命令和调试命令（`/md editor`、`/md script`）同样需要 `maydungeon.admin` 权限
