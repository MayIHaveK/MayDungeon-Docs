# 体力系统

MayDungeon 提供体力（Stamina）系统，用于限制玩家频繁刷副本，防止脚本无限刷资源。

## 启用体力系统

在 `config.yml` 中配置：

```yaml
stamina:
  enabled: true
  max: 100
  recovery-mode: DAILY_RESET
  daily-reset-hour: 5
  recovery-interval-minutes: 5
  recovery-interval: 300
  recovery-amount: 1
  admin-bypass: true
  bypass-permission: "maydungeon.stamina.bypass"
  save-interval: 60
```

## 配置说明

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enabled` | boolean | false | 是否启用体力系统 |
| `max` | int | 100 | 最大体力值 |
| `recovery-mode` | String | DAILY_RESET | 恢复模式 |
| `daily-reset-hour` | int | 5 | 每日重置时间（24小时制） |
| `recovery-interval-minutes` | int | 5 | INTERVAL 模式：恢复间隔（分钟，优先使用） |
| `recovery-interval` | int | 300 | INTERVAL 模式：恢复间隔（秒，旧配置兼容） |
| `recovery-amount` | int | 1 | INTERVAL 模式：每次恢复量 |
| `admin-bypass` | boolean | true | 管理员是否绕过体力限制 |
| `bypass-permission` | String | maydungeon.stamina.bypass | 绕过权限节点 |
| `save-interval` | int | 60 | 内存缓存刷盘间隔（秒） |

## 恢复模式

### DAILY_RESET（每日重置）

每天在指定时间（`daily-reset-hour`）自动将所有玩家体力重置为满值。适合想要简单管理的服务器。

- 优点：配置简单，每天固定重置
- 适用场景：日常任务型副本

### INTERVAL（定时恢复）

每隔一段时间恢复一定量（`recovery-amount`）的体力。优先使用 `recovery-interval-minutes`（分钟），没有该配置时兼容旧的 `recovery-interval`（秒）。体力上限不超过 `max`。

- 优点：更平滑的恢复曲线，玩家体验更好
- 适用场景：需要精细控制刷副本频率的服务器

示例：`recovery-interval-minutes: 5`，`recovery-amount: 1` 表示每 5 分钟恢复 1 点体力。旧配置 `recovery-interval: 300` 仍可继续使用。

## 副本体力消耗

在每个副本的 `dungeon.yml` 中配置进入时消耗的体力值：

```yaml
conditions:
  stamina-cost: 10
```

- 设为 `0` 或不配置表示不消耗体力
- 进入副本时会检查队伍所有成员的体力是否足够
- 体力在所有条件检查通过后立即预扣（避免并发窗口），如果世界创建失败会自动退还

## 命令

| 命令 | 说明 | 权限 |
|------|------|------|
| `/md stamina` | 查看自己的体力 | 无 |
| `/md admin stamina <玩家>` | 查看指定玩家体力 | maydungeon.admin |
| `/md admin stamina <玩家> set <值>` | 设置玩家体力 | maydungeon.admin |
| `/md admin stamina <玩家> add <值>` | 增加玩家体力 | maydungeon.admin |
| `/md admin stamina <玩家> reset` | 重置玩家体力为满 | maydungeon.admin |

## PlaceholderAPI 占位符

| 占位符 | 说明 |
|--------|------|
| `%md_stamina%` | 当前体力值 |
| `%md_stamina_current%` | 当前体力值 |
| `%md_stamina_remaining%` | 当前剩余体力值 |
| `%md_stamina_max%` | 最大体力值 |
| `%md_stamina_percent%` | 体力百分比（0-100） |
| `%maydungeon_stamina%` | 同上（完整前缀） |
| `%maydungeon_stamina_max%` | 同上 |
| `%maydungeon_stamina_percent%` | 同上 |

## 权限节点

| 权限 | 说明 |
|------|------|
| `maydungeon.stamina.bypass` | 绕过体力限制（默认仅 OP） |

## 数据存储

体力数据支持与插件相同的存储后端：

- **YAML**：存储在 `data/stamina/{uuid}.yml`
- **SQLite**：存储在 `player_stamina` 表
- **MySQL**：存储在 `{prefix}player_stamina` 表

## 技术细节

- 体力数据在玩家上线时加载到**内存缓存**，所有读取操作零 IO
- 恢复量通过时间差**懒计算**：不需要定时任务逐玩家更新
- 每日重置：读取时比对日期，跨天自动重置（无需遍历所有玩家）
- 内存中的变更通过异步定时任务批量刷盘（间隔可配置 `stamina.save-interval`）
- 玩家下线时同步持久化，确保数据不丢
- 队伍进入副本时，所有成员的体力都会被检查和扣除
- 拥有 bypass 权限的玩家不扣除体力也不检查
- 消耗在条件检查通过后立即执行（预扣），如果世界创建失败会退还

## 配置示例

### 日常副本（每日重置）

```yaml
# config.yml
stamina:
  enabled: true
  max: 50
  recovery-mode: DAILY_RESET
  daily-reset-hour: 4
```

```yaml
# dungeon.yml
conditions:
  stamina-cost: 10  # 每天最多刷 5 次
```

### 高难副本（缓慢恢复）

```yaml
# config.yml
stamina:
  enabled: true
  max: 200
  recovery-mode: INTERVAL
  recovery-interval-minutes: 10   # 10分钟恢复1点
  recovery-amount: 1
```

```yaml
# dungeon.yml
conditions:
  stamina-cost: 50  # 恢复满需要很长时间
```

## 测试指南

以下命令帮助你在开发环境中测试体力系统的各项功能：

### 测试体力耗尽

```
/md admin stamina <你的名字> set 0
/md start <副本>    # 应该提示体力不足
```

### 测试体力消耗

```
/md admin stamina <你的名字> set 20
/md start <副本>    # 如果 stamina-cost: 10，应该扣除成功
/md stamina         # 应该显示 10/100
```

### 测试 INTERVAL 恢复

```yaml
# 临时改配置为快速恢复以观察效果
stamina:
  recovery-mode: INTERVAL
  recovery-interval-minutes: 1    # 1分钟恢复一次
  recovery-amount: 5              # 每次恢复5点
```

```
/md admin stamina <你的名字> set 50
# 等待 1 分钟
/md stamina    # 应该显示 55
# 再等待 1 分钟
/md stamina    # 应该显示 60
```

### 测试每日重置

```
/md admin stamina <你的名字> set 0
# 将 daily-reset-hour 设为当前小时之前的值（如当前14点，设为13）
# 然后 /md admin reload
/md stamina    # 重置日期不匹配，懒计算触发重置，应该显示满体力
```

也可以更直接地测试：
```
# 将 daily-reset-hour 设为比当前小时大的值（如当前14点，设为15）
/md admin stamina <你的名字> set 0
/md stamina    # 应该仍为 0（还没到重置时间）
# 将 daily-reset-hour 改为 14 或更小，reload
/md stamina    # 应该显示满体力
```

### 测试绕过权限

```
# 给予绕过权限后不检查体力
/lp user <玩家> permission set maydungeon.stamina.bypass true
/md admin stamina <你的名字> set 0
/md start <副本>    # 应该正常进入
```

