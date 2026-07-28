# 世界管理

MayDungeon 从 `plugins/MayDungeon/maps/<地图名>/` 读取模板，每次开本创建独立的临时世界。副本结束后临时世界会自动卸载和清理，模板地图不会被当作运行中的副本直接使用。

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
| `max-concurrent-copies` | 同时创建世界的数量，卡顿时降低 |
| `create-interval` | 两次创建请求的最小间隔，单位毫秒 |
| `preload-chunk-radius` | 进入前预加载出生点周围多少圈区块 |
| `preload-chunks-per-tick` | 每 tick 的预加载预算；越高完成越快，瞬时压力也越大 |
| `instance-view-distance` | 副本视距；`0` 跟随服务端默认值 |
| `copy-mode` | `link` 更快且省空间；不支持时自动回退，`copy` 始终完整复制 |
| `void-outside-template` | `true` 时模板已有区块之外为虚空 |

修改这些选项后建议重启服务器。若地图需要在模板边界外生成原版地形，必须关闭 `void-outside-template`。

## 世界池

热门副本可以提前缓存实例：

```yaml
world:
  pool:
    enabled: true
    dungeons:
      test_dungeon:
        cache-size: 2
        instance-keep: false
    refill-interval: 30
```

缓存会占用额外资源，建议从 `cache-size: 1` 开始。低频地图无需启用。

## 日常检查

- `/md admin instances`：查看当前运行实例。
- `/md admin tp <实例ID>`：进入实例检查。
- `/md admin forceend <实例ID>`：结束异常实例。
- 控制台持续报告世界无法卸载时，先移出其中玩家并正常重启服务器。

不要在服务器运行时直接删除实例目录。异常关服后的处理见 [关服与异常恢复](./recovery.md)，加载耗时和内存问题见 [性能调优](./performance.md)。
