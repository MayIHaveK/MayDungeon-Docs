# 可视化编辑器

MayDungeon 提供游戏内可视化编辑器，方便构建和调试副本。

## 进入编辑模式

```
/md editor <副本ID>
```

进入编辑模式后，你将被传送到模板世界并获得编辑工具。

## 编辑工具

| 工具 | 物品 | 功能 |
|------|------|------|
| 区域选取棒 | 金锄 | 左右键选择区域两点 |
| 出生点设置 | 指南针 | 右键设置出生点位置 |
| 怪物刷新点 | 骨头 | 右键标记怪物刷新位置 |
| 触发器设置 | 红石火把 | 右键方块设置交互触发器 |
| NPC 放置 | 村民刷怪蛋 | 右键放置 NPC 位置 |

## 区域编辑

选中两个点后，可执行以下操作：

```
/md editor area create <名称>     创建区域
/md editor area list              列出所有区域
/md editor area delete <名称>     删除区域
/md editor area show              可视化显示区域边界
```

## 刷怪点编辑

```
/md editor spawn add <组名>        添加刷怪点到指定组
/md editor spawn list              列出所有刷怪点
/md editor spawn remove <ID>       移除刷怪点
/md editor spawn test <组名>       测试生成怪物
```

## 路径编辑

为 NPC 或怪物设置巡逻路径：

```
/md editor path start <名称>       开始录制路径
/md editor path point              记录当前位置为路径点
/md editor path end                结束录制
/md editor path show <名称>        显示路径粒子
```

## 调试模式

编辑模式下可快速测试副本：

```
/md editor test              以当前位置开始测试运行
/md editor test reset        重置并重新测试
/md editor reload            热重载脚本
```

## 保存与退出

```
/md editor save              保存所有编辑内容
/md editor exit              退出编辑模式
```

编辑器所做的修改会保存到副本配置中，脚本中可通过名称引用编辑器创建的区域和刷怪点。
