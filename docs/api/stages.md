# stages - 声明式多阶段与波次编排

`stages` 对象让你用声明式配置编排副本的多个阶段与怪物波次，并在怪物组清零（`on_group_clear`）时自动推进至下一阶段或自动通关，彻底告别繁琐的 `if (phase === 1) ...` 样板代码。

## 方法列表

| 方法 | 说明 |
| --- | --- |
| `define(stageId, spec)` | 定义一个阶段（字段见下表） |
| `start(stageId)` | 立即进入指定阶段（发提示、改 BossBar、刷怪、触发 `onEnter`） |
| `next()` | 推进到当前阶段配置的 `next` 阶段（未配 `next` 时按定义顺序推进） |
| `completeCurrent()` | 手动完成当前阶段（触发 `onClear` 并按 `next` / `completeOnClear` 推进） |
| `onStageClear(stageId, callback)` | 为指定阶段绑定额外的清理完成回调 |
| `getCurrent()` | 获取当前阶段 ID |
| `getStageIndex()` | 获取当前阶段序号（从 0 开始） |
| `isStage(stageId)` | 判断当前是否处于指定阶段 |
| `getStageIds()` | 返回已定义的全部阶段 ID 列表 |

### `define(stageId, spec)` 支持的字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `title` / `subtitle` | String | 进入阶段时向全队广播屏幕 Title |
| `message` | String | 进入阶段时向全队广播聊天消息 |
| `bossbar` / `bossbarColor` | String | 进入阶段时自动显示/更新阶段进度 BossBar |
| `group`（或 `wave`） | String | 关联的怪物组名；该组全灭时**自动触发阶段完成与推进** |
| `mobs` | Array | 自动刷怪清单，每项支持 `{ type, x, y, z, location, count, scatter, level, mythic, group }`；`type` 以 `mm:` 开头自动按 MythicMobs 生成 |
| `next` | String | 当前阶段完成后自动进入的下一阶段 ID |
| `delay` | int | 切换到 `next` 阶段的延迟秒数（默认 0） |
| `completeOnClear` | boolean | 当前阶段清完后是否自动判定副本成功 |
| `completeDelay` | int | 自动通关的延迟秒数（默认 3） |
| `onEnter` / `onClear` | Function | 进入 / 完成阶段的自定义回调 |

## 使用示例

```javascript
defineDungeon({
  onInit({ stages, blocks }) {
    stages.define('wave1', {
      title: '&6第一波',
      subtitle: '&7击退大门守卫',
      bossbar: '&e阶段 1：大门守卫',
      group: 'gate_guards',
      mobs: [
        { type: 'ZOMBIE', x: 10, y: 65, z: 10, count: 6, scatter: 3.0 }
      ],
      delay: 2,
      next: 'boss',
      onClear: () => blocks.openDoor('boss_gate', 15, 65, 10, 15, 68, 12)
    });

    stages.define('boss', {
      title: '&c最终首领',
      bossbar: '&c拉蒂兹',
      bossbarColor: 'RED',
      group: 'final_boss',
      mobs: [
        { type: 'mm:RaditzBoss', x: 25, y: 65, z: 10, count: 1, level: 5 }
      ],
      completeOnClear: true,
      completeDelay: 5
    });
  },
  onStart({ stages }) {
    stages.start('wave1');
  }
});
```
