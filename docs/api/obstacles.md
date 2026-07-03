# obstacles - 障碍物

`obstacles` 对象用于定义和操作副本中的障碍物区域（如门、墙壁、桥梁等），可以动态移除和恢复。

## 通用约定

- 位置参数格式: `"x,y,z"` | 颜色代码: `&` 前缀 | 时间: tick（20tick=1秒）| 材质: 大写英文

## 方法列表

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `define(name, min, max, material)` | void | 定义障碍物区域 |
| `remove(name)` | void | 移除障碍物（变为空气） |
| `restore(name)` | void | 恢复障碍物（重新填充材质） |
| `setRegion(min, max, material)` | void | 设置任意区域为指定材质 |
| `clearRegion(min, max)` | void | 清除区域（变为空气） |

## 使用示例

### 定义并控制大门

```javascript
function on_init() {
    obstacles.define("main_gate", "100,64,200", "100,68,203", "IRON_BARS");
    obstacles.define("boss_door", "150,64,180", "150,68,183", "OBSIDIAN");
}

function on_group_clear() {
    obstacles.remove("main_gate");
    dungeon.broadcast("&a大门已开启！继续前进！");
}
```

### 动态创建桥梁

```javascript
function on_area_enter() {
    var area = dungeon.getData("_area_name");
    if (area == "bridge_trigger") {
        obstacles.setRegion("80,63,100", "90,63,100", "STONE_BRICKS");
        dungeon.broadcast("&7桥梁已出现...");
    }
}
```

### Boss 战封锁房间

```javascript
function on_area_enter() {
    var area = dungeon.getData("_area_name");
    if (area == "boss_room") {
        obstacles.restore("boss_door");
        dungeon.broadcast("&c门已关闭，击败 Boss 才能离开！");
    }
}

function on_group_clear() {
    var group = dungeon.getData("_group_name");
    if (group == "boss") {
        obstacles.remove("boss_door");
    }
}
```

## 注意事项

- `define` 应在 `on_init.js` 中调用，定义后不会立即修改方块
- `remove` 将区域内所有方块替换为空气，`restore` 将其还原为定义时的材质
- `setRegion` 和 `clearRegion` 不需要预先 define，可直接操作任意区域
- 材质名使用 Bukkit Material 枚举名，如 `"STONE"`、`"IRON_BARS"`、`"OBSIDIAN"`
