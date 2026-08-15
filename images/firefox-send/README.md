# Firefox Send historical deployment

> **Lifecycle:** `Archived`
> **Image:** `enwaiax/firefox_send:plus` (historical)
> **Architectures:** `amd64` (historical)
> **Last verified:** `2026-08-15`

> [!WARNING]
> Mozilla Send 上游已归档，本仓库不构建或发布该镜像。以下内容只用于识别旧实例、导出必要数据和迁移，不建议新部署。

## Overview

- **Archived upstream:** https://github.com/mozilla/send
- **Source directory:** https://github.com/enwaiax/awesome-docker/tree/main/images/firefox-send
- **Recommended for new deployments:** `No`

旧 Compose 运行 Send 与 Redis。由于应用和依赖均不再维护，公开文件上传服务会面临较高滥用与漏洞风险。

## Prerequisites

只在隔离环境中维护历史实例。需要现有 Compose、Redis 数据、应用配置、反向代理配置和上传数据保留策略。

## Quick start

不提供新部署快速开始。为方便现有用户识别，历史启动方式为：

```bash
cd images/firefox-send
docker compose config
docker compose up -d
```

运行前必须审查镜像来源、网络暴露和数据需求。

## Configuration

### Environment variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `REDIS_HOST` | Yes | `redis` | Send 使用的 Redis 服务名 |

其他应用设置以归档上游源码为准，本仓库不维护配置兼容性。

### Ports

| Port | Protocol | Required | Description |
| --- | --- | --- | --- |
| `1443` | TCP | Historical | Send Web 服务；不应未经认证和 TLS 直接暴露公网 |

### Volumes

旧 Compose 没有定义 Redis 持久化或上传数据 Volume，因此容器重建可能丢失状态。这也是不建议继续部署的原因之一。

### Network and privileges

不需要 privileged 或 host network。历史 `links` 配置已被 Compose 网络取代，但这不代表应用本身重新获得安全支持。

## First-run verification

```bash
docker compose ps
docker compose logs --tail=200 web redis
```

仅在隔离网络进行验证，不上传敏感文件。

## Operations

### Logs and status

```bash
docker compose logs -f --tail=200 web redis
```

### Upgrade

没有受支持的升级路径。不要把更换浮动 Redis 或社区 Fork 当作本项目官方升级。

### Backup and restore

先检查实际容器 Mount：

```bash
docker inspect firefox-send-web-1 --format '{{json .Mounts}}'
docker inspect firefox-send-redis-1 --format '{{json .Mounts}}'
```

旧 Compose 默认没有持久化声明；可迁移的数据取决于实例曾经做过的自定义配置。

### Stop and uninstall

```bash
docker compose down
```

如果存在自定义 Volume，先导出并验证备份，再决定是否删除。

## Security

- 不向公网开放未经维护的上传服务。
- 历史镜像和 Redis 依赖可能包含未修复漏洞。
- 不上传隐私、凭据或业务文件进行测试。
- 停用实例后清理 DNS、反向代理、对象存储和残留数据。

## Troubleshooting

### Web 服务无法连接 Redis

```bash
docker compose logs --tail=200 web redis
docker compose exec web getent hosts redis
```

### 重建后数据消失

旧 Compose 没有 Redis 持久化 Volume。检查是否存在自定义 Mount；若没有，容器层数据通常无法可靠恢复。

## Lifecycle and known limitations

- 生命周期为 Archived，上游与本仓库镜像均不再维护。
- 没有新部署、升级、安全修复或数据恢复保证。
- 迁移时优先选择仍受维护、具备清晰加密和保留策略的文件分享方案。
