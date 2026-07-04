# PlaceholderAPI 占位符

MayDungeon 提供 PlaceholderAPI 占位符，支持双前缀：`%maydungeon_xxx%` 和 `%md_xxx%`，两者等效。

## 完整占位符列表

### 副本状态

| 占位符 | 说明 |
|--------|------|
| `in_dungeon` | 玩家是否在副本中（true/false） |
| `dungeon_name` | 当前副本显示名称 |
| `dungeon_id` | 当前副本 ID |
| `state` | 副本状态（RUNNING/COMPLETED/FAILED） |
| `elapsed_time` | 已过时间（秒） |
| `elapsed_time_formatted` | 已过时间（格式化，如 05:30） |
| `time_left` | 剩余时间（秒） |
| `time_left_formatted` | 剩余时间（格式化） |
| `player_count` | 副本玩家数 |
| `alive_count` | 存活玩家数 |
| `monsters_remaining` | 副本剩余怪物数 |
| `phase` | 当前阶段 |
| `task_current` | 当前任务描述 |
| `active_instances` | 活跃副本实例数 |
| `total_players` | 所有副本中的总玩家数 |

### 个人数据

| 占位符 | 说明 |
|--------|------|
| `kills` | 个人击杀数 |
| `deaths` | 个人死亡数 |
| `revive_remaining` | 剩余复活次数（-1=无限） |
| `revive_coins` | 复活币余额 |
| `stamina` | 当前体力值 |
| `stamina_max` | 最大体力值 |
| `stamina_percent` | 体力百分比（0-100） |

### 队伍信息

| 占位符 | 说明 |
|--------|------|
| `team_size` | 队伍人数 |
| `team_leader` | 队长名字 |
| `is_team_leader` | 是否为队长（true/false） |

### 队伍成员数据

格式：`team_<序号>_player_<属性>`

序号从 0 开始，0 = 队长，之后按加入顺序。超出队伍人数范围返回空字符串。

| 占位符 | 说明 |
|--------|------|
| `team_0_player_name` | 队长名字 |
| `team_0_player_health` | 队长当前血量 |
| `team_0_player_max_health` | 队长最大血量 |
| `team_0_player_health_percent` | 队长血量百分比 |
| `team_1_player_kills` | 第2个成员击杀数 |
| `team_2_player_deaths` | 第3个成员死亡数 |
| `team_0_player_alive` | 队长是否存活（true/false） |
| `team_1_player_online` | 第2个成员是否在线 |
| `team_0_player_revive_remaining` | 队长剩余复活次数 |
| `team_1_player_uuid` | 第2个成员的 UUID |

支持的属性：`name`、`health`、`max_health`、`health_percent`、`kills`、`deaths`、`alive`、`online`、`revive_remaining`、`uuid`

### 每日挑战次数

| 占位符 | 说明 |
|--------|------|
| `daily_<地牢ID>` | 今日已挑战次数 |
| `daily_left_<地牢ID>` | 今日剩余次数（-1=无限制） |

### 动态数据

| 占位符 | 说明 |
|--------|------|
| `kill_<怪物名>` | 指定怪物击杀数（如 `kill_zombie`） |
| `data_<key>` | 读取副本运行时数据（如 `data_score`） |
| `item_<MATERIAL>` | 玩家背包中指定材质物品数量 |

## 使用示例

### 计分板显示

```yaml
lines:
  - "&6副本: %md_dungeon_name%"
  - "&a存活: %md_alive_count%/%md_player_count%"
  - "&c击杀: %md_kills%"
  - "&e怪物: %md_monsters_remaining%"
  - "&b时间: %md_elapsed_time_formatted%"
  - "&d体力: %md_stamina%/%md_stamina_max%"
```

### 队伍成员血量显示

```yaml
lines:
  - "&c♥ %md_team_0_player_name%: %md_team_0_player_health_percent%%%"
  - "&c♥ %md_team_1_player_name%: %md_team_1_player_health_percent%%%"
  - "&c♥ %md_team_2_player_name%: %md_team_2_player_health_percent%%%"
  - "&c♥ %md_team_3_player_name%: %md_team_3_player_health_percent%%%"
```

### 每日挑战信息

```yaml
lines:
  - "&6金币本: %md_daily_left_gold_dungeon%次剩余"
  - "&d强化本: %md_daily_left_enhance_dungeon%次剩余"
```

## 注意事项

- 前缀 `%maydungeon_xxx%` 和 `%md_xxx%` 完全等效，推荐使用短前缀
- 玩家不在副本中时，副本相关占位符返回空字符串或 "0"
- `team_<N>_player_<属性>` 中序号超出范围返回空字符串
- `daily_left_` 注意比 `daily_` 多一级，两者含义不同
- 所有占位符异步安全（内存缓存读取，零 IO）
