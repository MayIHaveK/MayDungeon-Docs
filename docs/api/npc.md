# npc 对象

`npc` 对象用于在副本中创建和管理 NPC，基于 Adyeshach 插件。

## 方法列表

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `npc.create(id, name, x, y, z)` | NPC | 创建 NPC |
| `npc.get(id)` | NPC | 获取 NPC |
| `npc.remove(id)` | void | 移除 NPC |
| `npc.removeAll()` | void | 移除所有 NPC |
| `npc.all()` | NPC[] | 获取所有 NPC |

## NPC 对象方法

| 方法 | 说明 |
|------|------|
| `npc.setName(name)` | 设置显示名称 |
| `npc.setSkin(textures)` | 设置皮肤 |
| `npc.setLocation(x, y, z)` | 设置位置 |
| `npc.setLookAtPlayer(enabled)` | 是否注视玩家 |
| `npc.setPath(pathId)` | 设置巡逻路径 |
| `npc.playAnimation(anim)` | 播放动画 |
| `npc.say(message)` | NPC 说话（聊天气泡） |
| `npc.setInteractAction(callback)` | 设置交互回调 |
| `npc.setVisible(visible)` | 设置可见性 |
| `npc.moveTo(x, y, z)` | 移动到指定位置 |

## 使用示例

```javascript
function on_init() {
    // 创建引导 NPC
    var guide = npc.create("guide", "&e向导·艾琳", 100, 65, 100);
    guide.setSkin("eyJ0ZXh0dXJlcyI6...");
    guide.setLookAtPlayer(true);
    
    guide.setInteractAction(function(player) {
        guide.say("&f欢迎来到深渊副本！");
        player.message("&7[向导] &f前方有危险，做好准备！");
    });
}

function on_monster_kill(player, monster) {
    if (monsters.remaining() === 0) {
        var guide = npc.get("guide");
        guide.say("&a太棒了！通道已经打开！");
        guide.moveTo(110, 65, 100);
    }
}
```

## 对话系统

使用 NPC 实现简单对话：

```javascript
function on_init() {
    var merchant = npc.create("merchant", "&6商人", 95, 65, 100);
    
    merchant.setInteractAction(function(player) {
        if (player.hasItem("DIAMOND")) {
            player.removeItem("DIAMOND", 1);
            player.give("DIAMOND_SWORD", 1);
            merchant.say("&f好货！这把剑归你了。");
        } else {
            merchant.say("&f带颗钻石来，给你好东西。");
        }
    });
}
```

## 前置依赖

NPC 功能需要服务器安装 Adyeshach 插件。NPC 在副本结束时会自动清理。

## 注意事项

- NPC 仅对副本内玩家可见
- 路径需要通过编辑器预先录制
- 支持 `&` 颜色代码
