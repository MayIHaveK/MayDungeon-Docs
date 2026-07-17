# 命令列表

MayDungeon 的所有命令汇总，主命令为 `/md`（别名 `/maydungeon`、`/dungeon`）。

## 玩家命令

| 命令 | 说明 |
|------|------|
| `/md start <副本>` | 开始/加入副本（世界 Boss 类型为加入当前活动） |
| `/md leave` | 离开当前副本 |
| `/md revive` | 使用复活机会 |
| `/md list` | 查看可用副本列表 |
| `/md info <副本>` | 查看副本详细信息 |
| `/md status` | 查看当前副本状态 |
| `/md stamina` | 查看自己的体力和恢复模式 |
| `/md gui` | 打开副本选择 GUI |
| `/md help` | 查看帮助信息 |

## 组队命令

| 命令 | 说明 |
|------|------|
| `/md team create` | 创建队伍 |
| `/md team invite <玩家>` | 邀请玩家加入队伍 |
| `/md team accept` | 接受队伍邀请 |
| `/md team deny` | 拒绝队伍邀请 |
| `/md team request <队长>` | 申请加入队伍 |
| `/md team join <队长>` | 申请加入队伍（同 request） |
| `/md team approve` | 队长同意入队申请 |
| `/md team reject` | 队长拒绝入队申请 |
| `/md team leave` | 离开队伍 |
| `/md team kick <玩家>` | 踢出队员 |
| `/md team transfer <玩家>` | 转让队长 |
| `/md team disband` | 解散队伍 |
| `/md team list` | 查看队伍成员 |
| `/md team chat <消息>` | 队伍聊天 |
| `/md team gui` | 打开队伍 GUI |

## 管理命令

需要 `maydungeon.admin` 权限。

| 命令 | 说明 |
|------|------|
| `/md admin reload` | 重载配置文件 |
| `/md admin import <地图名>` | 导入地图 |
| `/md admin instances` | 查看运行中的副本实例 |
| `/md admin tp <实例ID>` | 传送到指定副本实例 |
| `/md admin kick <玩家>` | 将玩家踢出副本 |
| `/md admin forceend <实例ID>` | 强制结束副本实例 |

### 体力管理

| 命令 | 说明 |
|------|------|
| `/md admin stamina <玩家>` | 查看玩家体力 |
| `/md admin stamina <玩家> set <值>` | 设置玩家体力 |
| `/md admin stamina <玩家> add <值>` | 增加玩家体力 |
| `/md admin stamina <玩家> reset` | 重置玩家体力为满 |

### 每日次数管理

| 命令 | 说明 |
|------|------|
| `/md admin dailylimit <玩家> <地牢>` | 查看玩家今日次数 |
| `/md admin dailylimit <玩家> <地牢> set <值>` | 设置次数 |
| `/md admin dailylimit <玩家> <地牢> reset` | 重置次数为 0 |

### 复活币管理

| 命令 | 说明 |
|------|------|
| `/md admin revivecoin <玩家>` | 查看复活币余额 |
| `/md admin revivecoin <玩家> set <值>` | 设置复活币数量 |
| `/md admin revivecoin <玩家> add <值>` | 增加复活币 |
| `/md admin revivecoin <玩家> reset` | 复活币清零 |

### 世界 Boss 管理

| 命令 | 说明 |
|------|------|
| `/md admin worldboss start <地牢>` | 强制开启世界 Boss（不受开放时间限制） |
| `/md admin worldboss stop <地牢>` | 停止并结算世界 Boss |
| `/md admin worldboss status` | 查看当前活跃世界 Boss |

## 编辑器命令

用于副本地图可视化编辑，需要 `maydungeon.admin` 权限。

| 命令 | 说明 |
|------|------|
| `/md editor edit <地牢>` | 进入副本编辑模式 |
| `/md editor save` | 保存并退出编辑 |
| `/md editor exit` | 不保存退出编辑（同 `cancel`） |
| `/md editor tools` | 重新获取编辑工具 |
| `/md editor setspawn` | 设置出生点为当前位置 |
| `/md editor addarea <名称>` | 保存选区为区域 |
| `/md editor addobstacle <名称> <材质>` | 保存选区为障碍物 |
| `/md editor addwave <名称> <怪物名> [数量] [散布]` | 保存怪物波次 |
| `/md editor remove <area\|obstacle\|wave> <名称>` | 删除已定义元素 |
| `/md editor list` | 查看已定义元素（也可在编辑模式中右键末影之眼） |

## 调试命令

| 命令 | 说明 |
|------|------|
| `/md script <JS代码>` | 在当前副本中执行 JS 代码（需 `maydungeon.admin` 权限，且 `config.yml` 中 `script.allow-inline-command: true`） |
