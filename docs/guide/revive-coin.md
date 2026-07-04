# 复活币系统

复活币是一种独立于副本复活次数的复活机制。玩家死亡后弹出确认界面，使用复活币可立即复活，无视副本复活次数限制。

## 工作流程

```
玩家死亡 → 设为旁观者 → 延迟弹出复活确认GUI
├── 点击"使用复活币" → 扣除1币 → 立即复活
├── 点击"放弃" → 关闭GUI，继续旁观
└── 全员死亡超时无人复活 → 副本失败
```

## 与复活次数的关系

| 复活方式 | 消耗 | 限制 |
|---------|------|------|
| `/md revive` | 复活次数 | 受 `revive.max-revive` 限制 |
| 复活币 | 1个复活币 | 不受复活次数限制，只要有币就能用 |

两者独立运作，互不影响。

## 配置

### 全局配置 (config.yml)

```yaml
revive-coin:
  # 是否启用复活币系统
  enabled: true
  # 死亡后弹出GUI延迟（tick, 20=1秒）
  gui-delay: 20
  # GUI标题
  gui-title: "&8复活确认"
  # 数据刷盘间隔（秒）
  save-interval: 60
```

### 副本配置 (dungeon.yml)

```yaml
revive:
  max-revive: 3
  revive-delay: 3
  all-dead-timeout: 20
  # 是否允许在此副本使用复活币（默认true）
  allow-revive-coin: true
```

- 设置 `allow-revive-coin: false` 可禁止特定副本使用复活币（如挑战模式）

## 命令

| 命令 | 说明 | 权限 |
|------|------|------|
| `/md admin revivecoin <玩家>` | 查看余额 | maydungeon.admin |
| `/md admin revivecoin <玩家> set <N>` | 设置数量 | maydungeon.admin |
| `/md admin revivecoin <玩家> add <N>` | 增加数量 | maydungeon.admin |
| `/md admin revivecoin <玩家> reset` | 清零 | maydungeon.admin |

## PlaceholderAPI 占位符

| 占位符 | 说明 |
|--------|------|
| `%md_revive_coins%` | 玩家当前复活币数量 |

## 数据存储

复活币数据支持三种存储后端：

- **YAML**：`data/revive_coins/{uuid}.yml`
- **SQLite**：`player_revive_coins` 表
- **MySQL**：`{prefix}player_revive_coins` 表

采用内存缓存 + 异步批量刷盘架构，读取操作零 IO。

## 获取复活币

复活币的获取途径由服务器管理员自行设计，常见方式：

- **商城购买**：通过其他插件（如 PlayerPoints、商城插件）对接
- **副本奖励**：在 `on_reward.js` 中通过命令给予
- **活动赠送**：管理员手动 `/md admin revivecoin <玩家> add <N>`
- **成就解锁**：通过其他插件监听事件后给予

### 在脚本中给予复活币

```javascript
// on_reward.js - 副本通关奖励复活币
var allPlayers = players.getAll();
for (var i = 0; i < allPlayers.length; i++) {
    utils.executeCommand("md admin revivecoin " + allPlayers[i].getName() + " add 1");
}
```

## 安全设计

- GUI点击确认前会二次验证所有条件（玩家仍死亡、副本仍运行、有币）
- 复活币扣除使用原子操作（synchronized tryDeduct），防止并发双扣
- 被 `/md revive` 复活后再点击GUI会提示"你已经复活了"
- 所有 Inventory 点击事件都 cancel，防止物品移动

## 测试指南

### 基本流程测试

```
# 给予复活币
/md admin revivecoin <你的名字> add 5
/md admin revivecoin <你的名字>   # 应显示 5

# 进入副本并死亡
/md start <副本>
# 造成自身死亡（如 /kill）
# 应该弹出9格GUI："使用复活币复活" / "放弃复活"

# 点击绿色确认
# 应该复活，币减1
/md admin revivecoin <你的名字>   # 应显示 4
```

### 无币时测试

```
/md admin revivecoin <你的名字> set 0
# 死亡后点击确认
# 应该提示"你没有复活币"
```

### 与复活次数的交互

```
# 设置副本 max-revive: 1
# 用完复活次数后（/md revive 显示"次数已用尽"）
# 仍然可以通过复活币GUI复活（不受次数限制）
```

### 禁用复活币的副本

```yaml
# dungeon.yml
revive:
  allow-revive-coin: false
```

```
# 死亡后不应弹出复活币GUI
# 只能通过 /md revive 使用复活次数
```

### 全员死亡超时测试

```
# 所有人死亡后，20秒内无人使用复活币
# 应该触发副本失败退出
# 如果有人在20秒内使用复活币 → 取消失败倒计时，副本继续
```
