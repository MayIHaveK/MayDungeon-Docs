# 队伍系统

MayDungeon 内置队伍系统，用于管理副本中的玩家组队。

## 基本概念

- 每个副本实例对应一个队伍
- 队伍创建者默认为队长
- 队伍人数受副本 `max-players` 限制
- 玩家同一时间只能加入一个队伍

## 玩家操作命令

| 命令 | 说明 |
|------|------|
| `/md team create` | 创建队伍 |
| `/md team invite <玩家>` | 邀请玩家 |
| `/md team accept` | 接受邀请 |
| `/md team deny` | 拒绝邀请 |
| `/md team leave` | 离开队伍 |
| `/md team kick <玩家>` | 踢出成员（队长） |
| `/md team disband` | 解散队伍（队长） |
| `/md team list` | 查看队伍成员 |
| `/md team transfer <玩家>` | 转让队长 |

## 脚本中的队伍操作

```javascript
function on_start() {
    var team = dungeon.getTeam();
    var leader = team.getLeader();
    
    players.message("&a队长: " + leader.getName());
    players.message("&a队伍人数: " + team.size());
}

function on_player_quit(player) {
    if (dungeon.getTeam().size() === 0) {
        dungeon.fail("所有玩家已离开");
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
  # 副本中是否禁止 PVP
  dungeon-pvp: false
```

## 队伍事件

脚本中可监听队伍相关事件：

```javascript
function on_player_join(player) {
    players.message("&e" + player.getName() + " &7加入了副本");
    // 根据人数调整难度
    var size = dungeon.getTeam().size();
    dungeon.setDifficulty(size);
}
```

## 匹配系统

启用自动匹配后，单人玩家可排队等待组队：

```yaml
# dungeon.yml
matchmaking:
  enabled: true
  wait-time: 30
  min-start: 2
```
