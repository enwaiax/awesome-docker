## When container, do container

> **A curated, multi-architecture Docker collection with practical deployment guides.**

🌐 **Website (coming with the Pages launch):** `https://enwaiax.github.io/awesome-docker/`

This repository collects useful open-source projects, packages them for multiple CPU architectures, and documents the operational details needed to run them responsibly.

本仓库收集值得自托管的开源项目，为 AMD64、ARM64 等架构提供容器化方案，并持续整理部署、持久化、升级与安全说明。

### Container catalog

| Project | Purpose | Architectures | Status |
| --- | --- | --- | --- |
| [Maddy](maddy/) | All-in-one mail server | AMD64 / ARM64 | Maintained |
| [Download Bot](download-bot/) | Telegram-driven downloads | AMD64 / ARM64 | Community |
| [Netease Music Tasks](netease-cloud-music-tasks/) | Scheduled automation | AMD64 / ARM64 | Community |
| [X-UI](x-ui/) | Network management panel | Multi-arch | Moved / legacy |
| [Firefox Send](firefox_send/) | Self-hosted file sharing | AMD64 | Archived upstream |

The new Astro website provides searchable project cards, consistent quick-start instructions, lifecycle labels, architecture information, and dedicated project pages. Source is under [`site/`](site/).

- [Contributing guide](CONTRIBUTING.md)
- [Security policy](SECURITY.md)

### Docker usage notes

#### 1. 安装脚本

一键安装脚本！Linux 系统都支持！

```
curl -sSL https://get.docker.com/ | sh
```

国内阿里云镜像

```
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
```

Azure 源(中国区 azure)

```
curl -fsSL https://get.docker.com | bash -s docker --mirror AzureChinaCloud
```

#### 2. 使用国内镜像

为了加速下载镜像文件，国内服务器可以指定国内的镜像！

```
阿里云：https://registry.cn-hangzhou.aliyuncs.com/
华为云：https://05f073ad3c0010ea0f4bc00b7105ec20.mirror.swr.myhuaweicloud.com/
Docker中国：https://registry.docker-cn.com
网易：http://hub-mirror.c.163.com
中科大：https://docker.mirrors.ustc.edu.cn
```

写入配置文件 重启服务

```shell
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["http://hub-mirror.c.163.com"]
}
EOF
```

​重启 docker-daemon 及 docker

```shell
sudo systemctl daemon-reload
sudo systemctl restart docker
```

#### 3. 迁移目录

主要是为了不让 Docker 镜像，容器占用系统盘的容量！

如果就一块盘或者系统盘容量大，这部分内容可忽略！

```
#测试安装NGINX
docker pull nginx
docker run -d -p 8080:80 nginx

# 给Docker廋身一下
#docker system prune

#停止Docker服务
systemctl stop docker
#systemctl stop docker.socket

#创建目标目录
mkdir -p /data/docker/

#同步源目录文件 -> 目标目录
rsync -avz /var/lib/docker/ /data/docker

#修改Docker配置文件
vim /etc/docker/daemon.json

#修改或者新增内容如下
{
    "data-root": "/data/docker"
}

#启动Docker服务
systemctl start docker

# 查看是否修改成功
docker info | grep "Docker Root Dir"

#输出：Docker Root Dir: /data/docker  就OK了！

#可删除原目录(谨慎) rm -rf /var/lib/docker/
```

### Stargazers over time

[![Stargazers over time](https://starchart.cc/enwaiax/awesome-docker.svg)](https://starchart.cc/enwaiax/awesome-docker)
