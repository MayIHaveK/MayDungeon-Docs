# blocks - 方块机关、差分记录与自动回滚

`blocks` 对象用于在副本运行期间动态开启机关门、放置/清除障碍或临时改造地形，并**自动记录每个坐标首次修改前的原始 `BlockData`**。

在 `reusable` 常驻复用模式下，插件进入世界还原流程时会**自动调用 `blocks.restoreAll()`**，一键无损还原该局所有方块改动。

## 方法列表

| 方法 | 返回值 | 说明 |
| --- | --- | --- |
| `setBlock(x, y, z, material)` | boolean | 设置单个方块并记录原始方块状态 |
| `fill(x1, y1, z1, x2, y2, z2, material)` | int | 填充立方体区域（单次安全上限 32,768 格）并记录差分 |
| `clear(x1, y1, z1, x2, y2, z2)` | int | 清空立方体区域为 `AIR` 并记录差分 |
| `openDoor(doorId, x1, y1, z1, x2, y2, z2)` | int | 打开命名机关门（记录该门原始方块后置空为 `AIR`） |
| `closeDoor(doorId)` | int | 原样恢复由 `openDoor` 打开的命名机关门 |
| `getBlock(x, y, z)` | String | 查询当前坐标的方块材质名 |
| `restoreAll()` | int | 立即同步还原本局经由 `blocks` 修改过的全部方块，返回还原格数 |
| `getModifiedCount()` | int | 返回当前已记录的差异方块总数 |

## 使用示例

```javascript
defineDungeon({
  onGroupClear({ event, blocks, dungeon }) {
    if (event.get('group') === 'wave1') {
      blocks.openDoor('boss_gate', 10, 65, 20, 10, 68, 22);
      dungeon.broadcast('&a机关大门已开启！');
    }
  },
  onReset({ blocks }) {
    blocks.restoreAll();
    return true;
  }
});
```
