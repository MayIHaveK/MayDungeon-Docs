# 快速开始

本教程将带你在 5 分钟内创建并运行你的第一个副本。

## 准备地图

1. 在游戏中建造一个副本地图（或使用现成地图）
2. 将地图的 `region/` 文件夹和 `level.dat` 复制到：
   ```
   plugins/MayDungeon/maps/你的地图名/
   ├── region/
   │   └── r.0.0.mca ...
   └── level.dat
   ```

## 创建副本配置

在 `plugins/MayDungeon/dungeons/` 下创建文件夹，如 `my_dungeon/`：

```
plugins/MayDungeon/dungeons/my_dungeon/
├── dungeon.yml      ← 副本基础信息
├── presets.yml      ← 预设数据（可选）
└── scripts/         ← JS 脚本
    ├── on_init.js
    ├── on_start.js
    └── on_monster_kill.js
```

### dungeon.yml

```yaml
display-name: "&6我的第一个副本"
description: "击败所有怪物"
map-name: "你的地图名"

settings:
  min-players: 1
  max-players: 4
  time-limit: 300
  keep-inventory: true

spawn-point: "0.5, 65.0, 0.5"

revive:
  max-revive: 3
```

### scripts/on_init.js

```javascript
// 设置世界为夜晚
world.setTime(14000);

// 初始化副本数据
dungeon.setData("phase", 0);

print("副本初始化完成");
```

### scripts/on_start.js

```javascript
// 欢迎消息
players.sendTitle("&6开始!", "&7击败所有敌人", 10, 60, 20);

// 3秒后生成怪物
utils.delay(60, function() {
    monsters.spawnMultiple("wave_1", "ZOMBIE", "0,65,5", 3, 2.0);
    dungeon.setData("phase", 1);
});
```

### scripts/on_monster_kill.js

```javascript
// 怪物全部清除后通关
if (monsters.isGroupCleared("wave_1")) {
    dungeon.broadcast("&a通关!");
    dungeon.endWithDelay(true, 3);
}
```

## 重载并测试

```
/md admin reload
/md start my_dungeon
```

::: info
这就是 MayDungeon 的核心理念：**一个 YAML 配置 + 几个 JS 脚本 = 一个完整副本**。所有逻辑都在 JS 中，你可以实现任何你想要的玩法。
:::
