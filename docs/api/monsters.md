# monsters - 怪物管理

`monsters` 对象用于生成、管理和清除副本中的怪物，支持原版怪物和 MythicMobs。

## 通用约定

- 位置参数格式: `"x,y,z"` | 颜色代码: `&` 前缀 | 时间: tick（20tick=1秒）| 材质: 大写英文

## 方法列表

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `spawn(group, config)` | void | 生成自定义怪物 |
| `spawnMultiple(group, type, loc, count, scatter)` | void | 批量生成原版怪物 |
| `spawnMythic(group, mmName, loc, count, scatter)` | void | 生成 MythicMobs 怪物 |
| `spawnMythicLevel(group, mmName, loc, count, scatter, level)` | void | 生成指定等级的 MythicMobs 怪物 |
| `killGroup(group)` | void | 清除指定怪物组 |
| `killAll()` | void | 清除副本内所有怪物 |
| `getAliveCount(group)` | int | 获取怪物组存活数量 |
| `isGroupCleared(group)` | boolean | 怪物组是否已全部清除 |

### spawn config 参数

`spawn` 方法的 `config` 为一个对象，字段如下：

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | String | 实体类型（如 `"ZOMBIE"`） |
| `x` | double | X 坐标 |
| `y` | double | Y 坐标 |
| `z` | double | Z 坐标 |
| `health` | double | 生命值 |
| `damage` | double | 攻击力 |
| `speed` | double | 移动速度 |
| `name` | String | 显示名称 |

## 使用示例

### 生成自定义 Boss

```javascript
function on_start() {
    monsters.spawn("boss", {
        type: "WITHER_SKELETON",
        x: 100, y: 65, z: 200,
        health: 500,
        damage: 15,
        speed: 0.3,
        name: "&4暗影骑士"
    });
}
```

### 批量生成原版怪物

```javascript
function on_area_enter() {
    var area = dungeon.getData("_area_name");
    if (area == "wave_zone") {
        monsters.spawnMultiple("wave1", "ZOMBIE", "100,65,200", 10, 5);
        monsters.spawnMultiple("wave1", "SKELETON", "100,65,200", 5, 5);
        dungeon.broadcast("&c第一波怪物来袭！");
    }
}
```

### 使用 MythicMobs 生成

```javascript
function on_group_clear() {
    var group = dungeon.getData("_group_name");
    if (group == "wave1") {
        monsters.spawnMythicLevel("boss", "DragonLord", "110,65,200", 1, 0, 5);
        dungeon.broadcast("&4最终Boss出现了！");
    }
}
```

## 注意事项

- `group` 是怪物组名称，同名的怪物会归入同一组，便于统一管理
- `scatter` 参数为散布半径，怪物会在指定位置周围随机分布
- `spawnMythic` 需要服务器安装 MythicMobs 插件
- 怪物组全灭时会自动触发 `on_group_clear.js` 事件
- `killGroup` 和 `killAll` 会立即移除怪物实体
