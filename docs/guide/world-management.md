# 世界管理

MayDungeon 通过复制模板世界来创建副本实例，本节介绍世界管理相关内容。

## 工作原理

1. 服务器启动时加载模板世界
2. 玩家进入副本时，复制模板世界为实例世界
3. 副本结束后，卸载并删除实例世界

```
模板世界                    实例世界
dungeon_abyss/    →复制→    md_instance_abyss_001/
  region/                     region/
  level.dat                   level.dat
```

## 模板世界准备

### 方式一：在服务器中直接构建

1. 使用 Multiverse 创建空世界
2. 在世界中构建副本地图
3. 在 `dungeon.yml` 中引用世界名

### 方式二：导入外部地图

将世界文件夹放入服务器根目录，确保包含 `region/` 目录和 `level.dat` 文件。

## 世界配置

```yaml
# config.yml
world:
  # 实例世界命名前缀
  prefix: "md_instance_"
  # 世界复制方式: file_copy / slime
  copy-method: "file_copy"
  # 复制完成后是否立即加载
  auto-load: true
  # 卸载延迟（tick），用于玩家传出
  unload-delay: 60
  # 最大并存实例世界数
  max-worlds: 20
```

## 脚本中的世界操作

```javascript
function on_init() {
    // 设置世界规则
    world.setGameRule("doDaylightCycle", false);
    world.setGameRule("doMobSpawning", false);
    world.setTime(6000);
    world.setWeather("clear");
    
    // 放置/修改方块
    world.setBlock(100, 64, 100, "STONE");
    world.fill(90, 60, 90, 110, 64, 110, "OBSIDIAN");
}
```

## 世界回收

副本结束后世界会自动回收。回收流程：

1. 传送所有玩家至退出点
2. 卸载世界（等待区块保存）
3. 删除世界文件夹

如果回收失败（如文件被占用），插件会在下次启动时重试清理。

## 常见问题

- **世界加载慢**：减小模板世界体积，只保留必要区块
- **文件占用**：确保无其他插件持有世界引用
- **磁盘空间不足**：控制 `max-worlds` 参数，启用自动清理
