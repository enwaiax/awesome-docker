# <Image name>

> **Lifecycle:** `Maintained | Community | Archived | Moved`
> **Image:** `<namespace>/<image>:<version>`
> **Architectures:** `<amd64, arm64, ...>`
> **Last verified:** `YYYY-MM-DD`

一句话说明镜像用途。Maintained/Community 指南面向部署；Archived/Moved 指南面向现有用户维护和迁移，不应鼓励新部署。

## Overview

- **Upstream:** <URL>
- **Docker Hub:** <URL>
- **Source directory:** <URL>
- **Recommended for new deployments:** `Yes | No`

说明适用场景、不适用场景、上游与本仓库的关系。

## Prerequisites

列出 Docker / Docker Compose、端口、域名、证书、CPU 架构、磁盘和第三方账号等要求。

## Quick start

### Docker CLI

```bash
# 使用明确版本，不要在可维护 Guide 中默认使用 latest
docker run ... <image>:<version>
```

### Docker Compose

```bash
mkdir <project> && cd <project>
curl -fsSLo compose.yaml <raw-compose-url>
# 创建 .env 或其他必需配置
docker compose config
docker compose up -d
```

如果没有 Compose，明确写出原因。Archived/Moved 项目可将历史命令放在“Historical deployment”章节。

## Configuration

### Environment variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `EXAMPLE` | Yes | — | Example |

### Ports

| Port | Protocol | Required | Description |
| --- | --- | --- | --- |
| `8080` | TCP | Yes | Web UI |

### Volumes

| Host / volume | Container | Contains | Backup required |
| --- | --- | --- | --- |
| `./data` | `/data` | Application data | Yes |

### Network and privileges

说明 host networking、privileged、capabilities、设备映射和防火墙要求。没有特殊要求也要明确写出。

## First-run verification

```bash
docker compose ps
docker compose logs --tail=100
```

列出项目特定的版本、健康或登录验证命令，以及首次启动后必须修改的默认凭据。

## Operations

### Logs and status

### Upgrade

说明备份、拉取固定版本、重建和验证。Archived 项目应写明不提供升级保证。

### Backup and restore

明确哪些路径需要备份，并给出恢复步骤。不要直接建议删除数据目录。

### Stop and uninstall

区分“删除容器”和“删除持久化数据”，破坏性命令必须明确警告。

## Security

- 默认凭据和首次修改动作
- Secret 的保存方式
- TLS、端口和防火墙
- 上游维护与已知风险
- 禁止 `chmod -R 777`、硬编码 Token/密码、无提示删除数据

## Troubleshooting

至少列出两个常见故障的诊断命令与解决方向。

## Lifecycle and known limitations

说明当前生命周期、最后验证范围、发布限制及替代方案。构建成功不等于仍受支持或适合新部署。
