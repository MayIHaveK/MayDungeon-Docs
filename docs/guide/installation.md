# 安装与 Java 选型

## 环境要求

- **服务端**：Spigot / Paper 1.20.x – 1.21.x（含 Mohist、Arclight 等 Forge/NeoForge 混合端）
- **Java 版本推荐**（影响脚本引擎性能，详见 [脚本引擎与 Java 搭配](/guide/script-engine)）：
  - **最佳实践**：**GraalVM for JDK 21.0.6+（Oracle GraalVM / GraalVM CE 21.0.6+，含 JVMCI 24+）** — 零配置开启 GraalJS **Truffle JIT 峰值编译**
  - **标准可用**：普通 OpenJDK 21+（Temurin / Oracle / Dragonwell）— 支持 GraalJS 24.2 全部 ES2023+ 特性与熔断（纯解释模式）
  - **注意避坑**：早期 **GraalVM 21 (`21+35-jvmci-23.1`)** 因 JVMCI 23.1 与 Truffle 24.2 版本不匹配会回退纯解释模式，请升级至 **21.0.6+**
  - **最低兼容**：Java 17（自动使用 Nashorn 引擎）
- **JavaScript 引擎插件**（三选一，默认 `script.engine: "auto"` 按优先级自动探测）：
  1. **`MayJS-GraalJS.jar`（强烈推荐，JDK 21+）**：提供 GraalJS 24.2.2（ES2023+）与死循环语句/超时熔断；**支持脱离 `MayJS` 独立运行**，无需额外安装 `MayJS`。
  2. **`MayJS 3.0+`**：若服内已使用 MayJS 3.0 平台，可自动桥接复用其活跃引擎。
  3. **`NashornJs.jar`**：兼容 JDK 17–21 的传统引擎回退选项。
- **MythicMobs 5.x**（可选，推荐用于自定义 Boss 与怪物技能）

::: tip 混合端与跨插件/Mod 互操作
插件同时兼容 1.20.x 与 1.21.x 服务端（含 Mohist / Arclight）。内置的统一类加载器会自动挂载所有已启用 Bukkit 插件与 Forge / Mohist / NeoForge / Fabric Mod，脚本内可直接使用 `Java.type("...")` 访问任意插件与 Mod 类实现最高自定义度。
:::

## 可选软依赖插件

- **PlaceholderAPI** — 占位符变量支持（同步用于 `scoreboard` 侧边栏）
- **DecentHolograms** — 全息文字显示
- **Adyeshach** — 虚拟 NPC 系统
- **Vault** — 经济系统（门票扣费 & `loot` 发金币）
- **Overture** — 物品库（`ot:<物品ID>:<数量>` 入场消耗与发奖）
- **DragonMineZ** — 自动在进出副本时补发维度同步包，修复模组切维度卡格挡/打不动怪
- **Orryx** — 队伍成员法力值占位符

## 安装步骤

1. 将以下 JAR 放入 `plugins/` 目录：
   - `MayDungeon` 发布版 JAR
   - `MayJS-GraalJS.jar`（推荐，JDK 21+，可不装 `MayJS` 独立运行）或 `NashornJs.jar`
   - `MythicMobs.jar`（可选）
2. 启动服务器，插件将自动生成 v2 统一目录：
   - `plugins/MayDungeon/config.yml` — v2 主配置（`schema-version: 2`，默认 `sqlite` 单文件库与 `preload.mode: none`）
   - `plugins/MayDungeon/messages.yml` — 消息文本
   - `plugins/MayDungeon/guis/dungeon-selector.yml` — 纯界面布局模板
   - `plugins/MayDungeon/libs/` — 跨副本共享 JS 库目录（供 `require('...')` 引入）
   - `plugins/MayDungeon/dungeons/test_dungeon/` — 示例副本
   - `plugins/MayDungeon/examples_mythicmobs/` — MythicMobs 示例配置
3. 按控制台提示放入模板地图至 `plugins/MayDungeon/maps/<地图名>/`，执行 `/md admin reload`。

## 旧版 v1 无痛升级至 v2

- **零破坏兼容**：老服直接替换 JAR 启动即可照常运行，所有旧版 `config.yml`、`difficulties.yml`、旧 4 目录 YAML 与全部 `on_*.js` 脚本均 100% 兼容。
- **一键整洁迁移**：执行 `/md admin migrate all` 可自动备份旧文件（`*.v1.bak` / `data/legacy_v1_backup/`）并将主配置、难度文件与玩家档案一次性收口为整洁 v2 结构。

## 验证安装

1. 执行 `/md list` 确认示例副本已加载。
2. 执行 `/md admin engine` 确认激活脚本引擎、JVM / Truffle JIT 诊断、`Java.type` 挂载状态以及 L1 热备 / 预加载入场通道。
3. 可执行 `/md admin engine bench` 实测当前引擎性能，或 `/md admin engine switch <引擎> [--save]` 免重启热切换引擎。

::: warning 授权绑定
首次安装时按发布方提供的信息填写 `plugins/MayDungeon/config.yml` 中的 `bind.qq`。授权失败时请保留完整控制台提示并联系发布方，不要公开发送授权文件或机器信息。
:::
