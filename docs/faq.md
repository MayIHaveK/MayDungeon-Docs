# 常见问题

## 安装相关

### 启动报 "JavaScript 引擎不可用"

需要安装 NashornJS 插件。将 `NashornJs.jar` 放入 `plugins/` 目录。

### 地图不存在的警告

这是正常提示。将地图文件放入 `plugins/MayDungeon/maps/<地图名>/` 后执行 `/md admin reload`。

### 怪物不生成

检查 MythicMobs 配置是否正确放入并 reload。执行 `/mm mobs` 确认怪物已注册。

### Overture 物品消耗一直提示不足

确认服务器已安装并启用 Overture，且 `item-cost` 中的 ID 与 Overture 物品 ID 完全一致，例如：

```yaml
conditions:
  item-cost:
    - "overture:example_item:1"
```

如果 Overture 未启用，`overture:` 类型会被视为不足，但不会影响插件启动。

## 使用相关

### 副本卡住不结束

检查 `on_monster_kill.js` 中的通关条件逻辑。可以用 `/md admin forceend <实例ID>` 强制结束。

### 死亡后无法复活

确认 `dungeon.yml` 中 `revive.max-revive` 大于 0。使用 `/md revive` 命令复活。

### 怪物杀完了但没触发下一阶段

确认怪物的死亡方式——摔死、岩浆等非玩家击杀也会计入。用 `/md script monsters.getAliveCount("wave_1")` 检查剩余数量。

### 障碍物（门）不消失

检查 `obstacles.yml` 中的坐标是否在地图范围内。确认 `obstacles.define()` 在 `on_init.js` 中被正确调用。

## 性能相关

### 同时运行多个副本卡顿

调整 `config.yml` 中的 `world.max-concurrent-copies` 降低并发复制数。

### 脚本执行很慢

避免在高频事件（如 `on_monster_kill`）中做大量计算。使用 `tasks.startRepeating()` 替代轮询。

## 开发相关

### 如何调试脚本

1. 在 `config.yml` 中开启 `setting.debug: true`
2. 使用 `/md script <JS代码>` 在副本内实时执行
3. 用 `print(变量)` 输出到控制台

### trigger 为 null 怎么办

某些事件（如 `on_init`、`on_end`）没有触发者。脚本已有容错包装，访问 null 的 trigger 不会崩溃，只会打印警告。
