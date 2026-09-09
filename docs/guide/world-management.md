# 世界管理

MayDungeon 从 `plugins/MayDungeon/maps/<地图名>/` 读取模板。默认 `disposable` 每局创建、结束后销毁；`reusable` 按需创建独立世界，还原成功后供下一队复用，闲置超时自动销毁。复制方式和生命周期可分别配置，CustomNPCs 等复杂模组场景建议使用 `copy`。

## 准备模板地图

### 从现有世界导入

1. 确认地图当前未被服务器加载。
2. 执行 `/md admin import <世界名>`。
3. 在副本的 `dungeon.yml` 中将 `map-name` 设为导入后的模板名。
4. 执行 `/md admin reload`，再用测试账号进入副本。

也可以在停服状态下将完整世界目录放入 `plugins/MayDungeon/maps/`。不要复制正在运行的世界，也不要把模板放入 `instances/`。

## 配置

```yaml
world:
  instance-dir: "instances"
  max-concurrent-copies: 2
  create-interval: 1000
  copy-exclude:
    - "session.lock"
    - "uid.dat"
    - "playerdata"
    - "advancements"
    - "stats"
  idle-chunk-unload: true
  preload-chunk-radius: 3
  preload-chunks-per-tick: 4
  instance-view-distance: 6
  copy-mode: "link"
  void-outside-template: true
```

| 配置 | 使用建议 |
|------|----------|
| `instance-dir` | 保持默认；该目录只存放临时实例 |
| `max-concurrent-copies` | 同时执行文件复制的任务数量，磁盘压力高时降低 |
| `create-interval` | 上次世界激活结束到下次激活的最小间隔，单位毫秒 |
| `preload-chunk-radius` | 进入前预加载出生点周围多少圈区块 |
| `preload-chunks-per-tick` | 每 tick 的预加载预算；越高完成越快，瞬时压力也越大 |
| `instance-view-distance` | 副本视距；`0` 跟随服务端默认值 |
| `copy-mode` | 默认 `link` 仅共享地形文件，实体、POI 等独立复制；不支持硬链接时回退为复制。`copy` 完整复制，复杂模组场景建议选此项 |
| `void-outside-template` | `true` 时模板已有区块之外为虚空 |

修改这些选项后建议重启服务器。若地图需要在模板边界外生成原版地形，必须关闭 `void-outside-template`。

## 每副本覆盖与常驻复用

全局 `plugins/MayDungeon/config.yml` 的 `world` 提供默认值；在 `plugins/MayDungeon/dungeons/<副本ID>/dungeon.yml` 中添加以下配置即可覆盖。没有填写的字段逐项继承全局值。

```yaml
world:
  copy-mode: "copy"       # copy 或 link；reusable 也允许使用 link
  mode: "reusable"        # disposable 每局销毁；reusable 还原后复用
  max-instances: 3        # 最多占用 3 个独立世界，不是预创建 3 个
  reuse:
    idle-timeout-minutes: 10  # 每个世界还原完成后独立计时，超时自动销毁
    max-idle: 1               # 最多保留 1 个空闲世界，不是最低保留数量
```

| 可覆盖字段 | 缺省值 | 说明 |
| --- | --- | --- |
| `copy-mode` | `link` | 复制方式；两个生命周期模式都允许 `copy` 和 `link` |
| `mode` | `disposable` | 未配置的旧副本保持每局销毁 |
| `max-instances` | `0` | `0` 不限，`1–256` 限制该副本已分配的世界槽位 |
| `reuse.idle-timeout-minutes` | `10` | `1–10080` 分钟；还原完成后开始计时 |
| `reuse.max-idle` | `1` | `0–256`；`0` 不保留空闲世界 |

比如上限为 3，一直只有一队挑战时，只会创建并复用一个世界；出现并发才按需增加。三个槽位都被占用时，第四队排队，等待期间不扣入场费用。复制、加载、运行、还原、空闲和等待回收的世界都占槽位；删除完成才释放名额。

每个世界独立经历：`创建 → 占用 → 还原中 → 空闲可复用 → 再次占用或超时销毁`。优先复用最近使用过的空闲世界，较久未使用的多余世界自然超时。超过 `max-idle` 的空闲世界会提前回收。玩家临时离线、等待重连或世界 Boss 活动暂时没人，不会启动这个闲置计时。

全服还有两项仅在主配置生效的限制：`world.max-total-instances`（默认 `0` 不限，统计已分配世界）和 `world.max-idle-worlds`（默认 `8`，最多保留多少个空闲常驻世界，`0` 不保留）。它们避免不同副本分别保留世界后总量过高。`dungeon.queue.max-concurrent` 仍然只限制创建阶段，不能替代运行世界上限。

::: warning reusable + link 的使用条件
作者可以选择 `link`，例如单实例、自行管理实体生成和删除的固定地图。但 `max-instances: 1` 不能提供写入隔离；当前 `link` 只共享 `region` 地形文件，地形存盘仍可能影响模板及其他链接副本。自行管理实体并不等于防止所有存档写入，关闭自动保存也不是写保护。需要任意方块变化或复杂模组状态时建议使用 `copy`。
:::

### 还原脚本

常驻模式需要 `dungeons/<副本ID>/scripts/on_reset.js`。所有难度共用根目录的这个文件；可以通过 `dungeon.getData("_difficulty")` 获取刚结束一局的难度。插件在玩家撤离、已加载非玩家实体和自身任务清理后执行它，`trigger` 为 `null`。

脚本必须同步完成作者负责的还原，最后 **`return true;`**。文件缺失、抛出异常、返回 `false`、字符串 `"true"` 或没有返回值，都会销毁世界，不把它交给下一队。脚本返回成功后，如果插件资源清理失败，也会销毁世界。状态命令的“脚本已确认”表示作者脚本确认完成，不代表插件自动比对了整张模板。

```javascript
// scripts/on_reset.js：按自己的地图实现后再启用 reusable
var targetWorld = event.get("world");       // 当前副本的 Bukkit World
var oldSession = event.get("instanceId");   // 刚结束的一局，下一局会使用新的会话 ID

// 在这里同步恢复方块、容器、模板原有实体，并处理外部 NPC/模组状态。
// 也要处理未加载区块中的实体，不能只清除玩家当前能看到的 NPC。
// 全部完成并检查后，将下面改为 return true;
return false;
```

这不是通用地图快照回滚：插件不自动恢复任意方块、容器、未加载实体、模组方块或外部定时任务；清理已加载实体也会移除模板原有实体，需要脚本恢复。不能在世界加载时覆盖底层存档文件。无法完整处理这些变化时，使用 `disposable`。

`on_reset.js` 不允许用 `tasks` 或 `utils.delay/schedule` 把还原延后。`utils.runCommand` 在还原脚本中同步执行，并仍受 `script.allow-console-command` 控制；命令必须明确限定目标世界，不能依赖已撤离玩家的位置。外部模组自己的延迟技能和任务仍需作者停止，不能保留旧会话对下一局的操作。

再次分配世界时仍会执行新一局的 `on_init`、`on_start` 等脚本。还原脚本应轻量，避免长时间阻塞主线程。常驻表示世界对象仍存在，不保证空闲世界零内存或完全停止模组 tick。

### 配置更新与重启

`/md admin reload`、编辑器保存或导入模板会使旧缓存失效：空闲世界回收，正在使用的世界结束后销毁，不再复用。不要直接覆盖正在使用的模板。服务器关闭后不保留常驻会话，重启清理残留，下次有人挑战时再按需创建。

## CustomNPCs 与实体残留

如果副本脚本通过命令克隆生成 CustomNPCs NPC，建议在该副本的 `dungeon.yml` 中设置，或在主配置中设为所有副本的默认值：

```yaml
world:
  copy-mode: "copy"
```

旧实现的 `link` 会共享实体存档，模组实体写盘可能改变模板，因此即使重新开本，上一局的 NPC 仍可能被带入新副本。已有服主反馈，改为 `copy` 后问题消失。当前实现已将实体和 POI 文件改为独立复制，但地形文件仍共享；`copy` 仍是完整隔离模板文件的选择，更新插件也不会自动修复旧模板。

保存配置后重启服务器，再新开一局验证。完整复制会增加磁盘占用和复制耗时，但能隔离副本与模板文件。

如果改为 `copy` 后仍有旧 NPC，请先备份并检查 `plugins/MayDungeon/maps/<地图名>/`：恢复干净模板，或通过编辑器删除误写的 NPC 后保存。修改复制方式不会自动清除模板中已有的实体。启用世界池时，也需要在模板修复后重新生成预缓存；不要在服务器运行时直接删除实例目录。

## 世界池

这是旧的文件预复制池，仅对 `disposable` 且 `max-instances: 0` 的副本生效；它不是常驻复用池。`reusable` 及有限槽位模式跳过此预热，始终按需求创建，不会因为 `cache-size` 补满多个世界。

```yaml
world:
  pool:
    enabled: true
    dungeons:
      test_dungeon:
        cache-size: 2
    refill-interval: 30
```

缓存会占用额外资源，建议从 `cache-size: 1` 开始。低频地图无需启用。

### 查看世界状态

执行 `/md admin worlds [副本ID|all] [页码]`，每页显示 6 个已分配世界，包括复制/加载中、使用中、还原中、空闲和等待回收的世界。需要 `maydungeon.command.admin.worlds` 权限（已包含在管理员权限中）。旧文件池尚未分配的预复制目录不在此列表中。

每个世界显示名称、生命周期模式、复制策略、使用次数、玩家数、加载区块数、会话状态、还原结果，以及闲置回收剩余秒数；使用中显示“未计时”。“不再复用”表示缓存失效或已经决定回收。复制策略 `link` 在文件系统不支持时会回退为复制，不保证所有地形文件都是硬链接。

## 日常检查

- `/md admin instances`：查看当前运行实例。
- `/md admin worlds`：查看包括空闲常驻世界在内的状态；`/md admin worlds test_dungeon 1` 只看指定副本。
- `/md admin tp <实例ID>`：进入实例检查。
- `/md admin forceend <实例ID>`：结束异常实例。
- 控制台持续报告世界无法卸载时，先移出其中玩家并正常重启服务器。

不要在服务器运行时直接删除实例目录。异常关服后的处理见 [关服与异常恢复](./recovery.md)，加载耗时和内存问题见 [性能调优](./performance.md)。
