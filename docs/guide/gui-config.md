# 界面配置

界面配置位于 `plugins/MayDungeon/guis/`。首次启动新版本时会自动生成默认文件，修改后执行 `/md admin reload` 生效。

## 副本选择界面

`guis/dungeon-selector.yml` 控制 `/md gui` 打开的副本选择界面。

```yaml
title: "&8副本列表 &7(%page%/%pages%)"
rows: 6

# 自动排列副本使用的槽位
content-slots: [0, 1, 2, 3, 4, 5, 6, 7, 8]

# 优先排列的副本 ID
dungeon-order:
  - normal_dungeon
  - hard_dungeon
```

`rows` 可设置为 `1-6`。槽位从 `0` 开始，必须小于 `rows × 9`。未写入 `dungeon-order` 的副本会继续按副本 ID 排列。

## 默认副本物品

```yaml
dungeon-item:
  material: ENDER_EYE
  name: "%name%"
  lore:
    - "&7%description%"
    - "&7人数: &f%min_players%-%max_players%"
    - "&7难度: &f%difficulty%"
    - "&a点击开始挑战"
```

支持以下变量：

| 变量 | 内容 |
|------|------|
| `%id%` | 副本 ID |
| `%name%` | 副本显示名 |
| `%description%` | 副本描述 |
| `%min_players%` | 最少玩家数 |
| `%max_players%` | 最大玩家数 |
| `%difficulty%` | 难度文本 |

标题额外支持 `%page%` 和 `%pages%`。

## 单独覆盖副本

在 `dungeons.<副本ID>` 下可以覆盖图标、名称、说明和槽位：

```yaml
dungeons:
  test_dungeon:
    slot: 13
    material: DIAMOND_SWORD
    name: "&6测试副本"
    lore:
      - "&7副本 ID: &f%id%"
      - "&7人数: &f%min_players%-%max_players%"
      - "&a点击挑战"
```

`slot` 不配置或设为 `-1` 时自动排列。设置固定槽位后，该副本会固定显示，并在翻页时保留。

## 操作按钮

`items` 可配置上一页、下一页、刷新、关闭和空列表物品。每项均支持 `enabled`、`slot`、`material`、`name` 与 `lore`。

```yaml
items:
  refresh:
    enabled: true
    slot: 49
    material: CLOCK
    name: "&e刷新"
  close:
    enabled: true
    slot: 50
    material: BARRIER
    name: "&c关闭"
```

`filler.enabled: true` 可使用指定物品填充空槽。操作按钮和副本物品会覆盖对应位置的填充物。

## 副本详情二级界面

玩家在 `/md gui` 的全部副本列表或 `/md gui <菜单ID>` 的独立副本菜单中点击副本后，都会打开详情二级界面。二级界面在 `guis/dungeon-selector.yml` 中统一配置：

```yaml
detail-menu:
  enabled: true
  title: "&8%name% &7- %difficulty_name%"
  rows: 6

  filler:
    enabled: true
    material: GRAY_STAINED_GLASS_PANE
    name: " "

  dungeon-item:
    enabled: true
    slot: 4
    material: ENDER_EYE
    name: "&6%name%"
    lore:
      - "&7%description%"
      - "&7人数: &f%min_players%-%max_players%"
      - "&7选择难度: &f%difficulty_name%"

  selected-difficulty-lore:
    - ""
    - "&a已选择"

  # 第 4、5 行，共 18 个掉落预览槽位
  drop-slots: [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44]

  dungeons:
    test_dungeon:
      default-difficulty: normal
      difficulties:
        normal:
          enabled: true
          display-name: "&a普通"
          slot: 10
          material: LIME_DYE
          selected-material: LIME_CONCRETE
          name: "&a普通难度"
          lore:
            - "&7适合常规队伍"
            - "&e点击选择"
          script: "difficulty_normal.js"
          drops:
            - "mm:NormalBossSword"
            - "ot:example_sword"
            - "ot:normal_crystal:3"

        hard:
          enabled: true
          display-name: "&c困难"
          slot: 16
          material: RED_DYE
          selected-material: RED_CONCRETE
          name: "&c困难难度"
          lore:
            - "&7更强怪物与更好奖励"
            - "&e点击选择"
          script: "difficulty_hard.js"
          drops:
            - "mm:HardBossSword"
            - "ot:hard_crystal:5"

  items:
    back:
      enabled: true
      slot: 45
      material: ARROW
      name: "&e返回副本列表"
    enter:
      enabled: true
      slot: 53
      material: LIME_DYE
      name: "&a进入副本"
      lore:
        - "&7难度: &f%difficulty_name%"
        - "&7点击传送至 &f%name%"
      command: "md start %id%"
```

标题、展示物品、按钮名称、lore 和进入命令支持 `%id%`、`%name%`、`%description%`、`%min_players%`、`%max_players%`、`%difficulty%`、`%difficulty_id%`、`%difficulty_name%` 和 `%player%`。进入命令由点击玩家执行，开头的 `/` 可写可不写。来自全部副本列表时使用 `detail-menu.items.enter.command`；来自独立菜单时使用对应 `buttons.<按钮ID>.command`。返回按钮会回到打开详情页之前的全部副本列表页或独立菜单。

### 难度脚本

每个副本在 `detail-menu.dungeons.<副本ID>.difficulties` 下配置难度。`default-difficulty` 指定首次打开时选中的难度；未填写或无效时使用第一个启用的难度。存在难度配置时，详情界面会自动使用 6 行，以保证两整行掉落区可用。

插件内置“普通”和“困难”两档共享默认按钮。即使服务器保留的是旧版 `dungeon-selector.yml`，升级并重启或执行 `/md admin reload` 后也会直接显示 6 行新版界面；内置档位的脚本和掉落列表为空，不会凭空执行脚本或伪造奖励。需要实际难度逻辑和掉落预览时，按上方示例在 `dungeons.<副本ID>` 中覆盖配置。

`script` 相对于该副本的 `scripts/` 目录。例如 `test_dungeon` 的 `difficulty_hard.js` 应放在：

```text
plugins/MayDungeon/dungeons/test_dungeon/scripts/difficulty_hard.js
```

难度脚本在副本正式启动时、通用 `on_start.js` 之前执行，可以使用正常的副本脚本 API，并通过 `event` 获取难度：

```javascript
// difficulty_hard.js
print("当前难度: " + event.difficultyName);
dungeon.setData("monster_health_multiplier", 2.0);
dungeon.setData("reward_multiplier", 1.5);
```

插件会同时写入 `_difficulty` 和 `_difficulty_name` 副本元数据。GUI 启动命令无需手动追加难度参数；插件会把选择结果安全地附加到现有 `/md start` 参数中。也可以在命令文字中使用 `%difficulty_id%`。

### 掉落预览

`drops` 会直接生成 MythicMobs 或 Overture 的真实物品并放进预览槽，不会替换成普通材质：

| 格式 | 说明 |
|------|------|
| `mm:<物品ID>` | MythicMobs 物品，`mythic:` 和 `mythicmobs:` 也可用 |
| `ot:<物品ID>` | Overture 物品，`overture:` 也可用 |
| `ot:<物品ID>:<数量>` | 指定预览堆叠数量，MythicMobs 同样支持 |

无效或不存在的物品会被跳过，并在控制台中记录一次警告。最多展示 `drop-slots` 可容纳的数量；某个难度也可以单独配置自己的 `drop-slots`。使用 MM 物品需要安装 MythicMobs，使用 OT 物品需要安装 Overture。

如果多个副本使用完全相同的难度，可以将 `difficulties` 和 `default-difficulty` 直接放在 `detail-menu` 下作为共享配置；`dungeons.<副本ID>` 的单独配置优先。

关闭 `detail-menu.enabled` 后，全部副本列表和独立菜单都会恢复为点击副本直接执行进入命令。

## 独立副本菜单

除 `/md gui` 的全部副本列表外，还可以在 `plugins/MayDungeon/guis/dungeon-menus/` 中创建多个独立菜单。YAML 文件名就是菜单 ID，例如 `featured.yml` 使用 `/md gui featured` 打开。

```yaml
enabled: true
title: "&8精选副本"
rows: 3
permission: ""
close-on-click: true

filler:
  enabled: true
  material: GRAY_STAINED_GLASS_PANE
  name: " "

buttons:
  normal:
    enabled: true
    dungeon: normal_dungeon
    slot: 11
    material: DIAMOND_SWORD
    name: "&6%name%"
    lore:
      - "&7%description%"
      - ""
      - "&7人数: &f%min_players%-%max_players%"
      - "&7难度: &f%difficulty%"
      - "&a左键查看副本详情"
    command: "md start %id%"

  hard:
    dungeon: hard_dungeon
    slot: 15
    material: NETHER_STAR
    name: "&c%name%"
    lore:
      - "&7%description%"
      - "&a左键查看副本详情"
    command: "md start %id%"

items:
  close:
    enabled: true
    slot: 22
    material: BARRIER
    name: "&c关闭"
```

- `buttons` 中只会显示插件当前已加载的副本，`dungeon` 填写副本 ID。
- `slot` 从 `0` 开始，必须小于 `rows × 9`；多个按钮不要使用同一槽位。
- `material`、`name` 和 `lore` 均可为每个副本按钮单独设置。
- `command` 在玩家进入详情页后点击“进入副本”时以该玩家身份执行，开头的 `/` 可写可不写；默认值为 `md start %id%`。
- `permission` 留空时不限制打开菜单；填写后，玩家必须拥有该权限。
- `close-on-click` 在 `detail-menu.enabled: false` 的直接执行模式下控制执行命令前是否关闭菜单，也可在某个按钮内单独配置。
- 菜单 ID 仅使用小写字母、数字、下划线和连字符，例如 `daily_dungeons`。

独立菜单的标题、物品名称、lore 和命令支持 `%id%`、`%name%`、`%description%`、`%min_players%`、`%max_players%`、`%difficulty%`、`%difficulty_id%`、`%difficulty_name%` 和 `%player%`。修改或新增菜单后执行 `/md admin reload` 生效。
