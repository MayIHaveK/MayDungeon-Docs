# 进入条件系统

MayDungeon 提供丰富的进入条件配置，用于控制玩家挑战副本的门槛和频率。

## 配置总览

所有进入条件都在每个副本的 `dungeon.yml` 的 `conditions` 段中配置：

```yaml
conditions:
  # 最低等级
  min-level: 10
  # 冷却时间（秒）
  cooldown: 300
  # 进入权限节点
  permission: "maydungeon.vip"
  # 体力消耗
  stamina-cost: 10
  # 每日挑战次数上限
  daily-limit: 3
  # 每日次数重置时间（覆盖全局配置，-1=使用全局）
  daily-limit-reset-hour: -1
  # 金币消耗（需要 Vault）
  money-cost: 1000
  # 物品消耗
  item-cost:
    - "DIAMOND:5"
    - "mythic:强化石:3"
    - "mythic:深渊入场券:1"
    - "overture:example_item:1"
  # 需要持有的物品（不消耗）
  required-items:
    - "DIAMOND_SWORD"
```

## 进入权限

通过 `permission` 字段设置进入副本所需的权限节点。适用于 VIP 专属副本。

```yaml
conditions:
  permission: "maydungeon.vip"
```

- 空字符串或不配置表示无权限限制
- 队伍中所有成员都必须拥有该权限
- 可配合 LuckPerms 等权限插件使用

**使用场景：**
- VIP 1.5倍爆率副本：`permission: "maydungeon.dungeon.vip_bonus"`
- 付费玩家专属副本：`permission: "group.premium"`

## 每日挑战次数

限制每个玩家每天进入同一副本的次数。适用于金币副本、强化石副本等资源型副本。

```yaml
conditions:
  daily-limit: 3
```

### 全局配置

在 `config.yml` 中设置全局每日重置时间：

```yaml
dungeon:
  daily-limit-reset-hour: 5  # 凌晨5点重置
```

### 每副本覆盖

```yaml
conditions:
  daily-limit: 5
  daily-limit-reset-hour: 0  # 此副本在午夜12点重置
```

### 管理命令

| 命令 | 说明 |
|------|------|
| `/md admin dailylimit <玩家> <地牢>` | 查看玩家今日次数 |
| `/md admin dailylimit <玩家> <地牢> set <值>` | 设置次数 |
| `/md admin dailylimit <玩家> <地牢> reset` | 重置次数为0 |

### PlaceholderAPI 占位符

| 占位符 | 说明 |
|--------|------|
| `%md_daily_<地牢ID>%` | 今日已挑战次数（兼容旧变量） |
| `%md_daily_used_<地牢ID>%` | 今日已挑战次数 |
| `%md_daily_max_<地牢ID>%` | 今日最大挑战次数（-1=无限制） |
| `%md_daily_left_<地牢ID>%` | 今日剩余次数（-1=无限制） |

## 金币消耗

进入副本时消耗指定金额（需要 Vault 经济插件）。

```yaml
conditions:
  money-cost: 1000
```

- 需要服务器安装 Vault 和经济插件（如 EssentialsX Economy）
- 队伍中每个成员都会被扣除金币
- 未安装 Vault 时此配置静默跳过

## 物品消耗

进入副本时消耗指定物品。支持原版物品、MythicMobs 物品和 Overture 物品库物品。

```yaml
conditions:
  item-cost:
    - "DIAMOND:5"           # 原版钻石 x5
    - "GOLD_INGOT:10"      # 原版金锭 x10
    - "mythic:强化石:3"    # MythicMobs 物品
    - "mythic:入场券:1"    # MythicMobs 物品
    - "overture:门票:1"    # Overture 物品
```

### 格式说明

| 格式 | 说明 | 示例 |
|------|------|------|
| `MATERIAL:数量` | 原版物品 | `DIAMOND:5` |
| `mythic:物品ID:数量` | MythicMobs 物品 | `mythic:强化石:3` |
| `overture:物品ID:数量` | Overture 物品库物品 | `overture:门票:1` |

- MythicMobs 物品通过 `isSimilar()` 进行匹配（名称、lore、NBT 完全一致）
- Overture 物品通过 Overture API 判断物品 ID
- 队伍中每个成员都需要持有并会被扣除
- 未安装 MythicMobs 时，`mythic:` 前缀的物品检查会失败
- 未安装或未启用 Overture 时，`overture:` 前缀的物品检查会失败
- 数量必须大于 0，否则该条配置会被视为无效配置

## 数据存储

每日挑战次数数据兼容所有存储后端：

- **YAML**：`data/daily_limits/{uuid}.yml`
- **SQLite**：`player_daily_limits` 表
- **MySQL**：`{prefix}player_daily_limits` 表

## 检查顺序

进入副本时，条件按以下顺序检查（通过即继续，不通过立即返回）：

1. 是否已在副本中
2. 队伍人数是否满足
3. 队伍成员是否在其他副本中
4. 等级限制（全队检查）
5. **权限检查**（全队检查）
6. 体力检查（全队检查）
7. **每日次数检查**（全队检查）
8. **金币检查**（全队检查）
9. **物品检查**（全队检查）
10. 全局频率限制（5秒防刷）
11. 地牢独立冷却

所有消耗（体力、金币、物品、次数计数、冷却记录）在检查全部通过后**立即预扣**，消除检查与异步世界创建之间的竞态窗口。如果世界创建失败，体力和金币会自动退还。

## 冷却时间

每个副本可配置独立的冷却时间：

```yaml
conditions:
  cooldown: 3600  # 秒，进入后1小时内不能再进
```

- 冷却仅存储在内存中，服务器重启后自动清除
- 冷却对队伍中所有进入的玩家生效
- 与全局5秒防刷频率限制独立运作

## 配置示例

### 金币副本（每日3次，消耗金币入场）

```yaml
display-name: "&6金币宝库"
conditions:
  daily-limit: 3
  money-cost: 500
```

### VIP 1.5倍爆率副本

```yaml
display-name: "&d✦ VIP专属 - 矿脉深渊"
conditions:
  permission: "maydungeon.vip"
  stamina-cost: 15
```

### 深渊挑战（消耗入场券 + 强化石）

```yaml
display-name: "&c深渊裂隙"
conditions:
  daily-limit: 1
  item-cost:
    - "mythic:深渊入场券:1"
    - "mythic:暗能量碎片:5"
    - "overture:深渊钥匙:1"
  money-cost: 2000
```

### 每日经验副本（免费但限次）

```yaml
display-name: "&a每日修炼场"
conditions:
  daily-limit: 5
  daily-limit-reset-hour: 4
```

## 测试指南

### 测试每日次数限制

```
# 设置副本 daily-limit: 2
/md admin dailylimit <你的名字> <地牢> set 1
/md start <地牢>   # 应该成功（第2次）
/md start <地牢>   # 应该提示"今日次数已满"

# 重置测试
/md admin dailylimit <你的名字> <地牢> reset
/md start <地牢>   # 应该再次成功
```

### 测试权限限制

```
# 设置副本 permission: "maydungeon.vip"

# 没有权限时
/md start <地牢>   # 应该提示"权限不足"

# 给予权限后
/lp user <玩家> permission set maydungeon.vip true
/md start <地牢>   # 应该正常进入
```

### 测试金币消耗

```
# 设置副本 money-cost: 1000，确保 Vault 已安装

# 余额不足时
/eco set <玩家> 500
/md start <地牢>   # 应该提示"金币不足"

# 余额充足时
/eco set <玩家> 2000
/md start <地牢>   # 应该成功，余额变为 1000
```

### 测试物品消耗

```
# 设置副本 item-cost: ["DIAMOND:5"]

# 物品不足时
/give <玩家> diamond 3
/md start <地牢>   # 应该提示"物品不足"

# 物品充足时
/give <玩家> diamond 5
/md start <地牢>   # 应该成功，钻石被消耗

# MythicMobs 物品测试
# 设置 item-cost: ["mythic:强化石:1"]
/mm items give <玩家> 强化石 1
/md start <地牢>   # 应该成功

# Overture 物品测试
# 设置 item-cost: ["overture:门票:1"]
# 使用 Overture 的给物品命令或菜单给予玩家对应物品
/md start <地牢>   # 应该成功并扣除 Overture 物品
```

### 组合条件测试

```
# 设置副本同时配置多种条件
conditions:
  permission: "maydungeon.vip"
  daily-limit: 3
  money-cost: 500
  stamina-cost: 10
  item-cost:
    - "DIAMOND:1"

# 逐个满足条件来验证检查顺序
```

### 测试冷却时间

```
# 设置副本 cooldown: 60（60秒冷却）
/md start <地牢>   # 第一次成功
/md start <地牢>   # 应该提示"冷却中，XX秒后可再次挑战"

# 等待60秒后
/md start <地牢>   # 应该再次成功
```

### 测试世界创建失败退还

```
# 验证：如果世界创建失败，体力和金币是否自动退还
# 方法：配置一个不存在的地图名称
# dungeon.yml:
#   map-name: "nonexistent_map"
#   conditions:
#     money-cost: 1000
#     stamina-cost: 10

/eco set <玩家> 2000
/md admin stamina <玩家> set 50
/md start <地牢>   # 世界创建失败
/eco balance       # 应该仍为 2000（已退还）
/md stamina        # 应该仍为 50（已退还）
```

### 测试队伍全员检查

```
# 验证所有条件对队伍每个成员都生效

# 等级检查：队员等级不足
/md team create
/md team invite <低等级玩家>
# 低等级玩家接受邀请
/md start <需要10级的地牢>   # 应提示"xx 等级不足"

# 权限检查：队员无权限
# 队长有 vip 权限，队员没有
/md start <vip副本>   # 应提示"xx 没有权限进入此副本"

# 体力/金币/物品：队员资源不足
# 队长有足够资源，队员没有
/md start <地牢>   # 应提示对应队员的不足信息
```

### 占位符验证

```
# 通过 PlaceholderAPI 验证数据正确性
/papi parse <玩家> %md_stamina%            # 当前体力
/papi parse <玩家> %md_stamina_max%        # 最大体力
/papi parse <玩家> %md_stamina_percent%    # 体力百分比
/papi parse <玩家> %md_daily_<地牢>%       # 今日已挑战次数
/papi parse <玩家> %md_daily_left_<地牢>%  # 今日剩余次数
```
