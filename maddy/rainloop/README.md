# 搭建 Rainloop
## 简介

RainLoop 是基于 WEB 的邮件服务器系统是一个免费开源的 PHP Web Mail 客户端系统应用工具，可以用一个界面管理多个帐号，该程序拥有简洁的界面和全面的功能，支持 SMTP+IMAP。

用来配合 maddy 可以非常方便的搭建一套完整的带 webmail 的电子邮件服务。

## 步骤

### 1. 下载 rainloop 安装包

```
mkdir rainloop && cd rainloop
wget -q https://www.rainloop.net/repository/webmail/rainloop-community-latest.zip
unzip rainloop-community-latest.zip -d rainloop
chmod -R 777 rainloop
```

### 2. 下载 docker-compose 文件

```
wget -q https://raw.githubusercontent.com/Chasing66/beautiful_docker/main/maddy/rainloop/docker-compose.yml
```

### 3. 下载 nginx 配置文件

```
wget -q https://raw.githubusercontent.com/Chasing66/beautiful_docker/main/maddy/rainloop/rainloop.conf
```

### 4. 拉起 docker

```
docker-compose up -d
```

### 5. 登录后台初始配置

地址为：http://ip/?admin
初始用户名密码为： admin/12345，请及时修改
配置好搭建的 maddy 地址，访问 http://ip，使用 maddy 里创建的用户登录即可从网页端发送邮件

### 6. 其他

也可使用 windows 客户端[thunderbird](https://www.thunderbird.net)
