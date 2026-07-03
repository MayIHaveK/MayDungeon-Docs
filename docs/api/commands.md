# 命令列表

MayDungeon 的所有命令汇总，主命令为 `/md`。

## 玩家命令

| 命令 | 说明 |
|------|------|
| `/md start` | 开始/加入副本 |
| `/md leave` | 离开当前副本 |
| `/md revive` | 使用复活机会 |
| `/md list` | 查看可用副本列表 |
| `/md info` | 查看副本详细信息 |
| `/md status` | 查看当前副本状态 |
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
| `/md team approve <玩家>` | 队长同意入队申请 |
| `/md team reject <玩家>` | 队长拒绝入队申请 |
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
| `/md admin import` | 导入副本 |
| `/md admin instances` | 查看运行中的副本实例 |
| `/md admin tp <实例>` | 传送到指定副本实例 |
| `/md admin kick <玩家>` | 将玩家踢出副本 |
| `/md admin forceend <实例>` | 强制结束副本实例 |

## 编辑器命令

用于副本地图编辑。

| 命令 | 说明 |
|------|------|
| `/md editor <副本>` | 进入副本编辑模式 |
| `/md editor save` | 保存并退出编辑 |
| `/md editor exit` | 不保存退出编辑 |
| `/md editor tools` | 获取编辑工具 |
| `/md editor setspawn` | 设置玩家出生点 |
| `/md editor addarea <名称>` | 添加区域 |
| `/md editor addobstacle <名称>` | 添加障碍物 |
| `/md editor addwave <名称>` | 添加怪物波次 |
| `/md editor remove <名称>` | 移除已添加的元素 |

## 调试命令

| 命令 | 说明 |
|------|------|
| `/md script <JS代码>` | 在当前副本中执行 JS 代码（调试用） |
