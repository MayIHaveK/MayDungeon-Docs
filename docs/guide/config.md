# 配置文件（v2 统一结构）

MayDungeon 的主配置文件位于 `plugins/MayDungeon/config.yml`。v2 将全部配置收口为 6 个清晰顶层块（`schema-version: 2`），并由不可变强类型 `ConfigSnapshot` 统一读取，同时 **100% 向下兼容旧版 v1 配置**。

> 老服可执行 `/md admin migrate config` 自动备份为 `config.yml.v1.bak` 并重写为整洁的 v2 配置。

## 1. 数据存储（`storage`）

```yaml
schema-version: 2

bind:
  qq: ""

storage:
  # 存储类型: sqlite（推荐单文件库）/ yaml / mysql（跨服）
  type: sqlite
  # YAML 目录结构（仅 type=yaml 时生效）: unified（单玩家单文件 data/players/<uuid>.yml）/ legacy（旧版 4 目录）
  yaml-format: unified
  sqlite:
    file: "data/maydungeon.db"
  mysql:
    host: "localhost"
    port: 3306
    database: "maydungeon"
    username: "root"
    password: ""
    table-prefix: "md_"
```

| 后端 | 说明 | 适用场景 |
| --- | --- | --- |
| `sqlite` | 单文件 WAL 模式数据库（默认推荐），零外部依赖、原子事务 | 绝大多数单服（推荐） |
| `yaml` | v2 默认 `unified` 模式将单玩家体力/每日次数/复活币/恢复点聚合至 `data/players/<uuid>.yml`，减少 80% 零散文件 | 便于手工查看/编辑的小型服 |
| `mysql` | 与 SQLite 共享同一套方言抽象 JDBC 引擎，支持跨服共享与批量写入 | 多服群组 / 大服 |

> 使用 `/md admin migrate storage` 可将旧版 4 目录 YAML 聚合为 `data/players/`，或在切换为 SQLite / MySQL 后把本地 YAML 玩家数据一键导入数据库。

## 2. 统一世界槽位引擎（`world`）

所有副本共用同一套直观配置（主配置给默认值，单副本 `dungeon.yml` 按需覆盖）：

```yaml
world:
  instance-dir: "instances"
  creator: "auto"              # auto (NMS/Mohist) / bukkit
  isolation: "link"            # link (硬链接地形，快) / copy (完整隔离，CustomNPCs推荐)
  lifecycle: "disposable"      # disposable (每局销毁) / reusable (onReset 还原复用)
  void-outside-template: true
  view-distance: 6
  max-concurrent-copies: 2
  create-interval: 1000
  adaptive-create-interval: true
  adaptive-min-interval-ms: 150
  max-pending-creates: 32
  idle-chunk-unload: true
  copy-exclude:
    - "session.lock"
    - "uid.dat"
    - "playerdata"
    - "advancements"
    - "stats"

  # 统一槽位策略（首局秒进配 standby，打完复用配 lifecycle: reusable）
  slots:
    max-active: 0              # 单副本同时存在的槽位上限（0 = 不限，1-256）
    standby: 0                 # 默认 L1 内存热备数量（推荐按副本单独配）
    idle-keep: 1               # reusable 模式每副本空闲留存上限
    idle-timeout-minutes: 10   # 空闲复用槽位超时自动销毁时长

  # 统一区块预加载策略（默认 none 跳过阻塞预加载，0ms 瞬传）
  preload:
    mode: "none"               # none（默认推荐）/ spawn（等落点1块）/ radius（等核心半径）
    radius: 1                  # 仅 mode=radius 时生效（1 = 3x3 共 9 块）
    background-radius: -1      # 传送后后台补载半径（-1 = 关闭）
    chunks-per-tick: 4
    tickets-per-tick: 64
    budget-ms: 3
    timeout-seconds: 60

  # 全服硬上限与老年代堆内存守卫（仅主配置生效）
  limits:
    max-total-worlds: 0        # 全服副本世界上限（0 = 不限）
    standby-enabled: true
    max-total-standby: 4       # 全服 L1 热备总上限
    max-total-idle: 8          # 全服空闲复用总上限
    min-free-oldgen-percent: 15 # JVM 老年代可用百分比守卫（0 = 关闭）
    standby-refill-seconds: 15
    world-boss-prewarm-seconds: 30
    standby-dungeons: {}       # 按副本指定热备数，如 ldz: 1
```

## 3. 游戏玩法全局设置（`gameplay`）

将原先分散在 `setting`、`team`、`dungeon`、`stamina`、`daily-limit`、`revive-coin` 的配置统一归类至 `gameplay`（旧版顶层键仍 100% 兼容）：

```yaml
gameplay:
  lobby-world: "world"
  default-mode: "SURVIVAL"
  debug: false
  bungee-cord: false
  offline-timeout: 120
  view-type: "CHAT"
  daily-limit-reset-hour: 5
  entry-attack-lock-ticks: 20
  allowed-commands: ["md", "msg", "r", "tell"]
  item-remove-lore: ["副本物品", "无法携带出地牢"]
  dungeon-chat:
    enabled: true
    prefix: "&f[&6队内消息&f] &7%player_name%&f&l:"
  team:
    max-players: 20
    auto-disband:
      enabled: true
      delay-seconds: 60
  queue:
    enabled: true
    max-concurrent: 1
  world-boss:
    scheduler:
      initial-delay-seconds: 5
      check-interval-seconds: 60
  stamina:
    enabled: false
    max: 100
    recovery-mode: "DAILY_RESET"
    daily-reset-hour: 5
    recovery-interval-minutes: 5
    recovery-amount: 1
    admin-bypass: true
    bypass-permission: "maydungeon.stamina.bypass"
    save-interval: 60
  daily-limit:
    save-interval: 120
  revive-coin:
    enabled: true
    gui-delay: 20
    gui-title: "&8复活确认"
    save-interval: 60
  dbz:
    debug: false
    probe-interval-ticks: 20
```

## 4. 脚本引擎与安全（`script`）

```yaml
script:
  # 引擎模式: auto / graaljs / mayjs / nashorn（可用 /md admin engine switch 在线热切换）
  engine: "auto"
  # 是否允许脚本通过 Java.type(...) 访问任意 Bukkit 插件与 Forge/Mohist Mod 类（默认 true）
  allow-host-class-access: true
  # 保存 .js 文件后自动失效编译缓存（热重载，不中断运行中副本）
  auto-reload: true
  execution-limit:
    max-statements: 500000
    timeout-ms: 5000
  sandbox:
    enabled: false
    blacklist:
      - "java.lang.Runtime"
      - "java.lang.ProcessBuilder"
      - "java.lang.System"
      - "javax.script."
  allow-console-command: false
  allow-player-command: false
  allow-inline-command: false
  max-command-length: 256
  max-inline-length: 1024
```

## 5. 界面与控制台表现（`ui`）

```yaml
ui:
  colorful-console: true
  loading:
    enabled: true
    expected-seconds: 8
    bossbar:
      enabled: true
      color: "BLUE"
      style: "SEGMENTED_20"
    title:
      enabled: true
    action-bar:
      enabled: true
    sound:
      enabled: true
```
