# holograms - 全息文字

`holograms` 对象用于创建和管理副本中的全息文字显示，需要服务器安装 **DecentHolograms** 插件。

## 通用约定

- 位置参数格式: `"x,y,z"` | 颜色代码: `&` 前缀 | 时间: tick（20tick=1秒）| 材质: 大写英文

## 方法列表

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `create(id, loc, lines)` | void | 创建全息文字 |
| `update(id, lines)` | void | 更新已有全息文字内容 |
| `remove(id)` | void | 移除指定全息文字 |
| `removeAll()` | void | 移除副本内所有全息文字 |
| `isAvailable()` | boolean | 检查 DecentHolograms 是否可用 |

## 使用示例

### 创建任务提示

```javascript
function on_init() {
    if (holograms.isAvailable()) {
        holograms.create("task_info", "100,67,100", [
            "&6&l当前任务",
            "&f消灭所有怪物",
            "&7剩余: &c10"
        ]);
    }
}
```

### 动态更新内容

```javascript
function on_monster_kill() {
    var remaining = monsters.getAliveCount("enemies");
    holograms.update("task_info", [
        "&6&l当前任务",
        "&f消灭所有怪物",
        "&7剩余: &c" + remaining
    ]);

    if (remaining == 0) {
        holograms.update("task_info", [
            "&a&l任务完成！",
            "&f前往出口"
        ]);
    }
}
```

### 副本结束清理

```javascript
function on_end() {
    holograms.removeAll();
}
```

## 注意事项

- 使用前建议用 `isAvailable()` 检查依赖插件是否存在
- `lines` 参数为字符串数组，每个元素为一行文字
- 全息文字 ID 在副本内唯一，重复创建同 ID 会覆盖
- 支持 `&` 颜色代码
- 副本结束时全息文字会自动清理，但建议在 `on_end.js` 中显式调用 `removeAll()`
