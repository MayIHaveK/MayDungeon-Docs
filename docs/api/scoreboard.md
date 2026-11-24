# scoreboard - 副本侧边栏计分板

`scoreboard` 对象用于为副本内玩家展示专属侧边栏 HUD（剩余时间、当前阶段、击杀数、团队伤害等）。支持 `&` 颜色代码、自动去重与 **PlaceholderAPI** 变量；玩家离本或副本结束时会自动还原玩家原有的计分板。

## 方法列表

| 方法 | 说明 |
| --- | --- |
| `show(title, lines)` | 显示侧边栏（`lines` 最多 15 行，支持 JS 数组） |
| `setTitle(title)` | 更新侧边栏标题 |
| `setLines(lines)` | 整体替换侧边栏内容并立即刷新 |
| `setLine(index, text)` | 更新指定行（`0` – `14`）并刷新 |
| `autoRefresh(intervalTicks, callback)` | 按固定 tick 周期定时调用刷新回调（最低 5 tick，副本结束自动取消） |
| `stopAutoRefresh()` | 停止自动刷新任务 |
| `hide()` | 隐藏副本侧边栏并立即还原玩家原计分板 |
| `clear()` | 隐藏并清空内容 |
| `isActive()` | 当前侧边栏是否处于开启状态 |

## 使用示例

```javascript
defineDungeon({
  onStart({ scoreboard, stages, dungeon, ranking }) {
    scoreboard.autoRefresh(20, () => {
      const top = ranking.getTop(1);
      const mvp = top.size() > 0 ? top.get(0).get('name') : '暂无';
      scoreboard.show('&6&l深渊讨伐', [
        '&7阶段: &e' + stages.getCurrent(),
        '&7存活: &a' + dungeon.getAlivePlayers().size() + '/' + dungeon.getPlayerCount(),
        '&7用时: &f' + dungeon.getElapsedTime() + 's',
        '&7输出榜首: &b' + mvp
      ]);
    });
  }
});
```
