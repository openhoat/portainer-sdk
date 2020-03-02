[![Build Status](https://travis-ci.com/openhoat/portainer-sdk.svg?branch=master)](https://travis-ci.com/openhoat/portainer-sdk)
[![Coverage Status](https://coveralls.io/repos/github/openhoat/portainer-sdk/badge.svg?branch=master)](https://coveralls.io/github/openhoat/portainer-sdk?branch=master)

## Portainer SDK

This is a draft project...

### SDK

> TODO

### Command Line Interface

#### Installation

```shell script
$ npm i -g portainer-sdk
```

#### Usage

##### Examples

```shell script
$ portainer docker-image-create --from tutum/hello-world
```

```shell script
$ portainer docker-container-create tutum/hello-world \
  --name hello-world \
  --hostConfig '{ "RestartPolicy": { "Name": "unless-stopped" } }' \
  --labels '{ "traefik.enable": "true", "traefik.frontend.rule": "Host:hello.local.io", "traefik.webservice.frontend.entryPoints": "http" }'
```

```shell script
$ portainer docker-container-start hello-world
```

```shell script
$ portainer docker-container-stop hello-world
```

```shell script
$ portainer docker-container-remove hello-world
```

```shell script
$ portainer docker-image-remove tutum/hello-world
```

### Roadmap

- [x] support complete docker container lifecycle
- [ ] add i18n resources
- [ ] support all docker API features
- [ ] support all portainer API features
