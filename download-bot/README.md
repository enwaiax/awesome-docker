# x-ui

GitHub [Chasing66/beautiful_docker](https://github.com/Chasing66/beautiful_docker/tree/main/download-bot)  
Docker [enwaiax/download-bot](https://hub.docker.com/r/enwaiax/download-bot)

> \*docker image support for AMD64 and ARM64

## 简介

基于 [gaowanliang/DownloadBot](https://github.com/gaowanliang/DownloadBot) 项目的 docker 镜像.

## 部署

### 下载并配置 `config.json`

```
curl -fsSL -o config.json https://raw.githubusercontent.com/Chasing66/beautiful_docker/main/download-bot/config.json
```

### docker 部署

```
docker run -itd --restart=on-failure \
    -v $(PWD)/config.json:/root/config.json \
    --name download-bot \
    enwaiax/download-bot:latest
```

### docker-compose 与 aria2 一起部署

```
curl -fsSL -o docker-compose.yml https://raw.githubusercontent.com/Chasing66/beautiful_docker/main/download-bot/docker-compose.yml
docker-compose up -d
```
