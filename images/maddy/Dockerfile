FROM golang:1.23-alpine AS build

ARG MADDY_VERSION=v0.9.5
ARG ADDITIONAL_BUILD_TAGS=""

RUN apk add --no-cache build-base

WORKDIR /src
COPY ./maddy/go.mod ./maddy/go.sum ./
RUN go mod download
COPY ./maddy ./

RUN ./build.sh \
      --version "${MADDY_VERSION}" \
      --builddir /tmp/build \
      --destdir /tmp/package/ \
      --tags "docker ${ADDITIONAL_BUILD_TAGS}" \
      build install

FROM alpine:3.21.2

ARG MADDY_VERSION=v0.9.5
LABEL org.opencontainers.image.title="Maddy Mail Server" \
      org.opencontainers.image.description="Composable all-in-one mail server" \
      org.opencontainers.image.source="https://github.com/enwaiax/awesome-docker" \
      org.opencontainers.image.version="${MADDY_VERSION}" \
      org.opencontainers.image.licenses="GPL-3.0"

RUN apk add --no-cache ca-certificates

COPY --from=build /tmp/package/usr/local/bin/maddy /bin/maddy
COPY ./maddy/maddy.conf.docker /data/maddy.conf

EXPOSE 25 143 465 587 993
VOLUME ["/data"]
ENTRYPOINT ["/bin/maddy", "-config", "/data/maddy.conf"]
CMD ["run"]
