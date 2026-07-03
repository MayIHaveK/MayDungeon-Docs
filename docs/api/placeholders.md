# PlaceholderAPI 占位符

MayDungeon 提供 PlaceholderAPI 占位符，支持双前缀：`%maydungeon_xxx%` 和 `%md_xxx%`，两者等效。

## 完整占位符列表

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
| `kills` | 个人击杀数 |
| `deaths` | 个人死亡数 |
| `revive_remaining` | 剩余复活次数 |
| `team_size` | 队伍人数 |
| `team_leader` | 队长名字 |
| `is_team_leader` | 是否为队长（true/false） |
| `active_instances` | 活跃副本实例数 |
| `total_players` | 所有副本中的总玩家数 |
| `monsters_remaining` | 副本剩余怪物数 |
| `phase` | 当前阶段 |
| `task_current` | 当前任务描述 |
| `kill_<怪物名>` | 指定怪物击杀数（如 `kill_zombie`） |
| `data_<key>` | 读取副本运行时数据（如 `data_score`） |
| `item_<MATERIAL>` | 玩家背包中指定材质物品数量（如 `item_DIAMOND`） |

## 使用示例

### 计分板显示

```yaml
# 配合计分板插件使用
lines:
  - "&6副本: %md_dungeon_name%"
  - "&a存活: %md_alive_count%/%md_player_count%"
  - "&c击杀: %md_kills%"
  - "&e剩余怪物: %md_monsters_remaining%"
  - "&b时间: %md_elapsed_time_formatted%"
```

### 动态数据

```yaml
# 读取脚本中 setData 设置的数据
lines:
  - "&d积分: %md_data_score%"
  - "&6阶段: %md_phase%"
```

## 注意事项

- 前缀 `%maydungeon_xxx%` 和 `%md_xxx%` 完全等效，推荐使用短前缀 `%md_xxx%`
- 玩家不在副本中时，副本相关占位符返回空字符串
- `kill_<怪物名>` 的怪物名为小写，使用 MythicMobs 名或实体类型名
- `data_<key>` 对应脚本中 `dungeon.setData(key, value)` 设置的值
