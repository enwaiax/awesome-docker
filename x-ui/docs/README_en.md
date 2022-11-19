# x-ui

GitHub [Chasing66/beautiful_docker](https://github.com/Chasing66/beautiful_docker/tree/main/x-ui)  
Docker [enwaiax/x-ui](https://hub.docker.com/r/enwaiax/x-ui)

> \*docker image support for AMD64 and ARM64

## Introduction

Docker image based on [vaxilu/x-ui](https://github.com/vaxilu/x-ui)

## Pre-condition

- Docker has been installed on your system

```bash
curl -sSL https://get.docker.com/ | sh
```

### Deployed by docker

```shell
mkdir x-ui && cd x-ui
docker run -itd --network=host \
    -v $PWD/db/:/etc/x-ui/ \
    -v $PWD/cert/:/root/cert/ \
    --name x-ui --restart=unless-stopped \
    enwaiax/x-ui:latest
```

### Deployed by docker compose

```shell
mkdir x-ui && cd x-ui
wget https://raw.githubusercontent.com/Chasing66/beautiful_docker/main/x-ui/docker-compose.yml
docker compose up -d
```

### Backup

All the data is stored under current folder named `db`. Backup this folder.

## How to use

Visit `http://{your server ip}:54321` with username `admin` and password `admin`

### Note:

- Remember to change it after first login
- Check your firewall if you can't visit it

## Enable ssl

This part describe how to enable ssl.

- Suppose your x-ui port is `54321`
- Suppose your IP is `10.10.10.10`
- Suppose your domain is `xui.example.com` and you have set the A recode in cloudflare
- Suppose you are using Debian 10+ or Ubuntu 18+ system
- Suppose your email is `xxxx@example.com`

### Steps as below

1. Install nginx and python3-certbot-nginx

```bash
sudo apt update
sudo apt install python3-certbot-nginx
```

2. Add new nging configurtion
   `touch /etc/nginx/conf.d/

```
touch /etc/nginx/conf.d/xui.conf
```

Add below to the file. Adjust appropriately to your own situation.

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name xui.example.com;

    location / {
        proxy_redirect off;
        proxy_pass http://127.0.0.1:54321;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

}
```

3. Get cert

Check yout conf is OK

```
nginx -t
```

Get cert

```
certbot --nginx --agree-tos --no-eff-email --email xxxxx@example.com
```

For more details, refer to [cerbot](https://certbot.eff.org/)

Reload nginx config

```
ngins -s reload
```
