# v-ui

GitHub [enwaiax/dockerfiles](https://github.com/chasing66/dockerfiles)  
Docker [enwaiax/x-ui](https://hub.docker.com/r/enwaiax/x-ui)
> *docker image support for AMD64 and ARM64

## 简介
基于 [sprov065/x-ui](https://github.com/sprov065/x-ui) 项目的 docker 镜像.


### docker compose 部署
```shell
mkdir x-ui && cd x-ui
wget https://raw.githubusercontent.com/enwaiax/dockerfiles/main/x-ui/docker-compose.yml
docker-compose up -d
```

### 备份
数据已经mount到x-ui路径下的db目录下了，直接打包整个x-ui文件夹再次 docker-compose up -d 即可起来

#### 证书
容器起来后，将证书放置在./x-ui/cert即可，容器内的路径为/root/cert/

## 使用
访问`http://服务器IP:54321`使用账号`admin`密码`admin`登录.注意需开放相关端口防火墙,并及时修改账号密码.

## 参考
GitHub [sprov065/x-ui](https://github.com/sprov065/x-ui)
GitHub [stilleshan/dockerfiles](https://github.com/stilleshan/dockerfiles)  