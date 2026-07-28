# 队伍系统

MayDungeon 内置队伍系统，用于管理副本中的玩家组队。

## 基本概念

- 每个副本实例对应一个队伍
- 队伍创建者默认为队长
- 组队阶段受全局 `team.max-players` 限制
- 开始指定副本时，还会检查该副本自身的 `min-players` / `max-players`
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
| `/md team approve` | 队长同意最早的入队申请 |
| `/md team reject` | 队长拒绝最早的入队申请 |
| `/md team leave` | 离开队伍 |
| `/md team kick <玩家>` | 踢出队员（队长操作） |
| `/md team transfer <玩家>` | 转让队长 |
| `/md team disband` | 解散队伍（队长操作） |
| `/md team list` | 查看队伍成员 |
| `/md team chat <消息>` | 队伍频道聊天 |
| `/md team gui` | 无队伍时浏览并申请加入队伍；有队伍时打开管理界面 |

## 加入队伍的两种方式

### 方式一：队长邀请

1. 队长执行 `/md team invite 玩家名`
2. 被邀请玩家收到提示
3. 被邀请玩家执行 `/md team accept` 加入

### 方式二：玩家申请

1. 玩家执行 `/md team join 队长名` 或 `/md team request 队长名`
2. 队长收到入队申请通知
3. 队长在 GUI 中对指定玩家左键同意、右键拒绝；也可用 `/md team approve` 或 `/md team reject` 处理最早一条申请

> `join` 和 `request` 命令效果完全相同，都需要队长使用 `approve` 同意后才能入队。

## GUI 管理

执行 `/md team gui` 后，界面会根据玩家当前状态自动切换：

- **尚未组队**：显示当前可申请的队伍、队长、人数和在线人数；点击队伍即可发送入队申请，也可直接创建自己的队伍
- **已经组队**：显示成员、在线状态、人数上限和待处理申请
- **队长管理成员**：左键成员将其踢出，右键把队长转让给该在线成员
- **队长管理申请**：申请显示在管理界面下方，左键同意，右键拒绝

已满员、队长离线或正在副本中的队伍不会出现在可申请列表中。入队申请 30 秒后自动过期。

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
  # 队伍总人数上限（包含队长）
  max-players: 20
  # 所有队员离线后自动解散
  auto-disband:
    enabled: true
    delay-seconds: 60
```

## 注意事项

- 队长离线 60 秒后，如有其他在线队员会自动转让队长
- 所有成员离线达到 `team.auto-disband.delay-seconds` 后会自动解散；有人重新上线则取消解散
- 如果队员仍处于副本离线保护期，自动解散会等待副本状态清理完成
- 队伍解散（`disband`）会导致副本内调用 `dungeon.disbandTeam()` 的效果
- 副本运行中无法邀请外部玩家，组队需在副本开始前完成
