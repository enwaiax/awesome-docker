FROM ubuntu
LABEL org.opencontainers.image.authors="chasing0806@gmail.com"
ENV DEBIAN_FRONTEND noninteractive

RUN apt -y update && apt install wget tzdata -y
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone && dpkg-reconfigure -f noninteractive tzdata

RUN wget https://raw.githubusercontent.com/sprov065/x-ui/master/install.sh && chmod +x install.sh && ./install.sh 

WORKDIR /usr/local/x-ui/
CMD ["./x-ui"]