# records - 通关记录、首通检测与竞速排行榜

`records` 对象将每个副本的玩家通关次数、首通标记、个人最快用时、全服竞速榜（Speedrun Top-50）及自定义个人 KV 持久化到 `plugins/MayDungeon/data/records/<副本ID>.yml`，让你直接在脚本内实现首通奖励、保底计数与竞速排名。

## 方法列表

| 方法 | 返回值 | 说明 |
| --- | --- | --- |
| `isFirstClear(player)` | boolean | 判断玩家是否尚未通关过该副本（通关次数为 0） |
| `getClearCount(player)` | int | 获取玩家在该副本的历史通关次数 |
| `getBestTime(player)` | long | 获取玩家个人最快通关秒数（未通关过返回 `-1`） |
| `recordClear(players, elapsedSeconds)` | boolean | 记录本次通关：自动累加通关次数、写入首次通关时间、刷新个人最佳用时与竞速榜 Top-50 |
| `getTopSpeedruns(limit)` | List | 获取全服竞速榜前 `limit` 名（每项含 `rank`、`players`、`timeSeconds`、`difficulty`、`timestamp`） |
| `getPlayerData(player, key, defaultValue)` | Object | 读取该玩家在此副本下的持久化自定义 KV（如保底抽数、剧情进度） |
| `setPlayerData(player, key, value)` | void | 写入并持久化该玩家的自定义 KV |

## 使用示例

```javascript
defineDungeon({
  onComplete({ dungeon, players, loot, records }) {
    const elapsed = dungeon.getElapsedTime();
    // 1. 先检查并发送首通奖励
    loot.grantFirstClear(players.getAll(), 'first_clear');
    // 2. 写入本次通关记录与竞速榜
    records.recordClear(players.getAll(), elapsed);
    // 3. 播报当前竞速榜第一名
    const top = records.getTopSpeedruns(1);
    if (top.size() > 0) {
      const best = top.get(0);
      dungeon.broadcast(`&6本副本最快纪录: &e${best.get('timeSeconds')}s &7(${best.get('players')})`);
    }
  }
});
```
