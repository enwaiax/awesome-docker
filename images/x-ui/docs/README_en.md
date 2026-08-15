# X-UI historical Docker guide

> **Lifecycle:** `Moved`
> **Image:** `enwaiax/x-ui:latest`
> **Architectures:** historical multi-architecture manifest
> **Last verified:** `2026-08-15`

> This guide is retained for existing users. New deployments should use the maintained repository at https://github.com/enwaiax/x-ui.

## Overview

- **Upstream:** https://github.com/vaxilu/x-ui
- **Maintained image repository:** https://github.com/enwaiax/x-ui
- **Docker Hub:** https://hub.docker.com/r/enwaiax/x-ui
- **Recommended for new deployments:** `No`

The image definition in this catalog is not reproducible because it clones a moving upstream branch during build. It is excluded from publishing here.

## Prerequisites

Existing users need Docker, a backup of the database and certificate directories, the current image digest, and an inventory of every exposed host-network port.

## Quick start

Historical recovery command only:

```bash
docker run -d \
  --name x-ui \
  --restart unless-stopped \
  --network host \
  -v "$PWD/db:/etc/x-ui" \
  -v "$PWD/cert:/root/cert:ro" \
  enwaiax/x-ui:latest
```

Historical Compose file:

```bash
curl -fsSLo compose.yaml https://raw.githubusercontent.com/enwaiax/awesome-docker/main/images/x-ui/docker-compose.yml
docker compose config
docker compose up -d
```

## Configuration

### Environment variables

This catalog does not maintain an environment-variable contract for the historical image. Configuration is stored in the mounted database.

### Ports

Host networking means ports are not listed in Compose. Inspect the live process with `ss -lntp`; the historical panel commonly used TCP 54321.

### Volumes

| Host | Container | Contents | Backup |
| --- | --- | --- | --- |
| `./db` | `/etc/x-ui` | Database and application configuration | Required |
| `./cert` | `/root/cert` | TLS certificate and key | Required, encrypted |

### Network and privileges

The container uses the host network namespace. Restrict every panel and proxy port with the host firewall and cloud security groups.

## First-run verification

```bash
docker ps --filter name=x-ui
docker logs --tail=200 x-ui
ss -lntp
```

Immediately replace default credentials and move the management interface away from default settings, following the maintained repository's current instructions.

## Operations

### Logs and status

```bash
docker logs -f --tail=200 x-ui
docker inspect x-ui --format '{{.Config.Image}} {{.State.Status}}'
```

### Upgrade

No upgrade is supported by this catalog. Back up data, record the current digest, and validate migration to the maintained repository on a copy of the database.

### Backup and restore

```bash
docker stop x-ui
tar -czf x-ui-backup.tgz db cert
docker start x-ui
```

Restore to a separate directory first. Never delete the database as a password-reset technique; doing so destroys configuration.

### Stop and uninstall

```bash
docker rm -f x-ui
```

This keeps bind-mounted data. Delete it only after a tested migration and backup.

## Security

- Change default credentials immediately.
- Do not expose the panel directly to the Internet.
- Use TLS, firewall rules, access control, and a non-default management path.
- Protect database, UUID, subscription, and private-key material.
- Do not treat a successful floating-source build as a trusted release.

## Troubleshooting

### Panel is unreachable

Inspect logs, actual listening ports, host firewall rules, cloud security groups, and the configured web path.

### Password is lost

Back up the database and use the reset procedure for the exact maintained version. Do not remove the data directory.

## Lifecycle and known limitations

This catalog entry is Moved and publish-disabled. Architecture claims describe the historical Docker Hub manifest only. Use https://github.com/enwaiax/x-ui for current releases and instructions.
