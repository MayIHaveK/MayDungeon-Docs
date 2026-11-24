# bossbar - 动态 Boss 血条与进度条

`bossbar` 对象用于管理副本内的 Boss 血条、阶段进度条与自动倒计时条。所有 BossBar 会自动同步副本在线玩家，并在副本结束或玩家离开时零泄漏自动销毁。

## 方法列表

| 方法 | 说明 |
| --- | --- |
| `show(id, title, progress)` | 显示或更新血条（`progress` 范围 `0.0` – `1.0`，默认红色实心） |
| `show(id, title, progress, color)` | 指定颜色：`BLUE` / `GREEN` / `PINK` / `PURPLE` / `RED` / `WHITE` / `YELLOW` |
| `show(id, title, progress, color, style)` | 指定样式：`SOLID` / `SEGMENTED_6` / `SEGMENTED_10` / `SEGMENTED_12` / `SEGMENTED_20` |
| `update(id, title, progress)` | 快速刷新标题与进度 |
| `setTitle(id, title)` | 仅修改标题（支持 `&` 颜色码） |
| `setProgress(id, progress)` | 仅修改进度（自动钳位到 `[0.0, 1.0]`） |
| `setColor(id, color)` | 修改血条颜色 |
| `countdown(id, titleTemplate, seconds, color)` | 创建自动每秒递减的倒计时条，标题支持 `%time%` 占位符，归零自动隐藏 |
| `hide(id)` | 隐藏并移除指定 ID 的 BossBar |
| `syncPlayers()` | 手动同步当前副本所有在线玩家为可见对象 |
| `clear()` | 清空本副本创建的全部 BossBar |
| `count()` | 返回当前活跃 BossBar 数量 |

## 使用示例

```javascript
defineDungeon({
  onStart({ bossbar }) {
    bossbar.show('phase', '&e当前阶段：&6清剿守卫', 1.0, 'YELLOW', 'SEGMENTED_10');
    bossbar.countdown('limit', '&c剩余通关时间: &f%time%s', 300, 'RED');
  },
  onMonsterKill({ bossbar, monsters }) {
    const alive = monsters.getAliveCount('guards');
    bossbar.update('phase', `&e剩余守卫: &f${alive}/10`, alive / 10.0);
  }
});
```
