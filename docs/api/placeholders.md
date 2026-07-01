# PlaceholderAPI 变量

MayDungeon 提供 PlaceholderAPI 变量，可在计分板、全息文字等地方使用。

## 前置要求

需要安装 PlaceholderAPI 插件，MayDungeon 会自动注册扩展。

## 可用变量

### 玩家相关

| 变量 | 说明 | 示例输出 |
|------|------|----------|
| `%md_in_dungeon%` | 是否在副本中 | `true` / `false` |
| `%md_dungeon_name%` | 当前副本名称 | `深渊迷宫` |
| `%md_dungeon_id%` | 当前副本 ID | `abyss_maze` |
| `%md_team_size%` | 队伍人数 | `4` |
| `%md_team_leader%` | 队长名 | `Steve` |

### 副本状态

| 变量 | 说明 | 示例输出 |
|------|------|----------|
| `%md_time_left%` | 剩余时间（秒） | `342` |
| `%md_time_left_formatted%` | 格式化剩余时间 | `5:42` |
| `%md_monsters_remaining%` | 剩余怪物数 | `7` |
| `%md_phase%` | 当前阶段名 | `Boss战` |
| `%md_task_current%` | 当前任务名 | `消灭僵尸` |

### 统计数据

| 变量 | 说明 | 示例输出 |
|------|------|----------|
| `%md_kills%` | 本次击杀数 | `15` |
| `%md_deaths%` | 本次死亡数 | `2` |
| `%md_total_clears%` | 历史通关总次数 | `47` |
| `%md_total_clears_<ID>%` | 特定副本通关次数 | `12` |
| `%md_best_time_<ID>%` | 最快通关时间 | `3:21` |
| `%md_daily_count_<ID>%` | 今日进入次数 | `2` |

### 服务器统计

| 变量 | 说明 | 示例输出 |
|------|------|----------|
| `%md_active_instances%` | 运行中的实例数 | `5` |
| `%md_total_players%` | 副本中总玩家数 | `12` |
| `%md_queue_size_<ID>%` | 排队等待人数 | `3` |

## 使用示例

### 在 DecentHolograms 中使用

```
/dh create dungeon_info
/dh line add dungeon_info "&6&l副本大厅"
/dh line add dungeon_info "&7运行中: &e%md_active_instances%"
/dh line add dungeon_info "&7你的通关次数: &a%md_total_clears%"
```

### 在计分板插件中使用

```yaml
# scoreboard配置示例
lines:
  - "&6副本: %md_dungeon_name%"
  - "&c剩余怪物: %md_monsters_remaining%"
  - "&e时间: %md_time_left_formatted%"
  - "&a击杀: %md_kills%"
```
