# 创建副本（v2 单包结构）

MayDungeon v2 将原本分散在 4 个文件（`dungeon.yml`、`difficulties.yml`、`presets.yml`、`guis/dungeon-selector.yml`）的副本配置统一收口到 **唯一真相源 `dungeon.yml`**，并新增单文件脚本 `scripts/dungeon.js` 与难度级联覆盖，新建一个完整副本只需 2 个文件！

## 推荐目录结构（v2）

```text
plugins/MayDungeon/
├── maps/
│   └── abyss_map/          # 模板地图（含 region/ 与 level.dat）
├── libs/
│   └── common/
│       └── boss-utils.js   # 可选：跨副本共享工具库，用 require('common/boss-utils') 引入
└── dungeons/
    └── abyss/
        ├── dungeon.yml     # 唯一真相源：基础 + world + conditions + difficulties + presets
        └── scripts/
            ├── dungeon.js  # 推荐：单文件多钩子（onInit / onStart / onDamage / onComplete...）
            └── Hard/
                └── on_start.js # 可选：仅覆盖困难难度差异文件，其余自动级联回退根目录
```

> 传统拆分文件 `presets.yml`、`difficulties.yml` 与 `scripts/on_*.js` 仍 100% 兼容。

## 1. 编写单包 `dungeon.yml`

```yaml
display-name: "&5深渊迷宫"
description: "&7击败深渊守卫与领主，夺取远古宝藏"
map-name: "abyss_map"
spawn-point: "0.5,65,0.5,0,0"

# 可选：覆盖全局世界槽位与预加载策略（缺省自动继承 config.yml）
world:
  isolation: "link"          # link（硬链接，快）/ copy（完整隔离，CustomNPCs推荐）
  lifecycle: "disposable"    # disposable（每局销毁）/ reusable（onReset 还原复用）
  slots:
    max-active: 4            # 最多同时存在 4 个槽位（0 = 不限）
    standby: 1               # 后台常驻 1 个 L1 热备世界，首局 <15ms 秒进！
  preload:
    mode: "none"             # none（默认0ms跳过阻塞）/ spawn / radius

settings:
  min-players: 1
  max-players: 4
  time-limit: 600
  allow-pvp: false
  keep-inventory: true

conditions:
  stamina-cost: 10
  daily-limit: 3
  cooldown: 60

revive:
  max-revive: 3
  revive-delay: 5
  all-dead-timeout: 20
  allow-revive-coin: true

# 可选：直接内联多难度配置（GUI 详情页自动从此读取，不再需要在 dungeon-selector.yml 重复配置！）
difficulties:
  enabled: true
  default: Normal
  Normal:
    display-name: "&a普通"
    gui:
      slot: 10
      material: LIME_DYE
      selected-material: LIME_CONCRETE
    drops: ["DIAMOND:2", "mm:AbyssShard:1"]
    settings:
      boss-level: 5
  Hard:
    display-name: "&c困难"
    gui:
      slot: 16
      material: RED_DYE
      selected-material: RED_CONCRETE
    drops: ["mm:AbyssBlade:1", "ot:abyss_core:2"]
    settings:
      boss-level: 15

# 可选：内联预设数据与掉落表（也可继续使用外置 presets.yml）
presets:
  loot:
    clear_rewards:
      - item: "DIAMOND"
        min: 2
        max: 5
        weight: 60
      - item: "mm:AbyssBlade"
        amount: 1
        weight: 15
      - money: 500
        chance: 1.0
```

## 2. 编写单文件 `scripts/dungeon.js`

```javascript
// dungeons/abyss/scripts/dungeon.js
defineDungeon({
  onInit({ dungeon, world, stages }) {
    const bossLevel = Number(dungeon.getDifficultySetting('boss-level', 5));
    world.setTime(18000);

    stages.define('guards', {
      title: '&6第一阶段',
      subtitle: '&7击退深渊前锋',
      bossbar: '&e阶段 1：前锋守卫',
      group: 'wave1',
      mobs: [{ type: 'ZOMBIE', x: 10, y: 65, z: 10, count: 6, scatter: 3.0 }],
      next: 'boss'
    });

    stages.define('boss', {
      title: '&c深渊领主降临',
      bossbar: '&c深渊领主 Lv.' + bossLevel,
      bossbarColor: 'RED',
      group: 'boss_group',
      mobs: [{ type: 'mm:AbyssLord', x: 22, y: 65, z: 10, count: 1, level: bossLevel }],
      completeOnClear: true,
      completeDelay: 5
    });
  },

  onStart({ stages, bossbar, scoreboard, dungeon }) {
    stages.start('guards');
    bossbar.countdown('timer', '&e剩余时间: %time%s', dungeon.getConfigInt('time-limit', 600), 'BLUE');
    scoreboard.autoRefresh(20, () => {
      scoreboard.show('&5&l深渊迷宫', [
        '&7难度: &f' + dungeon.getDifficultyName(),
        '&7阶段: &e' + stages.getCurrent(),
        '&7用时: &f' + dungeon.getElapsedTime() + 's'
      ]);
    });
  },

  onComplete({ loot, records, players, dungeon }) {
    loot.grantFirstClear(players.getAll(), 'clear_rewards');
    loot.grantTable(players.getAll(), 'clear_rewards', 2);
    records.recordClear(players.getAll(), dungeon.getElapsedTime());
  }
});
```

## 3. 加载与热重载

- 新增副本或修改 `dungeon.yml` 后执行：`/md admin reload`
- 仅修改 `.js` 脚本时：开启 `script.auto-reload: true`（默认开启）后保存即自动失效缓存，或执行 `/md admin engine reload` 立即热重载且不中断正在进行的副本！
