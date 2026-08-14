FROM golang:alpine AS builder
WORKDIR /root
COPY ./DownloadBot .
RUN go build

FROM alpine:latest
LABEL org.opencontainers.image.authors="chasing0806@gmail.com"
ENV TZ=Asia/Shanghai
WORKDIR /root
COPY --from=builder  /root/DownloadBot /root/DownloadBot
CMD ["/root/DownloadBot"]