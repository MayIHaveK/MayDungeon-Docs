# 配置文件

MayDungeon 的全局配置文件位于 `plugins/MayDungeon/config.yml`。

## 主配置项

```yaml
# 语言设置
language: "zh_CN"

# 副本世界前缀
world-prefix: "md_instance_"

# 最大同时运行副本数
max-instances: 20

# 副本超时默认值（秒）
default-timeout: 600

# 世界回收间隔（tick）
world-cleanup-interval: 100

# 是否启用调试日志
debug: false
```

## 数据库配置

```yaml
database:
  type: sqlite  # sqlite / mysql
  mysql:
    host: "localhost"
    port: 3306
    database: "maydungeon"
    username: "root"
    password: ""
```

## 集成配置

```yaml
integrations:
  mythicmobs: true
  decent-holograms: true
  adyeshach: true
  placeholderapi: true
```

## 副本配置（dungeon.yml）

每个副本目录下的 `dungeon.yml` 支持以下字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | String | 副本显示名称 |
| `template-world` | String | 模板世界名 |
| `min-players` | int | 最少玩家数 |
| `max-players` | int | 最多玩家数 |
| `timeout` | int | 超时时间（秒） |
| `spawn` | Location | 出生点坐标 |
| `exit-spawn` | Location | 退出后传送点 |
| `allow-rejoin` | boolean | 是否允许重连 |
| `keep-inventory` | boolean | 死亡是否保留背包 |

## 体力系统配置

体力系统用于限制玩家频繁刷副本。详细说明请参考 [体力系统](./stamina.md)。

```yaml
stamina:
  enabled: true
  max: 100
  recovery-mode: DAILY_RESET  # DAILY_RESET / INTERVAL
  daily-reset-hour: 5
  recovery-interval-minutes: 5  # INTERVAL 模式：恢复间隔（分钟，优先于 recovery-interval）
  recovery-interval: 300        # 旧配置兼容：恢复间隔（秒）
  recovery-amount: 1
  admin-bypass: true
  bypass-permission: "maydungeon.stamina.bypass"
  save-interval: 60  # 内存缓存刷盘间隔（秒）

daily-limit:
  save-interval: 120  # 每日次数数据刷盘间隔（秒）
```

每个副本可单独配置消耗体力值：

```yaml
# dungeon.yml
conditions:
  stamina-cost: 10
```

## 进入条件配置

详细说明请参考 [进入条件系统](./conditions.md)。

```yaml
# dungeon.yml
conditions:
  min-level: 10
  permission: "maydungeon.vip"
  stamina-cost: 10
  daily-limit: 3
  daily-limit-reset-hour: -1
  cooldown: 3600
  money-cost: 1000
  item-cost:
    - "DIAMOND:5"
    - "mythic:强化石:3"
    - "overture:example_item:1"
```

## 复活币配置

详细说明请参考 [复活币系统](./revive-coin.md)。

```yaml
revive-coin:
  enabled: true
  gui-delay: 20
  gui-title: "&8复活确认"
  save-interval: 60
```

## 世界副本配置

详细说明请参考 [世界副本](./world-boss.md)。

```yaml
# dungeon.yml
type: WORLD_BOSS
world-boss:
  schedule:
    - "19:00-20:00"
  duration: 3600
  max-players: 100
  broadcast-before: [300, 60, 10]
  allow-late-join: true
  ranking-mode: BOTH
```

## 消息配置

消息文件位于 `plugins/MayDungeon/messages.yml`，支持自定义所有插件提示文本。支持 `&` 颜色代码和 PlaceholderAPI 变量。
