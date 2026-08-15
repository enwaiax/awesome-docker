# RainLoop historical webmail add-on

> **Lifecycle:** `Archived`
> **Recommended for new deployments:** `No`
> **Last verified:** `2026-08-15`

> [!WARNING]
> 此 RainLoop 组合使用过时的应用、PHP 和明文 HTTP 示例，已不再作为 Maddy 推荐组件。保留本页仅帮助旧实例备份和迁移。

## Overview

历史方案通过 Nginx + PHP-FPM 提供 RainLoop Webmail，并连接外部 Maddy SMTP/IMAP。它不属于 Maddy 主镜像，也没有本仓库维护的安全更新。

## Prerequisites

只在隔离环境维护旧实例。需要现有 RainLoop 文件、应用配置、用户自定义、反向代理和 TLS 配置。

## Quick start

不提供新部署命令。现有用户可以用以下命令识别旧服务：

```bash
docker compose -f compose.yaml config
docker compose -f compose.yaml ps
docker compose -f compose.yaml logs --tail=200
```

不要重新执行旧教程中的宽松权限或默认密码步骤。

## Configuration

### Environment variables

历史 Compose 未定义环境变量契约。

### Ports

旧配置将 Nginx HTTP 暴露在 TCP 80。它不应直接用于公网，应由受维护的 TLS 反向代理和 Webmail 替代方案接管。

### Volumes

| Host | Container | Contains | Backup |
| --- | --- | --- | --- |
| `./rainloop` | Nginx/PHP Web root | 应用、配置、插件和用户设置 | Required |
| `./rainloop.conf` | Nginx config | Web server routing | Recommended |

### Network and privileges

不需要 privileged 或 host network。旧方案的风险主要来自过时应用、运行时和文件权限，而非 Docker capability。

## First-run verification

只验证现有实例：

```bash
docker compose ps
docker compose logs --tail=200 nginx php
```

不要使用默认管理员凭据或真实邮箱密码进行公开测试。

## Operations

### Logs and status

```bash
docker compose logs -f --tail=200 nginx php
```

### Upgrade

不提供升级路径。应迁移到仍受维护的 Webmail 客户端，而不是替换单个 PHP Tag 后继续运行。

### Backup and restore

```bash
docker compose down
tar -czf rainloop-backup.tgz rainloop rainloop.conf compose.yaml
```

在隔离环境恢复并导出必要设置，不要将旧实例重新暴露公网。

### Stop and uninstall

```bash
docker compose down
```

确认迁移完成后再删除应用目录和反向代理配置。

## Security

- 禁止使用递归 world-writable 权限；按 Web 服务 UID/GID 设置最小权限。
- 立即轮换历史默认管理员密码和曾保存在客户端中的邮箱凭据。
- 不使用明文 HTTP 登录邮箱。
- 旧 PHP RC/Alpine 组合和 RainLoop 本体均不再视为安全基线。

## Troubleshooting

### 页面返回 502

检查 PHP-FPM 容器、Nginx upstream 配置和共享 Web root Mount。

### 无法连接 Maddy

核对 SMTP/IMAP 地址、TLS 端口和证书，不要通过关闭 TLS 验证解决问题。

## Lifecycle and known limitations

该附加方案已 Archived，不再由网站作为推荐项目展示。新部署应选择受维护的 Webmail，并单独完成安全评估、TLS 和备份设计。
