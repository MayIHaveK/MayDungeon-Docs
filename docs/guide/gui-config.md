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
      - "&a左键进入副本"
    command: "md start %id%"

  hard:
    dungeon: hard_dungeon
    slot: 15
    material: NETHER_STAR
    name: "&c%name%"
    lore:
      - "&7%description%"
      - "&a左键进入副本"
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
- `command` 在玩家左键按钮时以该玩家身份执行，开头的 `/` 可写可不写；默认值为 `md start %id%`。
- `permission` 留空时不限制打开菜单；填写后，玩家必须拥有该权限。
- `close-on-click` 控制执行命令前是否关闭菜单，也可在某个按钮内单独配置。
- 菜单 ID 仅使用小写字母、数字、下划线和连字符，例如 `daily_dungeons`。

独立菜单的标题、物品名称、lore 和命令支持 `%id%`、`%name%`、`%description%`、`%min_players%`、`%max_players%`、`%difficulty%` 和 `%player%`。修改或新增菜单后执行 `/md admin reload` 生效。
