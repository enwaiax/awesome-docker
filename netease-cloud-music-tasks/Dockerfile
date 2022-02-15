FROM python:alpine as builder

RUN apk update && apk add --no-cache tzdata alpine-sdk libffi-dev
ADD ./NeteaseCloudMusicTasks/requirements.txt /tmp/requirements.txt
RUN pip3 install --user --quiet -r /tmp/requirements.txt && rm /tmp/requirements.txt

FROM python:alpine
WORKDIR /root
ENV TZ=Asia/Shanghai

COPY --from=builder /root/.local /usr/local
COPY --from=builder /usr/share/zoneinfo /usr/share/zoneinfo
COPY ./NeteaseCloudMusicTasks /root

CMD ["python", "scheduler.py"]
