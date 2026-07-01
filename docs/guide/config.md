# 配置文件

MayDungeon 的全局配置文件位于 `plugins/MayDungeon/config.yml`。

## 主配置项

```yaml
# 语言设置
language: "zh_CN"

# 副本世界前缀
world-prefix: "md_instance_"

# 最大同时运行副本数
max-instances: 20

# 副本超时默认值（秒）
default-timeout: 600

# 世界回收间隔（tick）
world-cleanup-interval: 100

# 是否启用调试日志
debug: false
```

## 数据库配置

```yaml
database:
  type: sqlite  # sqlite / mysql
  mysql:
    host: "localhost"
    port: 3306
    database: "maydungeon"
    username: "root"
    password: ""
```

## 集成配置

```yaml
integrations:
  mythicmobs: true
  decent-holograms: true
  adyeshach: true
  placeholderapi: true
```

## 副本配置（dungeon.yml）

每个副本目录下的 `dungeon.yml` 支持以下字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | String | 副本显示名称 |
| `template-world` | String | 模板世界名 |
| `min-players` | int | 最少玩家数 |
| `max-players` | int | 最多玩家数 |
| `timeout` | int | 超时时间（秒） |
| `spawn` | Location | 出生点坐标 |
| `exit-spawn` | Location | 退出后传送点 |
| `allow-rejoin` | boolean | 是否允许重连 |
| `keep-inventory` | boolean | 死亡是否保留背包 |

## 消息配置

消息文件位于 `plugins/MayDungeon/messages/zh_CN.yml`，支持自定义所有插件提示文本。支持 `&` 颜色代码和 PlaceholderAPI 变量。
