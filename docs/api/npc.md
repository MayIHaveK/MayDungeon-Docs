# npc - NPC 系统

`npc` 对象用于在副本中创建和管理 NPC，需要服务器安装 **Adyeshach** 插件。

## 通用约定

- 位置参数格式: `"x,y,z"` | 颜色代码: `&` 前缀 | 时间: tick（20tick=1秒）| 材质: 大写英文

## 方法列表

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `create(id, loc, type, name)` | void | 创建 NPC |
| `remove(id)` | void | 移除指定 NPC |
| `removeAll()` | void | 移除副本内所有 NPC |
| `isAvailable()` | boolean | 检查 Adyeshach 是否可用 |

## NPC 交互

玩家右键 NPC 时会触发 `on_entity_interact.js` 事件脚本。可通过 `dungeon.getData("_interact_npc_id")` 获取被交互的 NPC ID。

## 使用示例

### 创建引导 NPC

```javascript
function on_init() {
    if (npc.isAvailable()) {
        npc.create("guide", "100,65,100", "PLAYER", "&6&l引导员");
        npc.create("merchant", "105,65,100", "VILLAGER", "&a商人");
    }
}
```

### 处理 NPC 交互（on_entity_interact.js）

```javascript
var npcId = dungeon.getData("_interact_npc_id");
var player = trigger.getPlayerName();

if (npcId == "guide") {
    players.sendMessage("&6[引导员] &f欢迎来到副本！消灭所有怪物即可通关。");
} else if (npcId == "merchant") {
    utils.runCommand("openmerchant " + player);
}
```

### 阶段性 NPC 出现

```javascript
function on_group_clear() {
    var group = dungeon.getData("_group_name");
    if (group == "wave1") {
        npc.create("reward_npc", "100,65,100", "PLAYER", "&e&l奖励使者");
        dungeon.broadcast("&a奖励使者出现了！右键领取奖励！");
    }
}
```

## 注意事项

- 使用前建议用 `isAvailable()` 检查 Adyeshach 是否存在
- `type` 参数为实体类型，常用值：`"PLAYER"`、`"VILLAGER"`、`"ZOMBIE"` 等
- NPC 的 `id` 在副本内唯一，用于后续操作和交互识别
- 副本结束时 NPC 会自动清理
- NPC 右键交互通过 `on_entity_interact.js` 处理，不是 `on_interact.js`
