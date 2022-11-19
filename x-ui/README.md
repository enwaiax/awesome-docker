# x-ui

GitHub [Chasing66/beautiful_docker](https://github.com/Chasing66/beautiful_docker/tree/main/x-ui)  
Docker [enwaiax/x-ui](https://hub.docker.com/r/enwaiax/x-ui)
> *docker image support for AMD64 and ARM64

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
数据已经mount到x-ui路径下的db目录下了，直接打包整个x-ui文件夹再次`docker-compose up -d`即可起来

#### 证书
容器起来后，将证书放置在`./x-ui/cert`即可，容器内的路径为`/root/cert/`

## 使用
访问`http://服务器IP:54321`使用账号`admin`密码`admin`登录.注意需开放相关端口防火墙,并及时修改账号密码.

## 忘记密码
删除当前路径下的db目录，重新部署容器，密码会被重置为`admin`

## 参考
GitHub [vaxilu/x-ui](https://github.com/vaxilu/x-ui)  
GitHub [stilleshan/dockerfiles](https://github.com/stilleshan/dockerfiles)  
