# areas - 区域系统

`areas` 对象用于定义副本中的逻辑区域并检测玩家位置，是触发事件和控制流程的核心工具。

## 通用约定

- 位置参数格式: `"x,y,z"` | 颜色代码: `&` 前缀 | 时间: tick（20tick=1秒）| 材质: 大写英文

## 方法列表

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `define(name, min, max)` | void | 定义一个命名区域 |
| `remove(name)` | void | 移除已定义的区域 |
| `isPlayerIn(name, playerName)` | boolean | 指定玩家是否在区域内 |
| `getPlayersIn(name)` | List | 获取区域内所有玩家名 |
| `getPlayerAreas(playerName)` | List | 获取玩家所在的所有区域名 |

## 使用示例

### 定义区域并触发事件

```javascript
function on_init() {
    areas.define("entrance", "90,60,90", "110,80,110");
    areas.define("boss_room", "150,60,150", "180,80,180");
    areas.define("treasure", "200,60,200", "210,70,210");
}

// on_area_enter.js
function on_area_enter() {
    var area = dungeon.getData("_area_name");
    var player = trigger.getPlayerName();

    if (area == "boss_room") {
        monsters.spawnMythic("boss", "DragonLord", "165,65,165", 1, 0);
        dungeon.broadcast("&4" + player + " 触发了 Boss 战！");
    }
}
```

### 检查玩家位置

```javascript
tasks.startRepeating("check_pos", 40, function() {
    var playersInTreasure = areas.getPlayersIn("treasure");
    if (playersInTreasure.length > 0) {
        dungeon.broadcast("&6有人发现了宝藏房间！");
        tasks.stop("check_pos");
    }
});
```

### 动态区域管理

```javascript
function on_group_clear() {
    // Boss 死亡后开启新区域检测
    areas.define("exit_zone", "180,60,170", "185,70,175");
    dungeon.broadcast("&a出口已开启，前往出口完成副本！");
}

// on_area_enter.js
function on_area_enter() {
    var area = dungeon.getData("_area_name");
    if (area == "exit_zone") {
        dungeon.end(true);
    }
}
```

## 注意事项

- 区域使用两个对角坐标定义（最小点和最大点）
- 玩家进入/离开区域时会自动触发 `on_area_enter.js` 和 `on_area_leave.js`
- 在事件脚本中通过 `dungeon.getData("_area_name")` 获取触发区域的名称
- 区域检测基于玩家脚部位置
