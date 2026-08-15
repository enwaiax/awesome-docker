# Download Bot

> **Lifecycle:** `Community`
> **Image:** `enwaiax/download-bot:latest`
> **Architectures:** `amd64`, `arm64`
> **Last verified:** `2026-08-15`

Download Bot 通过 Telegram 管理 aria2 下载任务。本镜像可以继续使用，但上游最近一次代码更新较早，部署者需要自行维护 Bot Token、aria2 RPC Secret 和数据备份。

## Overview

- **Upstream:** https://github.com/gaowanliang/DownloadBot
- **Docker Hub:** https://hub.docker.com/r/enwaiax/download-bot
- **Source directory:** https://github.com/enwaiax/awesome-docker/tree/main/images/download-bot
- **Recommended for new deployments:** `Yes, with community support expectations`

容器本身不提供 aria2。Docker CLI 示例假设已有可访问的 aria2；Compose 示例同时启动 aria2 和 Download Bot。

## Prerequisites

- Docker Engine 24+；Compose 部署需要 `docker compose` 插件。
- 从 Telegram 的 BotFather 创建 Bot 并取得 Token。
- 获取自己的 Telegram numeric user ID，并仅授权可信管理员。
- 生成高强度 aria2 RPC Secret，例如：

```bash
openssl rand -hex 24
```

## Quick start

### Docker CLI

先复制示例配置：

```bash
mkdir download-bot && cd download-bot
curl -fsSLo config.json https://raw.githubusercontent.com/enwaiax/awesome-docker/main/images/download-bot/config.json
chmod 600 config.json
```

编辑 `config.json`，至少替换 `aria2-server`、`aria2-key`、`bot-key` 和 `user-id`。然后连接已有 aria2：

```bash
docker run -d \
  --name download-bot \
  --restart unless-stopped \
  -v "$PWD/config.json:/root/config.json:ro" \
  -v "$PWD/downloads:/downloads" \
  enwaiax/download-bot:latest
```

如果 aria2 在另一个容器中，应让两个容器加入同一个自定义网络，并在配置中使用 aria2 服务名，不要依赖宿主机回环地址。

### Docker Compose

```bash
mkdir download-bot && cd download-bot
curl -fsSLo compose.yaml https://raw.githubusercontent.com/enwaiax/awesome-docker/main/images/download-bot/docker-compose.yml
curl -fsSLo config.json https://raw.githubusercontent.com/enwaiax/awesome-docker/main/images/download-bot/config.json
cat > .env <<EOF
ARIA2_RPC_SECRET=$(openssl rand -hex 24)
TZ=Asia/Shanghai
EOF
chmod 600 .env config.json
```

将 `.env` 中的 `ARIA2_RPC_SECRET` 同步填入 `config.json` 的 `aria2-key`，并将 aria2 地址设为：

```json
"aria2-server": "ws://aria2:6800/jsonrpc"
```

再填入 Telegram 凭据并启动：

```bash
docker compose config
docker compose up -d
```

## Configuration

### Environment variables

Download Bot 自身读取 `/root/config.json`；Compose 中的环境变量主要配置 aria2。

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `ARIA2_RPC_SECRET` | Yes | — | aria2 RPC Secret，必须与 `config.json` 的 `aria2-key` 一致 |
| `PUID` / `PGID` | No | `65534` | aria2 写入下载目录时使用的 UID/GID |
| `TZ` | No | `Asia/Shanghai` | aria2 容器时区 |

`config.json` 关键字段：

| Field | Required | Description |
| --- | --- | --- |
| `aria2-server` | Yes | aria2 WebSocket RPC URL |
| `aria2-key` | Yes | aria2 RPC Secret |
| `bot-key` | Yes | Telegram Bot Token |
| `user-id` | Yes | 允许管理 Bot 的 Telegram user ID，可按上游格式配置多个用户 |
| `downloadFolder` | Yes | Bot 与 aria2 共同看到的下载路径，应为 `/downloads` |

### Ports

| Port | Protocol | Required | Description |
| --- | --- | --- | --- |
| `6800` | TCP | Compose only | aria2 RPC；不要暴露到公网，优先仅在 Docker 网络内使用 |
| `6888` | TCP/UDP | Optional | aria2 BitTorrent 监听端口 |

Download Bot 本身不监听入站 Web 端口。

### Volumes

| Host / volume | Container | Contains | Backup required |
| --- | --- | --- | --- |
| `./config.json` | `/root/config.json` | Telegram Token、管理员和 RPC 配置 | Yes, encrypted |
| `./downloads` | `/downloads` | 下载内容 | As needed |
| `./aria2-config` | `/config` | aria2 状态与配置 | Recommended |

### Network and privileges

不需要 privileged 或 host network。Compose 使用默认隔离网络；若无需从宿主机访问 RPC，可删除 `6800:6800` 映射以缩小攻击面。

## First-run verification

```bash
docker compose ps
docker compose logs --tail=100 aria2
docker compose logs --tail=100 download-bot
```

在 Telegram 中向 Bot 发送 `/start` 或上游支持的帮助命令。确认未授权用户不能管理任务，并创建一个小型测试下载验证 `/downloads` 映射一致。

## Operations

### Logs and status

```bash
docker compose ps
docker compose logs -f --tail=200 download-bot
docker compose logs -f --tail=200 aria2
```

### Upgrade

1. 备份 `config.json`、`.env` 和 `aria2-config`。
2. 检查上游/镜像变更；当前仅提供 `latest`，更新前应记录现有 digest：

```bash
docker image inspect enwaiax/download-bot:latest --format '{{index .RepoDigests 0}}'
```

3. 执行 `docker compose pull && docker compose up -d`。
4. 验证 Bot 授权、RPC 连接和测试下载。若失败，使用记录的 digest 回滚。

### Backup and restore

停止服务后备份配置：

```bash
docker compose down
tar -czf download-bot-backup.tgz config.json .env aria2-config
```

恢复时解压到同一目录，检查权限后运行 `docker compose config` 和 `docker compose up -d`。下载数据是否备份由业务需求决定。

### Stop and uninstall

```bash
docker compose down
```

该命令保留 bind-mounted 配置和下载文件。确认不再需要且已有备份后，再手动删除目录；不要把删除配置和普通卸载混为一谈。

## Security

- `bot-key`、`aria2-key` 和 `.env` 都是 Secret，权限设为 `600`，禁止提交 Git。
- 不使用示例值作为 RPC Secret；每次泄露后同时轮换 `.env` 和 `config.json`。
- 尽量不将 6800 暴露到公网；必须远程访问时使用防火墙、VPN 或反向代理认证。
- `user-id` 只允许可信管理员；Bot Token 泄露后立即在 BotFather 撤销。
- 下载内容是不可信输入，避免自动执行或由高权限用户打开。

## Troubleshooting

### Bot 无法连接 aria2

```bash
docker compose exec download-bot sh -c 'cat /root/config.json'
docker compose logs --tail=200 aria2 download-bot
```

检查服务地址是否为 `ws://aria2:6800/jsonrpc`、Secret 是否一致，以及两个服务是否在同一个 Compose 网络。

### Bot 没有响应

检查 Bot Token、Telegram 网络连通性和 `user-id`。不要将完整配置粘贴到公开 Issue；先对 Token 和 user ID 脱敏。

### 下载文件不可写

检查 `PUID`、`PGID` 和宿主机 `downloads` 权限。使用最小必要权限，不要通过递归开放所有用户写权限来绕过问题。

## Lifecycle and known limitations

- 生命周期为 Community，上游最近更新较早，没有承诺的响应时间。
- 当前 Docker Hub 仅使用浮动 `latest`；发布固定版本前，升级应保留旧 digest 以便回滚。
- 本 Guide 验证 AMD64 构建、Compose 配置和目录映射，不保证第三方 aria2 镜像或 Telegram 服务长期兼容。
