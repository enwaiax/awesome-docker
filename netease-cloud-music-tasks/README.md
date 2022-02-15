# `netease-cloud-music-tasks`

GitHub [Chasing66/beautiful_docker](https://github.com/Chasing66/beautiful_docker/tree/main/netease-cloud-music-tasks)  
Docker [enwaiax/netease-cloud-music-tasks](https://hub.docker.com/r/enwaiax/netease-cloud-music-tasks)

>docker image support for AMD64 and ARM64

## 简介

基于 [chen310/NeteaseCloudMusicTasks](https://github.com/chen310/NeteaseCloudMusicTasks) 项目的 docker 镜像.

### 镜像介绍

1. 签到领云贝
2. 自动完成云贝任务，并领取云贝
3. 打卡升级
4. 刷指定歌曲的播放量
5. 音乐人自动签到领取云豆
6. 音乐人自动完成任务，并领取云豆
7. 自动领取 vip 成长值（任务需自己完成）
8. 多种推送方式
9. 支持多账号

### 注册成为网易云音乐人

[<img src="https://s4.ax1x.com/2022/02/15/HRTJ5q.jpg" alt="HRTJ5q.jpg" style="zoom:35%;" />](https://imgtu.com/i/HRTJ5q)

## 部署

### 下载并配置 `config.json`

```
curl -fsSL -o config.json https://raw.githubusercontent.com/chen310/NeteaseCloudMusicTasks/main/config.json
```

修改配置参考[配置说明](https://github.com/chen310/NeteaseCloudMusicTasks#%E4%BF%AE%E6%94%B9%E9%85%8D%E7%BD%AE)

### 随机时间执行

```
docker run -itd --restart=on-failure \
    -v $(pwd)/config.json:/root/config.json \
    --name netease-cloud-music-tasks \
    enwaiax/netease-cloud-music-tasks:latest
```

### 指定时间执行

```
docker run -itd --restart=on-failure \
    -v $(pwd)/config.json:/root/config.json \
    -e "SCHEDULER_HOUR=8" -e "SCHEDULER_MINUTE=30" \
    --name netease-cloud-music-tasks \
    enwaiax/netease-cloud-music-tasks:latest
```
