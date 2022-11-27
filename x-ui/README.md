# x-ui

GitHub [Chasing66/x-ui](https://github.com/Chasing66/x-ui)
Docker [enwaiax/x-ui](https://hub.docker.com/r/enwaiax/x-ui)

此项目已独立为一个全新的项目，支持更多架构，支持两种版本的镜像

|                                                           | Tag    | amd64 | arm64 | armv7 | armv6 | s390x |
| --------------------------------------------------------- | ------ | ----- | ----- | ----- | ----- | ----- |
| [vaxilu/x-ui](https://github.com/vaxilu/x-ui)             | latest | ✅    | ✅    | ✅    | ✅    | ✅    |
| [FranzKafkaYu/x-ui](https://github.com/FranzKafkaYu/x-ui) | alpha  | ✅    | ✅    | ❌    | ❌    | ✅    |

Go to [Chasing66/x-ui](https://github.com/Chasing66/x-ui) to check the latest update

[English Version](docs/README_en.md)

## 简介

基于 [vaxilu/x-ui](https://github.com/vaxilu/x-ui) 项目的 docker 镜像.

### docker 部署

```shell
mkdir x-ui && cd x-ui
docker run -itd --network=host -v $PWD/db/:/etc/x-ui/ -v $PWD/cert/:/root/cert/ --name x-ui --restart=unless-stopped enwaiax/x-ui:latest
```

### docker compose 部署

```shell
mkdir x-ui && cd x-ui
wget https://raw.githubusercontent.com/Chasing66/beautiful_docker/main/x-ui/docker-compose.yml
docker-compose up -d
```

### 备份

数据已经 mount 到 x-ui 路径下的 db 目录下了，直接打包整个 x-ui 文件夹再次`docker-compose up -d`即可起来

#### 证书

容器起来后，将证书放置在`./x-ui/cert`即可，容器内的路径为`/root/cert/`

## 使用

访问`http://服务器IP:54321`使用账号`admin`密码`admin`登录.注意需开放相关端口防火墙,并及时修改账号密码.

## 忘记密码

删除当前路径下的 db 目录，重新部署容器，密码会被重置为`admin`

## 参考

GitHub [vaxilu/x-ui](https://github.com/vaxilu/x-ui)  
GitHub [stilleshan/dockerfiles](https://github.com/stilleshan/dockerfiles)
