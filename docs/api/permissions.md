# 权限节点

MayDungeon 支持按 `/md` 子命令精确授权。未拥有对应权限时，命令无法执行，也不会出现在帮助和 Tab 补全中。

## 权限组

| 权限节点 | 默认值 | 说明 |
|----------|--------|------|
| `maydungeon.player` | `true` | 授予全部普通玩家命令和队伍命令 |
| `maydungeon.admin` | `op` | 授予全部管理、编辑器和脚本命令 |
| `maydungeon.stamina.bypass` | `op` | 绕过体力消耗与检查（需 `stamina.admin-bypass: true`） |
| `maydungeon.start` | `false` | 旧版 `/md start` 权限兼容节点，新配置请使用 `maydungeon.command.start` |

若要精确授权，先撤销权限组，再单独授予需要的命令节点。

## 普通命令

| 权限节点 | 对应命令 |
|----------|----------|
| `maydungeon.command.start` | `/md start <副本>` |
| `maydungeon.command.leave` | `/md leave` |
| `maydungeon.command.revive` | `/md revive` |
| `maydungeon.command.list` | `/md list` |
| `maydungeon.command.info` | `/md info <副本>` |
| `maydungeon.command.status` | `/md status` |
| `maydungeon.command.stamina` | `/md stamina` |
| `maydungeon.command.gui` | `/md gui [菜单ID]` |
| `maydungeon.command.help` | `/md help` |

## 队伍命令

`maydungeon.command.team` 会授予全部队伍命令。也可以只授予以下叶子节点：

| 权限节点 | 对应命令 |
|----------|----------|
| `maydungeon.command.team.create` | `/md team create` |
| `maydungeon.command.team.invite` | `/md team invite` |
| `maydungeon.command.team.accept` | `/md team accept` |
| `maydungeon.command.team.deny` | `/md team deny` |
| `maydungeon.command.team.request` | `/md team request` |
| `maydungeon.command.team.join` | `/md team join` |
| `maydungeon.command.team.approve` | `/md team approve` |
| `maydungeon.command.team.reject` | `/md team reject` |
| `maydungeon.command.team.leave` | `/md team leave` |
| `maydungeon.command.team.kick` | `/md team kick` |
| `maydungeon.command.team.transfer` | `/md team transfer` |
| `maydungeon.command.team.disband` | `/md team disband` |
| `maydungeon.command.team.list` | `/md team list` |
| `maydungeon.command.team.chat` | `/md team chat` |
| `maydungeon.command.team.gui` | `/md team gui` |

## 管理与编辑命令

- `maydungeon.command.admin`：全部 `/md admin` 命令
- `maydungeon.command.admin.<子命令>`：单独授权 `reload`、`import`、`forceend`、`instances`、`tp`、`kick`、`stamina`、`dailylimit`、`worldboss` 或 `revivecoin`
- `maydungeon.command.editor`：全部 `/md editor` 命令
- `maydungeon.command.editor.<子命令>`：单独授权 `edit`、`save`、`exit`、`tools`、`setspawn`、`addarea`、`addobstacle`、`addwave`、`remove` 或 `list`
- `maydungeon.command.script`：允许使用 `/md script`

`/md editor cancel` 与 `/md editor exit` 共用 `maydungeon.command.editor.exit`。

## 仅允许退出副本

以下 LuckPerms 配置会关闭默认玩家权限组，并只允许玩家使用 `/md leave`：

```text
/lp group default permission set maydungeon.player false
/lp group default permission set maydungeon.command.leave true
```

`/md leave` 和 `/md team leave` 是两个不同命令。若还需要允许玩家退出队伍，额外授予：

```text
/lp group default permission set maydungeon.command.team.leave true
```

副本自身的进入权限仍通过 `dungeon.yml` 中的 `conditions.permission` 配置，详见 [进入条件系统](/guide/conditions)。
