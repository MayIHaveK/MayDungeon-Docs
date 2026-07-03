# 队伍系统

MayDungeon 内置队伍系统，用于管理副本中的玩家组队。

## 基本概念

- 每个副本实例对应一个队伍
- 队伍创建者默认为队长
- 队伍人数受副本 `max-players` 限制
- 玩家同一时间只能加入一个队伍

## 命令列表

| 命令 | 说明 |
|------|------|
| `/md team create` | 创建队伍 |
| `/md team invite <玩家>` | 邀请玩家加入（队长操作） |
| `/md team accept` | 接受队伍邀请 |
| `/md team deny` | 拒绝队伍邀请 |
| `/md team request <队长>` | 向队长申请加入队伍 |
| `/md team join <队长>` | 向队长申请加入队伍（同 request） |
| `/md team approve <玩家>` | 队长同意入队申请 |
| `/md team reject <玩家>` | 队长拒绝入队申请 |
| `/md team leave` | 离开队伍 |
| `/md team kick <玩家>` | 踢出队员（队长操作） |
| `/md team transfer <玩家>` | 转让队长 |
| `/md team disband` | 解散队伍（队长操作） |
| `/md team list` | 查看队伍成员 |
| `/md team chat <消息>` | 队伍频道聊天 |
| `/md team gui` | 打开队伍 GUI |

## 加入队伍的两种方式

### 方式一：队长邀请

1. 队长执行 `/md team invite 玩家名`
2. 被邀请玩家收到提示
3. 被邀请玩家执行 `/md team accept` 加入

### 方式二：玩家申请

1. 玩家执行 `/md team join 队长名` 或 `/md team request 队长名`
2. 队长收到入队申请通知
3. 队长执行 `/md team approve 玩家名` 同意，或 `/md team reject 玩家名` 拒绝

> `join` 和 `request` 命令效果完全相同，都需要队长使用 `approve` 同意后才能入队。

## 脚本中的队伍交互

```javascript
function on_start() {
    var count = dungeon.getPlayerCount();
    dungeon.broadcast("&a队伍人数: " + count + "，副本开始！");
}

function on_player_quit() {
    var player = trigger.getPlayerName();
    var quits = dungeon.getQuitCount(player);
    if (quits >= 3) {
        dungeon.broadcast("&c" + player + " 多次退出，已被标记");
    }
}
```

## 队伍配置

在 `config.yml` 中配置队伍相关设置：

```yaml
team:
  # 邀请过期时间（秒）
  invite-expire: 60
  # 是否允许跨世界邀请
  cross-world-invite: true
  # 离线玩家保留时间（秒）
  offline-keep: 120
```

## 注意事项

- 队长断线超时后会自动转让队长给其他成员
- 队伍解散（`disband`）会导致副本内调用 `dungeon.disbandTeam()` 的效果
- 副本运行中无法邀请外部玩家，组队需在副本开始前完成
