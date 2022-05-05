# maddy

GitHub [Chasing66/beautiful_docker](https://github.com/Chasing66/beautiful_docker/tree/main/maddy)  
Docker [enwaiax/maddy](https://hub.docker.com/r/enwaiax/maddy)

> \*docker image support for AMD64 and ARM64

## 简介

基于 [foxcpp/maddy](https://github.com/foxcpp/maddy) 项目的 docker 镜像.

Maddy 是一款用 Go 语言开发的邮件服务器，它实现了运行电子邮件服务器所需的所有功能。

Maddy 用一个具有统一配置和最低维护成本的守护进程取代了 Postfix、Dovecot、OpenDKIM、OpenSPF、OpenDMARC 等程序。

通俗点讲就是部署特别方便, 资源占用少，非常适合个人使用的电子邮件服务器。

### 预置条件

检查 25 端口是否开放

```
telnet smtp.aol.com 25
```

### 部署步骤

#### 1. 创建 docker volume

```
docker volume create maddydata
```

#### 2. 创建 tls 证书

申请证书步骤略过，将证书 copy 并重命为`tls_key.pem`和`tls_cert.pem`到 volume 目录

```shell
# docker volume 目录
cd $(docker volume inspect maddydata --format '{{.Mountpoint}}')

# 拷贝并重命名证书到当前目录
cp /etc/letsencrypt/live/mx1.example.org/cert.pem tls_cert.pem
cp /etc/letsencrypt/live/mx1.example.org/privkey.pem tls_key.pem
```

#### 3. 设置 hostname 和 domainname

```
export MADDY_HOSTNAME=mx1.example.org
export MADDY_DOMAIN=example.org
```

#### 4. 创建 maddy 实例

##### 4.1 使用 docker 创建

```shell
docker run -d --name maddy \
  -e MADDY_HOSTNAME=$MADDY_HOSTNAME -e MADDY_DOMAIN=$MADDY_DOMAIN \
  -v maddydata:/data \
  -p 25:25 -p 143:143 -p 465:465 -p 587:587 -p 993:993 \
  enwaiax/maddy:latest
```

##### 4.2 使用 docker-compose 创建

```shell
mkdir maddy && cd maddy
wget https://raw.githubusercontent.com/Chasing66/beautiful_docker/main/maddy/docker-compose.yml
docker-compose up -d
```

#### 5. 配置 DNS 记录解析

```shell
# A记录
example.org   A     10.2.3.4
example.org   AAAA  2001:beef::1

# MX记录
example.org   MX    mx1.example.org.
# 同时最好配置mx1.example.org的A记录
mx1.example.org   A     10.2.3.4
mx1.example.org   AAAA  2001:beef::1

# SPF
example.org     TXT   "v=spf1 mx ~all"
mx1.example.org TXT   "v=spf1 mx ~all"

# _dmarc
_dmarc.example.org   TXT    "v=DMARC1; p=quarantine; ruf=mailto:postmaster@example.org"

# _mta-sts，_smtp.tls
_mta-sts.example.org   TXT    "v=STSv1; id=1"
_smtp._tls.example.org TXT    "v=TLSRPTv1;rua=mailto:postmaster@example.org"

# _dmarc
cd $(docker volume inspect maddydata --format '{{.Mountpoint}}')
cat dkim_keys/*.dns

default._domainkey.example.org   TXT    "v=DKIM1; k=ed25519; p=nAcUUozPlhc4VPhp7hZl+owES7j7OlEv0laaDEDBAqg="
```

#### 6. 创建邮件发送账户

```shell
docker exec -it maddy sh
maddyctl creds create postmaster@example.org
maddyctl imap-acct create postmaster@example.org
```

### 备份

所有数据挂载在 volume 中，volum 路径为:

```
$ docker volume inspect maddydata --format '{{.Mountpoint}}'
/var/lib/docker/volumes/maddydata/_data
$ cd /var/lib/docker/volumes/maddydata/_data

```

备份该目录即可

### 其他
- [搭建webmail: Rainloop](rainloop/README.md)
