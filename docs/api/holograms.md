# holograms 对象

`holograms` 对象用于在副本中创建和管理全息文字显示，基于 DecentHolograms 插件。

## 方法列表

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `holograms.create(id, x, y, z)` | Hologram | 创建全息图 |
| `holograms.get(id)` | Hologram | 获取全息图 |
| `holograms.remove(id)` | void | 移除全息图 |
| `holograms.removeAll()` | void | 移除所有全息图 |
| `holograms.all()` | Hologram[] | 获取所有全息图 |

## Hologram 对象方法

| 方法 | 说明 |
|------|------|
| `hologram.addLine(text)` | 添加文本行 |
| `hologram.setLine(index, text)` | 修改指定行 |
| `hologram.removeLine(index)` | 删除指定行 |
| `hologram.setLocation(x, y, z)` | 设置位置 |
| `hologram.setVisible(visible)` | 设置可见性 |
| `hologram.setVisibleTo(player)` | 仅对指定玩家可见 |
| `hologram.update()` | 刷新显示 |

## 使用示例

```javascript
function on_init() {
    // 创建副本信息显示
    var info = holograms.create("info", 100, 68, 100);
    info.addLine("&6&l深渊副本");
    info.addLine("&7击杀所有怪物通关");
    info.addLine("&c剩余怪物: 0");
}

function on_start() {
    var h = holograms.get("info");
    h.setLine(2, "&c剩余怪物: " + monsters.remaining());
}

function on_monster_kill(player, monster) {
    var h = holograms.get("info");
    h.setLine(2, "&c剩余怪物: " + monsters.remaining());
}
```

## 动态全息文字

可以结合定时器实现动态更新：

```javascript
function on_start() {
    dungeon.timer("update_hud", 20, true);
    var timer = holograms.create("timer", 100, 70, 100);
    timer.addLine("&e剩余时间");
    timer.addLine("&f" + dungeon.getTimeLeft() + "s");
}

function on_timer(id) {
    if (id === "update_hud") {
        var h = holograms.get("timer");
        h.setLine(1, "&f" + dungeon.getTimeLeft() + "s");
    }
}
```

## 前置依赖

使用全息功能需要服务器安装 DecentHolograms 插件。若未安装，调用 `holograms` 方法时会在控制台输出警告并安全跳过。

## 注意事项

- 全息图在副本结束时会自动清理
- 支持 `&` 颜色代码和十六进制颜色 `&#RRGGBB`
- 全息图默认对所有副本内玩家可见
