# 命令参考

MayDungeon 所有可用命令列表。基础命令前缀为 `/maydungeon`（别名 `/md`）。

## 玩家命令

| 命令 | 说明 | 权限 |
|------|------|------|
| `/md join <副本ID>` | 加入副本 | `maydungeon.join` |
| `/md leave` | 离开当前副本 | `maydungeon.leave` |
| `/md team create` | 创建队伍 | `maydungeon.team` |
| `/md team invite <玩家>` | 邀请玩家入队 | `maydungeon.team` |
| `/md team accept` | 接受邀请 | `maydungeon.team` |
| `/md team deny` | 拒绝邀请 | `maydungeon.team` |
| `/md team leave` | 离开队伍 | `maydungeon.team` |
| `/md team kick <玩家>` | 踢出队员 | `maydungeon.team` |
| `/md team list` | 查看队伍 | `maydungeon.team` |
| `/md info <副本ID>` | 查看副本信息 | `maydungeon.info` |

## 管理命令

| 命令 | 说明 | 权限 |
|------|------|------|
| `/md create <ID>` | 创建副本配置 | `maydungeon.admin` |
| `/md delete <ID>` | 删除副本配置 | `maydungeon.admin` |
| `/md reload` | 重载配置和脚本 | `maydungeon.admin` |
| `/md forceend <实例ID>` | 强制结束副本实例 | `maydungeon.admin` |
| `/md recover <玩家>` | 恢复玩家状态 | `maydungeon.admin` |
| `/md cleanup` | 清理残留世界 | `maydungeon.admin` |
| `/md status` | 查看运行状态 | `maydungeon.admin` |
| `/md list` | 列出所有副本 | `maydungeon.admin` |

## 编辑器命令

| 命令 | 说明 | 权限 |
|------|------|------|
| `/md editor <副本ID>` | 进入编辑模式 | `maydungeon.editor` |
| `/md editor save` | 保存编辑内容 | `maydungeon.editor` |
| `/md editor exit` | 退出编辑模式 | `maydungeon.editor` |
| `/md editor test` | 测试副本 | `maydungeon.editor` |

## 调试命令

| 命令 | 说明 | 权限 |
|------|------|------|
| `/md debug on` | 开启调试模式 | `maydungeon.debug` |
| `/md debug off` | 关闭调试模式 | `maydungeon.debug` |
| `/md debug tps` | 查看TPS影响 | `maydungeon.debug` |
| `/md debug memory` | 查看内存使用 | `maydungeon.debug` |
| `/md debug script <副本ID>` | 查看脚本日志 | `maydungeon.debug` |

## 命令别名

- `/maydungeon` → `/md`
- `/md join` → `/md j`
- `/md leave` → `/md l`
- `/md team` → `/md t`
