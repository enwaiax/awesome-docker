# Maddy Mail Server

> **Lifecycle:** `Maintained`
> **Image:** `enwaiax/maddy:0.9.5`
> **Architectures:** `amd64`, `arm64`
> **Last verified:** `2026-08-15`

Maddy 是一个可组合的一体化邮件服务器。本镜像固定到上游 Maddy v0.9.5，适合愿意自行维护 DNS、TLS、投递信誉和备份的自托管用户。

## Overview

- **Upstream:** https://github.com/foxcpp/maddy
- **Docker Hub:** https://hub.docker.com/r/enwaiax/maddy
- **Source directory:** https://github.com/enwaiax/awesome-docker/tree/main/images/maddy
- **Recommended for new deployments:** `Yes`

Maddy 用一个 Go 守护进程提供 SMTP、Submission、IMAP、DKIM、SPF、DMARC、DANE 和 MTA-STS 等能力。它降低了组件数量，但不会替代邮件系统运维：公网 25 端口、正确 DNS、反向解析、TLS 和投递信誉仍由部署者负责。

## Prerequisites

- Docker Engine 24+；使用 Compose 时需要 `docker compose` 插件。
- 公网服务器、固定 IP，以及可配置 A/AAAA、MX、PTR、SPF、DKIM、DMARC 的域名。
- 云厂商允许入站和出站 TCP 25；Submission 使用 465/587，IMAP 使用 143/993。
- TLS 证书链和私钥，分别放入 `/data/tls/fullchain.pem` 与 `/data/tls/privkey.pem`。
- 至少为 `/data` 建立持久化和离机备份。

检查出站 25 端口时，可运行：

```bash
timeout 5 bash -c '</dev/tcp/smtp.gmail.com/25' && echo 'TCP 25 reachable'
```

## Quick start

### Docker CLI

```bash
docker volume create maddydata

export MADDY_HOSTNAME=mx1.example.org
export MADDY_DOMAIN=example.org

docker run -d \
  --name maddy \
  --restart unless-stopped \
  -e MADDY_HOSTNAME="$MADDY_HOSTNAME" \
  -e MADDY_DOMAIN="$MADDY_DOMAIN" \
  -v maddydata:/data \
  -p 25:25 \
  -p 143:143 \
  -p 465:465 \
  -p 587:587 \
  -p 993:993 \
  enwaiax/maddy:0.9.5
```

首次启动会因为 TLS 文件尚未放入而失败，这是预期行为。使用临时容器将证书复制进 Volume，不要直接依赖 `/var/lib/docker/volumes` 的内部路径：

```bash
docker run --rm \
  -v maddydata:/data \
  -v /etc/letsencrypt/live/mx1.example.org:/certs:ro \
  --entrypoint sh \
  enwaiax/maddy:0.9.5 \
  -c 'mkdir -p /data/tls && cp /certs/fullchain.pem /data/tls/fullchain.pem && cp /certs/privkey.pem /data/tls/privkey.pem && chmod 600 /data/tls/privkey.pem'

docker start maddy
```

### Docker Compose

```bash
mkdir maddy && cd maddy
curl -fsSLo compose.yaml https://raw.githubusercontent.com/enwaiax/awesome-docker/main/images/maddy/docker-compose.yml
cat > .env <<'EOF'
MADDY_HOSTNAME=mx1.example.org
MADDY_DOMAIN=example.org
EOF

docker compose config
docker compose up -d
```

证书仍需复制到 `maddydata` Volume 的 `tls/` 目录。

## Configuration

### Environment variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `MADDY_HOSTNAME` | Yes | — | 邮件服务器 FQDN，例如 `mx1.example.org` |
| `MADDY_DOMAIN` | Yes | — | 主邮件域，例如 `example.org` |

主配置位于 `/data/maddy.conf`。初始化后修改该文件前必须备份；环境变量只影响上游 Docker 默认配置中引用 `{env:...}` 的字段。

### Ports

| Port | Protocol | Required | Description |
| --- | --- | --- | --- |
| `25` | TCP | Yes | 入站 SMTP 和服务器间投递 |
| `465` | TCP/TLS | Optional | 隐式 TLS Submission |
| `587` | TCP | Recommended | STARTTLS Submission |
| `143` | TCP | Optional | STARTTLS IMAP |
| `993` | TCP/TLS | Recommended | 隐式 TLS IMAP |

只开放实际使用的端口，并在云安全组和主机防火墙中保持一致。

### Volumes

| Host / volume | Container | Contains | Backup required |
| --- | --- | --- | --- |
| `maddydata` | `/data` | 配置、SQLite 数据库、邮件、队列、DKIM、TLS | Yes |

### Network and privileges

镜像不需要 privileged、host network 或额外 Linux capabilities。默认 bridge 网络配合显式端口映射即可。

## First-run verification

```bash
docker ps --filter name=maddy
docker logs --tail=100 maddy
docker exec maddy maddy version
docker exec maddy maddy creds create postmaster@example.org
docker exec maddy maddy imap-acct create postmaster@example.org
```

然后从 `/data/dkim_keys/*.dns` 获取 DKIM TXT 记录，并完成：

- `mx1.example.org` 的 A/AAAA 和 PTR；
- `example.org` 指向 `mx1.example.org` 的 MX；
- SPF、DKIM、DMARC；
- 可选的 MTA-STS 与 TLS-RPT。

不要照抄示例 DKIM 公钥；必须使用当前实例生成的记录。

## Operations

### Logs and status

```bash
docker logs --tail=200 -f maddy
docker exec maddy maddy version
docker stats maddy
```

### Upgrade

1. 阅读目标 Maddy release notes。
2. 完整备份 `/data`。
3. 将镜像 Tag 改为明确版本，执行 `docker compose pull && docker compose up -d`。
4. 验证版本、日志、SMTP Submission、IMAP 和队列状态。
5. 不要跨版本复用不同版本容器执行管理命令。

### Backup and restore

停止写入后备份 Volume：

```bash
docker stop maddy
docker run --rm -v maddydata:/data -v "$PWD:/backup" alpine:3.21.2 \
  tar -C /data -czf /backup/maddydata.tgz .
docker start maddy
```

恢复到新 Volume：

```bash
docker volume create maddydata-restored
docker run --rm -v maddydata-restored:/data -v "$PWD:/backup:ro" alpine:3.21.2 \
  tar -C /data -xzf /backup/maddydata.tgz
```

先用临时容器验证恢复内容，再切换生产容器的 Volume。

### Stop and uninstall

```bash
docker rm -f maddy
```

以上命令不会删除 `maddydata`。只有确认备份可恢复后，才可执行破坏性操作：

```bash
docker volume rm maddydata
```

## Security

- 私钥权限应限制为仅容器内服务可读；不要提交证书、密码或数据库到 Git。
- 账号密码通过交互式 `maddy creds create` 设置，不写入 Compose 或 shell history。
- 将 143/587 配置为强制 STARTTLS，或仅使用 993/465。
- 邮件服务器是高滥用风险服务；持续监控队列、认证失败、磁盘容量和异常外发。
- 定期更新固定版本，升级前验证配置兼容性和备份。

## Troubleshooting

### 容器启动后立即退出

```bash
docker logs --tail=200 maddy
docker run --rm -v maddydata:/data --entrypoint sh enwaiax/maddy:0.9.5 \
  -c 'ls -l /data/tls /data/maddy.conf'
```

常见原因是 TLS 文件缺失、路径错误或 `MADDY_HOSTNAME` / `MADDY_DOMAIN` 未设置。

### 外部邮件无法投递

检查公网 TCP 25、PTR、MX、SPF、DKIM、DMARC，以及云厂商是否封锁出站 25。使用外部邮件测试服务验证，而不要仅依赖容器内端口监听。

### 客户端无法登录

检查账号是否同时存在于凭据和 IMAP 数据库，并检查 465/587、143/993 的 TLS 与防火墙配置：

```bash
docker logs --tail=200 maddy | grep -iE 'auth|imap|submission|tls'
```

## Archived add-ons

- [RainLoop historical guide](rainloop/README.md) — archived, not recommended for new deployments.

## Lifecycle and known limitations

- 本 Guide 已针对 Maddy v0.9.5、AMD64 和 ARM64 构建进行验证。
- IMAP 存储在上游仍标记为 beta；关键邮件系统应评估 Dovecot 等成熟存储方案。
- 本仓库维护容器封装和部署说明，不替代上游安全公告、邮件投递运维和数据恢复演练。
- 镜像发布前仍需通过 main 分支手动 dry run 和显式发布审批。
