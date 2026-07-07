# 安装

## 环境要求

- Spigot / Paper 1.21.1+
- Java 21+
- NashornJS 插件（提供 JavaScript 引擎）
- MythicMobs 5.x（怪物系统）

## 可选插件

- PlaceholderAPI — 占位符变量支持
- DecentHolograms — 全息文字显示
- Adyeshach — 虚拟 NPC 系统
- Vault — 经济系统
- Overture — 物品库，可用于 `overture:<物品ID>:<数量>` 入场消耗

## 安装步骤

1. 将以下插件 JAR 放入 `plugins/` 目录：
   - `MayDungeon-1.0.0-SNAPSHOT.jar`
   - `NashornJs.jar`
   - `MythicMobs.jar`

2. 启动服务器

3. 首次启动后，插件会自动生成：
   - `plugins/MayDungeon/config.yml` — 主配置
   - `plugins/MayDungeon/messages.yml` — 消息配置
   - `plugins/MayDungeon/dungeons/test_dungeon/` — 示例副本
   - `plugins/MayDungeon/examples_mythicmobs/` — MM怪物配置

4. 按照控制台提示操作：
   - 将地图放入 `plugins/MayDungeon/maps/test_dungeon/`
   - 将 MM 配置放入对应目录
   - 执行 `/mm reload` 和 `/md admin reload`

## 验证安装

执行 `/md list`，如果显示 `test_dungeon` 则安装成功。

::: tip
如果看到"地图不存在"的警告，这是正常的——放入地图后 reload 即可。插件不会因为缺少地图而崩溃。
:::
