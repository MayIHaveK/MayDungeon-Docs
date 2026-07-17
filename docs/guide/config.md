# 配置文件

MayDungeon 的全局配置文件位于 `plugins/MayDungeon/config.yml`。

## 数据存储（storage）

插件的玩家数据（体力、每日次数、复活币、副本会话等）支持三种存储后端：

```yaml
storage:
  # 存储类型: yaml / sqlite / mysql
  type: yaml
  # SQLite 配置（type 为 sqlite 时生效）
  sqlite:
    file: "data/maydungeon.db"
  # MySQL 配置（type 为 mysql 时生效）
  mysql:
    host: "localhost"
    port: 3306
    database: "maydungeon"
    username: "root"
    password: ""
    table-prefix: "md_"
```

| 后端 | 说明 | 适用场景 |
|------|------|---------|
| `yaml` | 数据以 YAML 文件存放在插件目录下 | 默认，小型服务器，零依赖 |
| `sqlite` | 单文件数据库，路径由 `sqlite.file` 指定 | 中型服务器，玩家较多时性能更好 |
| `mysql` | 远程数据库，表名带 `table-prefix` 前缀 | 大型服务器 / 跨服共享数据 |

切换后端后需重启服务器。存储层为抽象接口，三种后端功能完全一致。

## 世界管理（world）

```yaml
world:
  # 临时副本实例目录（相对于服务器根目录）
  instance-dir: "instances"
  # 同时最大并行复制世界数量
  max-concurrent-copies: 2
  # 世界创建最小间隔（毫秒），防止同时创建过多世界导致卡顿
  create-interval: 1000
  # 复制世界时跳过的文件/文件夹
  copy-exclude:
    - "session.lock"
    - "uid.dat"
    - "playerdata"
    - "advancements"
    - "stats"
  # 副本世界空闲区块自动卸载
  idle-chunk-unload: true
  # 预加载出生点周围区块半径
  preload-chunk-radius: 3

  # 世界池设置（可选性能优化）
  pool:
    enabled: false
    dungeons:
      # example_dungeon:
      #   cache-size: 3
      #   instance-keep: false
    refill-interval: 30
```

详细说明请参考 [世界管理](./world-management.md) 和 [性能优化](./performance.md)。

## 全局副本设置（dungeon）

```yaml
dungeon:
  # 地牢内聊天设置
  dungeon-chat:
    enable: true
    prefix: "&f[&6队内消息&f] &7%player_name%&f&l:"
  # 离线保护超时（秒）- 超时后自动退出副本
  offline-timeout: 120
  # 队伍玩家数量上限
  team-player-limit: 20
  # 视图类型: CHAT / BOOK
  view-type: "CHAT"
  # 世界 Boss 调度器设置
  world-boss:
    scheduler:
      # 插件启动后延迟多少秒进行第一次开放时间扫描（建议 3-10 秒）
      initial-delay-seconds: 5
      # 开放时间扫描间隔（秒，建议 10-60）
      check-interval-seconds: 60
  # 每日挑战次数全局重置时间（24小时制）
  daily-limit-reset-hour: 5
  # 允许在地牢内输入的命令（精确匹配命令名；支持 plugin:cmd 命名空间）
  allowed-commands:
    - "md"
    - "msg"
    - "r"
    - "tell"
  # 副本结束时清除含有以下 lore 的物品
  item-remove-lore:
    - "副本物品"
    - "无法携带出地牢"
  # 副本队列设置
  queue:
    # 是否启用队列（多队伍同时启动同一副本时排队）
    enabled: false
    # 同时最大创建副本数
    max-concurrent: 3
```

## 全局设置（setting）

```yaml
setting:
  # 控制台是否启用 ANSI 真彩色渐变启动面板；旧控制台显示乱码时可关闭
  colorful-console: true
  # 玩家退出副本后传送到的世界
  lobby-world: "world"
  # 默认游戏模式
  default-mode: "SURVIVAL"
  # 调试模式
  debug: false
  # BungeeCord 跨服支持
  bungee-cord: false
```

## 副本加载提示（loading）

副本世界异步生成期间，插件会向玩家展示进度动画（BossBar 进度条 + 标题 + 阶段提示 + 音效）：

```yaml
loading:
  # 总开关
  enabled: true
  # 预计世界创建耗时（秒），进度条会在该时间内快速爬升并逼近 95%，完成时充满
  expected-seconds: 8
  # BossBar 进度条
  bossbar:
    enabled: true
    # 颜色: BLUE / GREEN / PINK / PURPLE / RED / WHITE / YELLOW
    color: BLUE
    # 样式: SOLID / SEGMENTED_6 / SEGMENTED_10 / SEGMENTED_12 / SEGMENTED_20
    style: SEGMENTED_20
  # 屏幕标题（开始/完成/失败）
  title:
    enabled: true
  # 物品栏上方的阶段提示（复制文件 → 构建世界 → 预加载区块）
  action-bar:
    enabled: true
  # 音效反馈
  sound:
    enabled: true
```

所有提示文本都可以在 `messages.yml` 的 `loading` 节自定义，支持的键包括 `bossbar`、`bossbar-done`、`bossbar-failed`、`title`、`subtitle`、`done-title`、`done-subtitle`、`failed-title`、`failed-subtitle`、`phase-copy`、`phase-create`、`phase-chunk`、`phase-final` 等，可使用 `%dungeon%`、`%percent%`、`%spinner%`、`%reason%` 变量。

## 脚本安全（script）

```yaml
script:
  # 是否允许脚本以控制台身份执行命令（utils.runCommand / players.runCommand）
  allow-console-command: false
  # 是否允许脚本以玩家身份执行命令（utils.runCommandAsPlayer）
  allow-player-command: false
  # 是否允许管理员在副本内通过 /md script <代码> 在线执行 JS
  allow-inline-command: false
  # 脚本执行命令的最大长度
  max-command-length: 256
  # /md script 在线代码最大长度
  max-inline-length: 1024
```

## 体力系统配置

体力系统用于限制玩家频繁刷副本。详细说明请参考 [体力系统](./stamina.md)。

```yaml
stamina:
  enabled: false
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
  required-items:
    - "DIAMOND_SWORD"
```

## 复活币配置

详细说明请参考 [复活币系统](./revive-coin.md)。

```yaml
revive-coin:
  enabled: true
  gui-delay: 20        # 死亡后弹出复活GUI延迟（tick, 20tick=1秒）
  gui-title: "&8复活确认"
  save-interval: 60    # 数据刷盘间隔（秒）
```

## 副本配置（dungeon.yml）

每个副本目录 `plugins/MayDungeon/dungeons/<副本ID>/` 下的 `dungeon.yml` 支持以下字段：

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `display-name` | String | 目录名 | 副本显示名称（支持颜色代码） |
| `description` | String | 空 | 副本描述 |
| `map-name` | String | 目录名 | 使用的地图模板名（`maps/<名>/`） |
| `type` | String | INSTANCE | 副本类型：`INSTANCE` / `WORLD_BOSS` |
| `settings.min-players` | int | 1 | 最少玩家数 |
| `settings.max-players` | int | 4 | 最多玩家数 |
| `settings.time-limit` | int | 0 | 时间限制（秒，0=不限） |
| `settings.allow-pvp` | boolean | false | 是否允许 PVP |
| `settings.difficulty` | String | NORMAL | 世界难度 |
| `settings.keep-inventory` | boolean | false | 死亡是否保留背包 |
| `spawn-point` | String | "0,65,0" | 出生点坐标 `"x,y,z"` |
| `conditions.*` | - | - | 进入条件，见 [进入条件系统](./conditions.md) |
| `revive.max-revive` | int | 3 | 最大复活次数 |
| `revive.revive-delay` | int | 5 | 复活延迟（秒） |
| `revive.all-dead-timeout` | int | 20 | 全员死亡后的失败倒计时（秒） |
| `revive.allow-revive-coin` | boolean | true | 是否允许使用复活币 |
| `areas.<名>` | String | - | 区域定义 |
| `allowed-commands` | List | 空 | 该副本额外允许的命令 |
| `item-restrictions.cannot-take-out` | List | 空 | 不能带出副本的物品 |
| `item-restrictions.right-click-ban` | List | 空 | 禁止右键使用的物品 |
| `item-restrictions.clear-on-fail` | boolean | false | 失败时是否清除副本物品 |
| `world-boss.*` | - | - | 世界 Boss 配置，见下 |

## 世界 Boss 配置

详细说明请参考 [世界 Boss](./world-boss.md)。

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

调度器扫描频率在 `config.yml` 的 `dungeon.world-boss.scheduler` 中配置（见上文"全局副本设置"）。

## 授权绑定（bind）

```yaml
bind:
  qq: ""
```

授权验证信息，请联系管理员获取。

## 消息配置

消息文件位于 `plugins/MayDungeon/messages.yml`，支持自定义所有插件提示文本。支持 `&` 颜色代码和 PlaceholderAPI 变量。
