# 安装

## 环境要求

- Spigot / Paper 1.20.x - 1.21.x（含 Arclight、Mohist 等 Forge 混合端）
- Java 17+（若启用 **GraalJS** 推荐 **Java 21+**，使用 **GraalVM JDK 21** 可自动获得 Truffle JIT 编译加速）
- JavaScript 引擎插件（三选一即可，默认 `script.engine: "auto"` 按优先级自动识别）：
  1. **`MayJS-GraalJS.jar`（推荐，JDK 21+）**：提供 GraalJS 24.2.2（ES2023+）与死循环语句/超时熔断；**支持脱离 `MayJS` 独立安装运行**，只想用 MayDungeon 时无需再装 MayJS。
  2. **`MayJS 3.0+`**：若服内已使用 MayJS 3.0 平台，可直接通过桥接复用其活跃引擎。
  3. **`NashornJs.jar`**：兼容 JDK 17–21 的传统引擎回退选项。
- MythicMobs 5.x（怪物系统）

::: tip 版本与混合端兼容
插件同时兼容 **1.20.x 与 1.21.x** 服务端，包括 Forge 混合端（Arclight、Mohist 等）。GUI 与粒子效果已做跨版本兼容处理；脚本 API 的 `world.spawnParticle` 同时接受 1.20.5 前后的新旧粒子枚举名（如 `DUST` / `REDSTONE`），同一份副本脚本无需为不同版本修改。
:::

## 可选插件

- PlaceholderAPI — 占位符变量支持
- DecentHolograms — 全息文字显示
- Adyeshach — 虚拟 NPC 系统
- Vault — 经济系统
- Overture — 物品库，可用于 `overture:<物品ID>:<数量>` 入场消耗
- DragonMineZ — 可选兼容；进出副本时自动补发角色状态同步
- Orryx — 可选；提供队伍成员当前法力、最大法力和法力百分比占位符

## 安装步骤

1. 将以下插件 JAR 放入 `plugins/` 目录：
   - 你获得的 `MayDungeon` 发布版 JAR
   - `MayJS-GraalJS.jar`（推荐，JDK 21+，可不装 `MayJS` 独立运行）或 `NashornJs.jar`
   - `MythicMobs.jar`

2. 启动服务器

3. 首次启动后，插件会自动生成：
   - `plugins/MayDungeon/config.yml` — 主配置
   - `plugins/MayDungeon/messages.yml` — 消息配置
   - `plugins/MayDungeon/guis/dungeon-selector.yml` — 副本选择界面配置
   - `plugins/MayDungeon/guis/dungeon-menus/example.yml` — 独立副本菜单示例
   - `plugins/MayDungeon/dungeons/test_dungeon/` — 示例副本
   - `plugins/MayDungeon/examples_mythicmobs/` — MM怪物配置

4. 按照控制台提示操作：
   - 将地图放入 `plugins/MayDungeon/maps/test_dungeon/`
   - 将 MM 配置放入对应目录
   - 执行 `/mm reload` 和 `/md admin reload`

## 验证安装

1. 执行 `/md list`，如果显示 `test_dungeon` 则基础安装成功。
2. 执行 `/md admin engine`，可一并确认当前激活的脚本引擎、Truffle JIT 状态，以及世界预加载入场通道（`Paper急迫异步` / `非阻塞票据` / `核心半径`）。

::: tip
如果看到"地图不存在"的警告，这是正常的——放入地图后 reload 即可。插件不会因为缺少地图而崩溃。
:::

::: warning 授权绑定
首次安装时按发布方提供的信息填写 `plugins/MayDungeon/config.yml` 中的 `bind.qq`。授权失败时请保留完整控制台提示并联系发布方，不要公开发送授权文件或机器信息。
:::
