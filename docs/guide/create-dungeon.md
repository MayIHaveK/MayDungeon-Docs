# 创建副本

本节介绍如何从零开始创建一个 MayDungeon 副本实例。

## 基本流程

1. 准备一个模板世界（建好地图）
2. 在插件配置目录中创建副本文件夹
3. 编写副本配置文件 `dungeon.yml`
4. 编写副本脚本 `script.js`
5. 使用命令加载副本

## 目录结构

```
plugins/MayDungeon/dungeons/
└── my_dungeon/
    ├── dungeon.yml      # 副本配置
    ├── script.js        # 主脚本
    └── scripts/         # 附加脚本（可选）
        └── boss.js
```

## 副本配置文件

`dungeon.yml` 定义副本的基础属性：

```yaml
name: "深渊迷宫"
template-world: "dungeon_abyss"
min-players: 1
max-players: 4
timeout: 600
# 进入点坐标
spawn:
  x: 0.5
  y: 65.0
  z: 0.5
```

## 编写脚本

副本逻辑通过 JavaScript（Nashorn 引擎）编写：

```javascript
function on_init() {
    print("副本初始化完成");
    monsters.spawn("zombie_wave_1", 100, 65, 100);
}

function on_start() {
    dungeon.setPhase("战斗阶段");
    players.title("&c副本开始！", "&7消灭所有怪物");
}

function on_monster_kill(player, monster) {
    if (monsters.remaining() === 0) {
        dungeon.complete();
    }
}
```

## 加载副本

```
/maydungeon reload
```

副本将自动注册，玩家可通过配置的入口方式进入。

## 注意事项

- 模板世界名称必须与服务器中实际存在的世界匹配
- 脚本文件使用 UTF-8 编码
- 副本 ID 为文件夹名称，不可包含中文或特殊字符
