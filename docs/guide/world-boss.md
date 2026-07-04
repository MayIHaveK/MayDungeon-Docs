# 世界副本（World Boss）

世界副本是一种特殊的副本模式，所有玩家/队伍共享同一个世界实例，协作击杀世界Boss，按伤害排行发放奖励。

## 与普通副本的区别

| 特性 | 普通副本 (INSTANCE) | 世界副本 (WORLD_BOSS) |
|------|--------------------|--------------------|
| 世界 | 每个队伍独立世界 | 所有人共享一个世界 |
| 进入 | 队伍发起创建 | 加入已开放的活动 |
| 人数 | 队伍限制（通常1-4人） | 全服参与（可达100人） |
| 时间 | 随时可进入 | 定时开放窗口 |
| 结算 | 通关/失败 | 伤害排行奖励 |

## 配置

在 `dungeon.yml` 中设置 `type: WORLD_BOSS`：

```yaml
display-name: "&c&l远古巨龙"
description: "全服讨伐世界Boss"
map-name: "world_boss_arena"
type: WORLD_BOSS

world-boss:
  # 开放时间段（支持多个）
  schedule:
    - "19:00-20:00"           # 每天19:00-20:00
    - "SAT 14:00-16:00"      # 每周六14:00-16:00
    - "23:00-01:00"           # 跨午夜
  # 活动最大持续时间（秒）
  duration: 3600
  # 最大参与人数（0=无限制）
  max-players: 100
  # 活动开始前全服广播提醒（秒）
  broadcast-before: [300, 60, 10]
  # 是否允许中途加入
  allow-late-join: true
  # 排行模式: PLAYER（个人）/ TEAM（队伍）/ BOTH（同时统计）
  ranking-mode: BOTH

settings:
  min-players: 1
  max-players: 100
  time-limit: 3600

conditions:
  stamina-cost: 5
  daily-limit: 1

spawn-point: "0, 100, 0"
```

### 时间格式

| 格式 | 说明 | 示例 |
|------|------|------|
| `HH:mm-HH:mm` | 每天固定时间段 | `19:00-20:00` |
| `DAY HH:mm-HH:mm` | 每周指定日期 | `SAT 14:00-16:00` |
| 跨午夜 | 结束时间小于开始时间 | `23:00-01:00` |

支持的星期缩写：`MON` `TUE` `WED` `THU` `FRI` `SAT` `SUN`

## 伤害追踪

在副本世界中，对带有 `md_world_boss` metadata 的实体造成伤害会自动计入排行榜。

### 在脚本中标记世界Boss

```javascript
// on_start.js - 生成并标记世界Boss
var boss = monsters.spawnMythic("world_dragon", 0, 100, 0);
if (boss) {
    // 设置 md_world_boss metadata 启用伤害追踪
    boss.setMetadata("md_world_boss", "true");
}
```

## 伤害排行 API（JS脚本）

所有脚本中都可使用 `ranking` 变量：

### 个人排行

```javascript
// 获取伤害前10名
var top10 = ranking.getTop(10);
for (var i = 0; i < top10.length; i++) {
    var e = top10[i];
    // e.name     - 玩家名
    // e.uuid     - UUID 字符串
    // e.player   - Bukkit Player 对象（离线为null）
    // e.damage   - 总伤害值
    // e.percent  - 伤害占比(0-100)
    // e.rank     - 排名(从1开始)
}

// 查询个人数据
var myDamage = ranking.getPlayerDamage(trigger);  // trigger 的伤害
var myRank = ranking.getPlayerRank(trigger);      // trigger 的排名
var total = ranking.getTotalDamage();             // 全部伤害总和
```

### 队伍排行

```javascript
// 获取队伍排行前5
var teamTop = ranking.getTeamTop(5);
for (var i = 0; i < teamTop.length; i++) {
    var t = teamTop[i];
    // t.leaderName   - 队长名
    // t.leaderUuid   - 队长UUID
    // t.members      - 成员UUID列表
    // t.totalDamage  - 队伍总伤害
    // t.percent      - 伤害占比
    // t.rank         - 排名
}

// 查询队伍伤害
var teamDmg = ranking.getTeamDamage(trigger);  // trigger 所在队伍总伤害
```

## 脚本事件

世界副本复用所有现有脚本事件：

| 事件 | 触发时机 |
|------|---------|
| `on_init.js` | 活动世界创建后 |
| `on_start.js` | 活动开始（生成Boss） |
| `on_player_join.js` | 每个玩家加入时 |
| `on_monster_kill.js` | Boss被击杀时 |
| `on_boss_reward.js` | Boss死亡后发奖（推荐） |
| `on_end.js` | 活动结束 |

### 完整发奖示例

```javascript
// on_boss_reward.js
var top = ranking.getTop(10);

dungeon.broadcast("&6&l═══ 世界Boss伤害排行 ═══");
for (var i = 0; i < top.length; i++) {
    var e = top[i];
    var medal = i == 0 ? "&6♕ " : (i == 1 ? "&f♕ " : (i == 2 ? "&c♕ " : "   "));
    dungeon.broadcast(medal + "&f#" + e.rank + " " + e.name
        + " &8- &e" + Math.round(e.damage) + " &7(" + Math.round(e.percent) + "%)");

    if (e.player != null) {
        if (i == 0) utils.executeCommand("give " + e.name + " diamond 10");
        else if (i < 3) utils.executeCommand("give " + e.name + " diamond 5");
        else utils.executeCommand("give " + e.name + " gold_ingot 3");
    }
}
dungeon.broadcast("&6&l═══════════════════════");
```

## 管理命令

| 命令 | 说明 |
|------|------|
| `/md admin worldboss start <地牢>` | 手动开启活动 |
| `/md admin worldboss stop <地牢>` | 手动关闭活动 |
| `/md admin worldboss status` | 查看活跃的世界Boss |

## 自动调度

- 每分钟自动检查所有 WORLD_BOSS 地牢的 `schedule`
- 到达开放时间自动创建世界并广播通知
- `broadcast-before` 在活动开始前提醒（如 `[300, 60, 10]` = 5分钟/1分钟/10秒前提醒）
- 超出时间窗口或达到 `duration` 自动关闭活动

## 测试指南

### 手动测试

```
# 手动开启世界Boss（无视时间窗口）
/md admin worldboss start <地牢>

# 进入
/md start <地牢>

# 攻击带有 md_world_boss metadata 的实体
# 伤害会自动累计

# 手动结束
/md admin worldboss stop <地牢>
# 应该触发 on_boss_reward.js 并显示排行
```

### 测试时间调度

```yaml
# 将 schedule 设为当前时间的窗口（如现在14:30）
world-boss:
  schedule:
    - "14:00-15:00"
# reload 后等待调度器检测（最多1分钟）
# 应该自动开启并广播
```

### 测试伤害排行

```
# 用不同玩家对Boss造成不同伤害
# 结束后检查排行是否正确
# 验证队伍模式下同队玩家伤害合并
```
