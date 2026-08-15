# X-UI

> **Lifecycle:** `Moved`
> **Image:** `enwaiax/x-ui:latest`
> **Architectures:** `amd64`, `arm64`, `arm/v7`, `arm/v6`, `s390x` (historical manifest)
> **Last verified:** `2026-08-15`

> [!WARNING]
> 本目录为历史部署入口。镜像维护已迁往独立仓库，当前 Dockerfile 还会克隆浮动上游，因此被排除在本仓库发布流水线之外。新部署请先查看 https://github.com/enwaiax/x-ui 。

## Overview

- **Upstream:** https://github.com/vaxilu/x-ui
- **Maintained image repository:** https://github.com/enwaiax/x-ui
- **Docker Hub:** https://hub.docker.com/r/enwaiax/x-ui
- **Source directory:** https://github.com/enwaiax/awesome-docker/tree/main/images/x-ui
- **Recommended for new deployments:** `No`

本文只帮助现有用户识别配置、备份和迁移。不要把这里的 `latest` 当作本仓库可复现发布物。

## Prerequisites

维护历史实例需要 Docker、当前数据库目录、证书目录、开放端口清单以及现有管理员凭据。该配置使用 host network，容器会直接共享宿主机网络命名空间。

## Quick start

不提供新的推荐部署。历史命令如下，仅用于恢复已知版本：

```bash
mkdir x-ui && cd x-ui
docker run -d \
  --name x-ui \
  --restart unless-stopped \
  --network host \
  -v "$PWD/db:/etc/x-ui" \
  -v "$PWD/cert:/root/cert:ro" \
  enwaiax/x-ui:latest
```

历史 Compose：

```bash
curl -fsSLo compose.yaml https://raw.githubusercontent.com/enwaiax/awesome-docker/main/images/x-ui/docker-compose.yml
docker compose config
docker compose up -d
```

新部署应改用独立仓库经过验证的版本化文档。

## Configuration

### Environment variables

历史镜像没有由本仓库维护的环境变量契约，主要配置位于数据库和证书挂载中。

### Ports

由于 `network_mode: host`，Compose 不声明端口。历史面板默认常见端口为 `54321/TCP`，实际监听端口必须从当前实例配置和 `ss -lntp` 核实。

### Volumes

| Host / volume | Container | Contains | Backup required |
| --- | --- | --- | --- |
| `./db` | `/etc/x-ui` | 面板数据库与核心配置 | Yes |
| `./cert` | `/root/cert` | TLS 证书与私钥 | Yes, encrypted |

### Network and privileges

使用 host network 会绕过 Docker 端口隔离。必须通过宿主机防火墙限制管理面板和代理端口，不要直接向公网开放管理入口。

## First-run verification

```bash
docker ps --filter name=x-ui
docker logs --tail=200 x-ui
ss -lntp
```

首次登录后立即更改默认管理员凭据、面板端口和 URL path；实际操作以独立维护仓库当前版本文档为准。

## Operations

### Logs and status

```bash
docker logs -f --tail=200 x-ui
docker inspect x-ui --format '{{.Config.Image}} {{.State.Status}}'
```

### Upgrade

本仓库不提供升级保证。迁移前：

1. 记录当前镜像 digest 和应用版本。
2. 停止容器并完整备份 `db`、`cert`。
3. 阅读独立仓库的迁移说明。
4. 在隔离主机或复制数据上验证新版本。

### Backup and restore

```bash
docker stop x-ui
tar -czf x-ui-backup.tgz db cert
docker start x-ui
```

恢复时先解压到新目录并用临时容器验证。**不要通过删除数据库来重置密码**；这会丢失全部面板和节点配置。密码恢复应使用当前版本官方命令或在备份副本上操作。

### Stop and uninstall

```bash
docker rm -f x-ui
```

以上不会删除 `db` 和 `cert`。确认备份可恢复后才可手动删除数据目录。

## Security

- 立即替换默认账号密码；不要在公网使用默认管理入口。
- host network 扩大暴露面，使用防火墙、访问控制、TLS 和非默认路径。
- 私钥目录只读挂载并限制宿主机权限。
- 当前目录不具备可复现发布保证；不要基于浮动构建结果建立供应链信任。
- 不在 Issue 中粘贴数据库、节点配置、UUID、证书或订阅信息。

## Troubleshooting

### 面板无法访问

```bash
docker logs --tail=200 x-ui
ss -lntp | grep -E 'x-ui|54321'
```

核对实际端口、宿主机防火墙、云安全组和面板 URL path。

### 忘记密码

不要删除 `db`。先备份，再查阅独立仓库当前版本的重置命令；若版本过老无法恢复，应在副本上迁移数据库或重建配置。

## Lifecycle and known limitations

- 生命周期为 Moved，本仓库不再发布该镜像。
- 历史多架构信息来自现有 Docker Hub manifest，不代表当前源代码仍在全部架构上验证。
- 当前 Dockerfile 克隆移动中的上游分支，因此只有静态/历史构建检查，没有发布资格。
- 后续维护和新部署转移至 https://github.com/enwaiax/x-ui 。

[English historical guide](docs/README_en.md)
