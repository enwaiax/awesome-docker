# Netease Music Tasks

> **Lifecycle:** `Archived`
> **Image:** `enwaiax/netease-cloud-music-tasks:latest`
> **Architectures:** `amd64`, `arm64`
> **Last verified:** `2026-08-15`

> [!WARNING]
> 上游仓库已归档，且本镜像自 2022 年起未再发布。本目录仅供现有用户识别、备份和迁移，不建议新部署，也不提供安全或兼容性保证。

## Overview

- **Upstream:** https://github.com/chen310/NeteaseCloudMusicTasks
- **Docker Hub:** https://hub.docker.com/r/enwaiax/netease-cloud-music-tasks
- **Source directory:** https://github.com/enwaiax/awesome-docker/tree/main/images/netease-cloud-music-tasks
- **Recommended for new deployments:** `No`

历史功能包括签到、任务执行、多账号和消息推送。服务行为依赖第三方平台接口，归档后可能随时失效。

## Prerequisites

本项目不再建议部署。维护历史实例需要 Docker、原始 `config.json`、账号授权信息，以及对第三方服务条款和账号风险的理解。

## Quick start

不提供面向新用户的快速开始。下面命令只用于识别和临时恢复历史实例，运行前先审查配置和镜像：

```bash
docker run -d \
  --name netease-cloud-music-tasks \
  --restart on-failure \
  -v "$PWD/config.json:/root/config.json:ro" \
  enwaiax/netease-cloud-music-tasks:latest
```

本项目没有维护中的 Compose 文件。不要为了方便而将账号凭据写进新的 Compose 仓库。

## Configuration

### Environment variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `SCHEDULER_HOUR` | No | Upstream default | 历史定时执行小时 |
| `SCHEDULER_MINUTE` | No | Upstream default | 历史定时执行分钟 |

账号、Cookie、推送 Token 等主要位于 `config.json`，字段以归档上游源码为准。

### Ports

镜像不提供需要暴露的服务端口。

### Volumes

| Host / volume | Container | Contains | Backup required |
| --- | --- | --- | --- |
| `./config.json` | `/root/config.json` | 账号、Cookie、推送配置 | Yes, encrypted |

### Network and privileges

不需要 privileged、host network 或端口映射。容器需要访问第三方 API；网络访问不代表接口仍受支持。

## First-run verification

历史实例可通过以下命令检查：

```bash
docker ps --filter name=netease-cloud-music-tasks
docker logs --tail=200 netease-cloud-music-tasks
```

不要使用真实主账号测试未知或失效的自动化行为。

## Operations

### Logs and status

```bash
docker logs -f --tail=200 netease-cloud-music-tasks
```

### Upgrade

不提供升级路径。上游和镜像均已停止发布，不应将重新构建成功误认为恢复维护。

### Backup and restore

```bash
cp -p config.json config.json.backup
chmod 600 config.json.backup
```

备份应加密保存。恢复前轮换已经暴露或过期的 Cookie、Token 和推送凭据。

### Stop and uninstall

```bash
docker rm -f netease-cloud-music-tasks
```

删除容器不会删除 bind-mounted `config.json`。确认完成迁移后，安全擦除其中的账号凭据。

## Security

- 归档代码可能包含未修复漏洞或不再兼容的登录流程。
- `config.json` 包含敏感账号资料，不提交 Git，不粘贴到公开 Issue。
- 不保证自动化行为符合第三方平台当前服务条款。
- 不建议为恢复功能而下载来源不明的 Fork 或镜像。

## Troubleshooting

### 登录或任务接口失效

这通常是归档项目与第三方 API 变化导致；本仓库不提供协议修复。优先停止容器并撤销凭据。

### 容器循环重启

```bash
docker inspect netease-cloud-music-tasks --format '{{.State.ExitCode}} {{.State.Error}}'
docker logs --tail=200 netease-cloud-music-tasks
```

保留日志用于迁移判断，但不要在公开报告中泄露 Cookie 或 Token。

## Lifecycle and known limitations

- 上游已归档；Docker Hub 最新镜像发布于 2022 年。
- 本仓库仅保留静态检查和历史 AMD64 构建，以防资料无声腐化。
- 镜像已从维护中的手动发布白名单移除。
- 建议现有用户停止自动化任务、导出所需配置、撤销凭据并迁移到仍受维护的合法方案。
