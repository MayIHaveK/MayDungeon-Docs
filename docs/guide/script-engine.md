# 脚本引擎、Java 搭配与跨插件/Mod 互操作

MayDungeon v2 内置新一代可插拔 JavaScript 脚本运行时，支持 **GraalJS (ES2023+)**、**MayJS 3.0 桥接** 与 **Nashorn** 在线热切换，原生支持单文件 `dungeon.js`、跨副本共享库 `require('common/...')`、修改文件自动热重载，以及通过 `Java.type(...)` 直接访问任意 Bukkit 插件与 Forge / Mohist / NeoForge / Fabric Mod 的 Java 类。

---

## 一、脚本引擎与 Java / GraalVM 精确搭配指南

默认配置 `script.engine: "auto"` 会按以下优先级自动选择可用引擎：

1. **`graaljs`**（优先级 200）：安装 `MayJS-GraalJS.jar`（**支持脱离 `MayJS` 独立安装运行**）且服务端运行在 **JDK 21+**。
2. **`mayjs`**（优先级 150）：复用服内已安装的 `MayJS 3.0+` 平台活跃引擎。
3. **`nashorn`**（优先级 100）：兼容 `NashornJS` 插件或内置 Nashorn（支持 JDK 17–21）。

### 不同 Java 版本的实际运行表现（重要）

启动控制台与 `/md admin engine` 会自动检测当前 JVM 版本与 JVMCI 兼容性，并给出精确提示：

| 服务端使用的 Java 环境 | GraalJS 运行模式 | 实际表现与建议 |
| --- | :---: | --- |
| **Java 17**（< 21） | 不支持 GraalJS 24.2 | 自动回退 Nashorn；若要启用 GraalJS + ES2023+ 请升级至 **GraalVM for JDK 21.0.6+** |
| **普通 OpenJDK 21+**（Temurin / Oracle JDK / Dragonwell / Corretto） | 纯解释模式（Interpreted） | 可正常使用 ES2023+、解构、类、熔断，但未启用 Truffle JIT；**换用 GraalVM for JDK 21.0.6+ 可直接获得数倍至十倍峰值提速** |
| **旧版 GraalVM 21**（如 `21+35-jvmci-23.1` 等早期 23.1 构建） | 回退纯解释模式 | JVMCI 23.1 与 GraalJS/Truffle 24.2 不匹配而无法开启 JIT；请升级到 **GraalVM for JDK 21.0.6+（含 JVMCI 24+）** |
| **GraalVM for JDK 21.0.6+ / 24+**（Oracle GraalVM 或 GraalVM CE 21.0.6+） | **Truffle JIT 峰值编译** | **零配置自动启用 Truffle JIT**，高频 `on_damage` 与 Boss 技能脚本接近原生 Java 速度 |

---

## 二、引擎在线热切换、热重载与微基准压测

无需重启服务器，管理员可随时在线切换或压测脚本引擎：

| 命令 | 说明 |
| --- | --- |
| `/md admin engine` | 查看激活引擎、精确 JVM / GraalVM / JVMCI 诊断建议、`Java.type` 已挂载插件/Mod 类加载器统计、编译缓存命中率、入场通道与 L1 热备状态 |
| `/md admin engine switch <auto\|graaljs\|mayjs\|nashorn> [--save]` | **在线热切换脚本引擎**（安全校验目标引擎 -> 切换会话 -> 重新预热所有副本脚本）；加 `--save` 同步写入 `config.yml` |
| `/md admin engine reload` | **仅热重载脚本与共享库缓存**，不中断任何正在运行中的副本世界与玩家会话 |
| `/md admin engine bench [次数]` | 在当前引擎上执行微基准测试（默认 50,000 次热调用），直观对比 Nashorn / OpenJDK GraalJS / GraalVM Truffle JIT 的单次耗时（ns）与吞吐量（ops/s） |

### 按单个脚本文件覆写引擎

如需绝大多数脚本跑 GraalJS，但个别老脚本想临时固定在 Nashorn 上运行，只需在脚本前 5 行内添加指令注释：

```javascript
//@engine nashorn
// 仅本文件使用 Nashorn 会话执行
```

### 文件保存自动热重载

`config.yml` 默认开启 `script.auto-reload: true`。你在编辑器中修改并保存 `dungeons/*/scripts/*.js` 或 `libs/**/*.js` 后，插件会在 ~300ms 防抖窗口内自动失效编译缓存，下次触发立即生效，无需手动 `/md admin reload`。

---

## 三、跨插件与跨 Mod 最高自定义度：`Java.type` 与 `utils` 互操作

默认配置 `script.allow-host-class-access: true`（且 `script.sandbox.enabled: false`），MayDungeon 的统一类加载器 `DungeonCompositeClassLoader` 会自动串联：

- 所有已启用的 **Bukkit / Spigot / Paper 插件** 类加载器（MythicMobs、Vault、Overture、LuckPerms、Orryx、自定义插件等）
- 服务端 / NMS 类加载器
- **Forge / Mohist / Arclight / NeoForge / Fabric Mod** 类加载器（如 DragonMineZ、CustomNPCs、Curios、GeckoLib 等）

GraalJS 与 Nashorn **完全统一支持**以下写法：

### 1. 标准 `Java.type(...)`（推荐，GraalJS 与 Nashorn 通用）

```javascript
// 访问 Bukkit 原生 API
const Bukkit = Java.type('org.bukkit.Bukkit');
const Material = Java.type('org.bukkit.Material');
const ItemStack = Java.type('org.bukkit.inventory.ItemStack');

// 访问第三方插件类（如 MythicMobs）
const MythicBukkit = Java.type('io.lumine.mythic.bukkit.MythicBukkit');

// 在 Mohist / Arclight 混合端上直接访问 Forge Mod 类（如 DragonMineZ）
const StatsCapability = Java.type('com.dragonminez.common.stats.StatsCapability');

defineDungeon({
  onStart({ dungeon, utils }) {
    if (utils.isModLoaded('dragonminez')) {
      dungeon.broadcast('&b检测到 DragonMineZ 模组，已启用联动机制！');
    }
    const mm = utils.getPlugin('MythicMobs');
    if (mm != null) {
      print('MythicMobs 版本: ' + mm.getDescription().getVersion());
    }
  }
});
```

### 2. 空安全探针工具（`utils`）

为了在未安装某个可选插件/Mod 时避免 `ClassNotFoundException`，可配合 `utils` 探针使用：

```javascript
// 判断类是否存在（不抛异常）
if (utils.hasClass('com.dragonminez.common.stats.StatsCapability')) {
  const StatsCapability = Java.type('com.dragonminez.common.stats.StatsCapability');
  // ...
}

// 获取任意已启用的插件实例
const vault = utils.getPlugin('Vault');

// 从 Bukkit ServicesManager 获取服务接口（如 Vault Economy、LuckPerms API）
const economy = utils.getService('net.milkbowl.vault.economy.Economy');

// 判断 Forge / NeoForge / Fabric Mod 是否已加载
const hasDmz = utils.isModLoaded('dragonminez');
```

::: tip 安全沙箱按需开启
如果你希望开放给第三方策划写脚本、但禁止脚本执行系统命令或启动进程，可将 `script.sandbox.enabled: true`，并保持默认的黑名单（拦截 `java.lang.Runtime`、`java.lang.ProcessBuilder`、`java.lang.System`、`javax.script.`），此时所有插件与 Mod 类仍可正常通过 `Java.type(...)` 访问。
:::

---

## 四、现代单文件写法、`require` 共享库与级联继承

### 1. 单文件 `scripts/dungeon.js`（推荐）

不再强迫为一个简单副本创建十几个零散的 `on_*.js`！只需在 `dungeons/<id>/scripts/` 下创建一个 `dungeon.js`（或 `main.js`），整个副本只编译一次，函数之间可直接共享常量、辅助方法与闭包状态：

```javascript
// dungeons/abyss/scripts/dungeon.js
const bossUtils = require('common/boss-utils'); // 读取 plugins/MayDungeon/libs/common/boss-utils.js

defineDungeon({
  onInit({ dungeon, world, stages, loot }) {
    world.setTime(18000);
    // 直接读 dungeon.yml 真实配置，无需去 presets.yml 抄两遍
    const limit = dungeon.getConfigInt('time-limit', 600);
    dungeon.setData('limit', limit);

    stages.define('wave1', {
      title: '&6第一阶段',
      subtitle: '&7击退守卫前锋',
      bossbar: '&e阶段 1：清剿守卫',
      group: 'guards',
      mobs: [{ type: 'mm:AbyssGuard', x: 10, y: 65, z: 10, count: 4, level: 3 }],
      next: 'boss'
    });
    stages.define('boss', {
      title: '&c最终决战',
      subtitle: '&4深渊领主降临！',
      bossbar: '&c深渊领主',
      bossbarColor: 'RED',
      group: 'abyss_boss',
      mobs: [{ type: 'mm:AbyssLord', x: 20, y: 65, z: 20, count: 1, level: 10 }],
      completeOnClear: true,
      completeDelay: 5
    });

    loot.defineTable('clear', [
      { item: 'DIAMOND', min: 2, max: 5, weight: 60 },
      { item: 'mm:AbyssBlade', amount: 1, weight: 10 },
      { money: 500, chance: 1.0 }
    ]);
  },

  onStart({ stages, bossbar, scoreboard, dungeon }) {
    stages.start('wave1');
    bossbar.countdown('timer', '&e剩余时间: %time%s', dungeon.getConfigInt('time-limit', 600), 'BLUE');
    scoreboard.autoRefresh(20, () => {
      scoreboard.show('&6&l深渊迷宫', [
        '&7当前阶段: &e' + stages.getCurrent(),
        '&7存活人数: &a' + dungeon.getAlivePlayers().size(),
        '&7已用时间: &f' + dungeon.getElapsedTime() + 's'
      ]);
    });
  },

  onDamage({ trigger, event, combat }) {
    const dmg = event.get('damage');
    if (dmg > 40 && combat.cooldown(trigger.getPlayer(), 'crit_fx', 1500)) {
      combat.particleRing(trigger.getPlayer(), 'FLAME', 1.8, 16);
    }
  },

  onComplete({ loot, records, players, dungeon }) {
    loot.grantFirstClear(players.getAll(), 'first_clear');
    loot.grantTable(players.getAll(), 'clear', 2);
    records.recordClear(players.getAll(), dungeon.getElapsedTime());
  },

  onReset({ blocks }) {
    blocks.restoreAll();
    return true;
  }
});
```

> 钩子名同时兼容 **camelCase**（如 `onInit`、`onMonsterKill`、`onGroupClear`）与 **snake_case**（如 `on_init`、`on_monster_kill`）；在 Nashorn 环境下将解构改写为 `onStart: function(ctx) { ctx.stages.start('wave1'); }` 即可完全通用。

### 2. 跨副本共享模块库 `plugins/MayDungeon/libs/`

将通用的 Boss 技能、发奖逻辑或 Mod 工具函数放入 `plugins/MayDungeon/libs/common/boss-utils.js`：

```javascript
// plugins/MayDungeon/libs/common/boss-utils.js
exports.warnAndStrike = function(combat, x, y, z, radius, damage) {
  combat.telegraph(x, y, z, radius, 40, 'FLAME', function() {
    combat.aoeDamage(x, y, z, radius, damage, false, 'players');
  });
};
```

所有副本脚本（无论单文件 `dungeon.js` 还是传统 `on_*.js`）均可通过 `require('common/boss-utils')`（或相对路径 `require('./helper')`）直接复用，且带编译缓存与防越界路径保护。

### 3. 难度脚本级联继承（告别复制粘贴）

开启多难度后（如 `Normal` / `Hard`），解析顺序已升级为**「难度目录优先，缺失自动回退根目录」**：

```text
dungeons/abyss/scripts/
├── dungeon.js        ← 所有难度共享的公共逻辑
├── on_damage.js      ← 公共伤害脚本（Normal / Hard 自动继承）
└── Hard/
    └── on_start.js   ← 仅覆盖困难难度差异化的 1 个文件！
```

只需在 `Hard/` 目录放与公共逻辑不同的那 1–2 个文件，其余事件自动继承根目录，彻底告别维护两套重复脚本。
