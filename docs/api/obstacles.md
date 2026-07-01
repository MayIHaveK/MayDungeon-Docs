# obstacles 对象

`obstacles` 对象用于管理副本中的障碍物，如门、陷阱、可移动方块等。

## 方法列表

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `obstacles.create(id, type, x, y, z)` | Obstacle | 创建障碍物 |
| `obstacles.get(id)` | Obstacle | 获取障碍物 |
| `obstacles.remove(id)` | void | 移除障碍物 |
| `obstacles.open(id)` | void | 打开障碍物（如门） |
| `obstacles.close(id)` | void | 关闭障碍物 |
| `obstacles.toggle(id)` | void | 切换状态 |
| `obstacles.all()` | Obstacle[] | 获取所有障碍物 |

## 障碍物类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `door` | 方块门，由指定方块填充/清除 | 铁门、石墙 |
| `trap` | 陷阱，触发后产生效果 | 地刺、火焰 |
| `platform` | 平台，可显示/隐藏 | 移动平台 |
| `barrier` | 屏障，不可见墙 | 区域限制 |

## 使用示例

```javascript
function on_init() {
    // 创建一扇由石砖组成的门
    obstacles.create("gate_1", "door", 100, 65, 100);
    obstacles.get("gate_1").setBlock("STONE_BRICKS");
    obstacles.get("gate_1").setSize(3, 3, 1); // 宽 高 厚

    // 创建陷阱
    obstacles.create("trap_1", "trap", 105, 64, 105);
    obstacles.get("trap_1").setDamage(5.0);
    obstacles.get("trap_1").setRadius(2.0);
}

function on_monster_kill(player, monster) {
    if (monsters.remaining() === 0) {
        obstacles.open("gate_1");
        players.message("&a大门已开启！");
        players.sound("BLOCK_IRON_DOOR_OPEN");
    }
}

function on_area_enter(player, area) {
    if (area.getId() === "trap_zone") {
        obstacles.get("trap_1").activate();
    }
}
```

## Obstacle 对象方法

| 方法 | 说明 |
|------|------|
| `obstacle.setBlock(material)` | 设置方块材质 |
| `obstacle.setSize(w, h, d)` | 设置尺寸 |
| `obstacle.activate()` | 激活障碍物 |
| `obstacle.isOpen()` | 是否处于开启状态 |
| `obstacle.setDamage(damage)` | 设置伤害值（陷阱） |
| `obstacle.setRadius(r)` | 设置影响半径 |
