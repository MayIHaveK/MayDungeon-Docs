# 预设系统

预设（Presets）允许你为副本定义可复用的模板配置，减少重复工作。

## 什么是预设

预设是一组预定义的副本参数和脚本片段，可被多个副本继承使用。例如你可以创建一个"标准4人本"预设，所有类似副本直接继承即可。

## 预设目录

```
plugins/MayDungeon/presets/
├── standard_4p.yml
├── solo_challenge.yml
└── pvp_arena.yml
```

## 预设配置

```yaml
# presets/standard_4p.yml
name: "标准四人副本"
settings:
  min-players: 4
  max-players: 4
  timeout: 900
  keep-inventory: false
  allow-rejoin: true
scripts:
  - "presets/common_functions.js"
```

## 在副本中使用预设

在副本的 `dungeon.yml` 中引用预设：

```yaml
name: "暗影城堡"
preset: "standard_4p"
template-world: "dungeon_shadow_castle"
# 可覆盖预设中的值
timeout: 1200
spawn:
  x: 0.5
  y: 70.0
  z: 0.5
```

## 预设脚本

预设可附带公共脚本，会在副本脚本之前加载：

```javascript
// presets/common_functions.js
function broadcastProgress(current, total) {
    players.actionbar("&e进度: " + current + "/" + total);
}

function spawnReward(x, y, z) {
    world.dropItem(x, y, z, "DIAMOND", 1);
}
```

副本脚本中可直接调用预设脚本中的函数。

## 内置预设

| 预设名 | 说明 |
|--------|------|
| `default` | 默认配置，1-4人，10分钟超时 |
| `solo` | 单人挑战，无重连 |
| `raid` | 多人团本，8人，长超时 |
| `speedrun` | 竞速模式，计时排行 |

## 优先级

副本配置 > 预设配置 > 全局默认配置。副本中显式设置的值会覆盖预设。
