FROM golang:latest AS builder
RUN apt-get update && apt-get install -y curl wget jq unzip
WORKDIR /root
COPY x-ui .
RUN go build main.go


FROM debian:11-slim
LABEL org.opencontainers.image.authors="chasing0806@gmail.com"
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends -y ca-certificates \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
ENV TZ=Asia/Shanghai
WORKDIR /root
COPY --from=builder  /root/main /root/x-ui
COPY x-ui/bin/. /root/bin/.
# COPY --from=builder  /root/xray/. /root/bin/.
VOLUME [ "/etc/x-ui" ]
CMD [ "./x-ui" ]
