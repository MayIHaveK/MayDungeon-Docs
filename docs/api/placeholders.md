# PlaceholderAPI 占位符

MayDungeon 提供 PlaceholderAPI 占位符，支持双前缀：`%maydungeon_xxx%` 和 `%md_xxx%`，两者等效。

## 完整占位符列表

### 副本状态

| 占位符 | 说明 |
|--------|------|
| `in_dungeon` | 玩家是否在副本中（true/false） |
| `dungeon_name` | 当前副本显示名称 |
| `dungeon_id` | 当前副本 ID |
| `state` | 副本状态：`CREATING`、`WAITING`、`RUNNING`、`COMPLETED`、`FAILED` 或 `ENDING` |
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
| `kills` | 当前副本全队总击杀数 |
| `deaths` | 个人死亡数 |
| `revive_remaining` | 剩余复活次数（-1=无限） |
| `revive_coins` | 复活币余额 |
| `stamina` | 当前体力值 |
| `stamina_current` | 当前体力值 |
| `stamina_remaining` | 当前剩余体力值 |
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

支持的属性：`name`、`health`、`max_health`、`health_percent`、`kills`、`deaths`、`alive`、`online`、`revive_remaining`、`uuid`。

其中 `name`、`uuid`、`online`、`health`、`max_health`、`health_percent` 在副本外也可读取；`kills`、`deaths`、`alive`、`revive_remaining` 依赖副本实例，副本外返回安全默认值。

### 每日挑战次数

| 占位符 | 说明 |
|--------|------|
| `daily_<地牢ID>` | 今日已挑战次数（兼容旧变量） |
| `daily_used_<地牢ID>` | 今日已挑战次数 |
| `daily_max_<地牢ID>` | 今日最大挑战次数（-1=无限制） |
| `daily_left_<地牢ID>` | 今日剩余次数（-1=无限制） |

### 伤害排行

| 占位符 | 说明 |
|--------|------|
| `rank_list_<序号>_name` | 指定名次玩家的名称，序号从 `0` 开始 |
| `rank_list_<序号>_damage` | 指定名次玩家的累计伤害 |
| `rank_list_<序号>_damage_percent` | 指定名次伤害占当前副本总伤害的百分比（0-100） |
| `rank_self` | 当前玩家的伤害名次，从 `1` 开始；未上榜返回 `0` |

榜单按伤害从高到低排列，伤害和百分比最多保留两位小数。超出榜单范围时，`name` 返回空字符串，`damage` 与 `damage_percent` 返回 `0`。

这些变量读取当前副本的 [`ranking` 伤害排行数据](./ranking.md)。副本脚本需要在有效伤害事件中调用 `ranking.addDamage(...)`；未记录伤害时榜单为空。

### 动态数据

| 占位符 | 说明 |
|--------|------|
| `kill_<怪物名>` | 指定怪物击杀数（如 `kill_zombie`） |
| `data_<key>` | 读取副本运行时数据（如 `data_score`） |
| `item_<MATERIAL>` | 玩家在副本内时，背包中指定 Bukkit 材质的物品数量 |

## 使用示例

### 计分板显示

```yaml
lines:
  - "&6副本: %md_dungeon_name%"
  - "&a存活: %md_alive_count%/%md_player_count%"
  - "&c击杀: %md_kills%"
  - "&e怪物: %md_monsters_remaining%"
  - "&b时间: %md_elapsed_time_formatted%"
  - "&d体力: %md_stamina_current%/%md_stamina_max%"
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
  - "&6金币本: %md_daily_used_gold_dungeon%/%md_daily_max_gold_dungeon%"
  - "&d强化本: %md_daily_left_enhance_dungeon%次剩余"
```

### 伤害排行榜

```yaml
lines:
  - "&6伤害榜 &7| &f我的排名: &e%md_rank_self%"
  - "&e1. %md_rank_list_0_name% &7- &f%md_rank_list_0_damage% &8(%md_rank_list_0_damage_percent%%%)"
  - "&f2. %md_rank_list_1_name% &7- &f%md_rank_list_1_damage% &8(%md_rank_list_1_damage_percent%%%)"
  - "&63. %md_rank_list_2_name% &7- &f%md_rank_list_2_damage% &8(%md_rank_list_2_damage_percent%%%)"
```

## 注意事项

- 前缀 `%maydungeon_xxx%` 和 `%md_xxx%` 完全等效，推荐使用短前缀
- 玩家不在副本中时，副本相关占位符返回空字符串或 "0"
- `team_<N>_player_<属性>` 中序号超出范围返回空字符串
- `daily_left_`、`daily_used_`、`daily_max_` 注意比 `daily_` 多一级，含义不同
- `%md_kills%` 是全队总击杀；个人击杀请使用 `%md_team_<N>_player_kills%`
- `rank_list_<序号>_*` 的序号从 `0` 开始，而 `rank_self` 返回的实际名次从 `1` 开始
- 不限次数时，`daily_max_` 与 `daily_left_` 返回 `-1`
- 未识别的变量由扩展返回 `null`，其余副本外变量按上表语义返回空字符串、`0` 或 `false`
