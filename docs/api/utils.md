# utils 对象

`utils` 对象提供各种实用工具方法，简化脚本编写。

## 方法列表

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `utils.random(min, max)` | int | 生成随机整数 |
| `utils.randomDouble(min, max)` | double | 生成随机浮点数 |
| `utils.chance(percent)` | boolean | 按百分比概率返回 true |
| `utils.delay(ticks, callback)` | void | 延迟执行 |
| `utils.color(text)` | String | 转换颜色代码 |
| `utils.stripColor(text)` | String | 去除颜色代码 |
| `utils.distance(x1, y1, z1, x2, y2, z2)` | double | 计算两点距离 |
| `utils.format(template, ...args)` | String | 格式化字符串 |
| `utils.runCommand(cmd)` | void | 以控制台执行命令 |
| `utils.playerCommand(player, cmd)` | void | 以玩家身份执行命令 |
| `utils.log(message)` | void | 输出到副本日志 |

## 使用示例

### 随机与概率

```javascript
function on_monster_kill(player, monster) {
    // 30% 概率掉落奖励
    if (utils.chance(30)) {
        var items = ["DIAMOND", "GOLD_INGOT", "EMERALD"];
        var index = utils.random(0, items.length - 1);
        player.give(items[index], 1);
        player.message("&a你获得了奖励！");
    }
}
```

### 延迟执行

```javascript
function on_start() {
    players.message("&e5秒后开始战斗...");
    utils.delay(100, function() {
        monsters.wave("wave_1", [
            { type: "zombie", count: 5, x: 100, y: 65, z: 100 }
        ]);
        players.title("&c战斗开始！", "");
    });
}
```

### 距离计算

```javascript
function on_timer(id) {
    if (id === "check_boss") {
        var allPlayers = players.all();
        for (var i = 0; i < allPlayers.length; i++) {
            var loc = allPlayers[i].getLocation();
            var dist = utils.distance(loc.x, loc.y, loc.z, 100, 65, 100);
            if (dist > 30) {
                allPlayers[i].message("&c你离Boss战场太远了！");
            }
        }
    }
}
```

### 执行命令

```javascript
function on_end() {
    var allPlayers = players.all();
    for (var i = 0; i < allPlayers.length; i++) {
        // 给予奖励
        utils.runCommand("give " + allPlayers[i].getName() + " diamond 5");
    }
}
```
