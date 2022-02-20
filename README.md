## When container, do container

This repo is created to collected some wonderful projects and dockernized them for ARM and AMD platforms.
You are welcome to fork and contribute to this project.

本仓库主要用于收集`github`上的优秀项目，并将其 docker 化，用于支持在 ARM 及 AMD 平台部署，欢迎推荐。

### Docker usage lazy notes

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

[![Stargazers over time](https://starchart.cc/Chasing66/beautiful_docker.svg)](https://starchart.cc/Chasing66/beautiful_docker)
