[![Build Status](https://travis-ci.com/openhoat/portainer-sdk.svg?branch=master)](https://travis-ci.com/openhoat/portainer-sdk)
[![Coverage Status](https://coveralls.io/repos/github/openhoat/portainer-sdk/badge.svg?branch=master)](https://coveralls.io/github/openhoat/portainer-sdk?branch=master)

## Portainer SDK

The goal of this project is to deal with a simple machine-to-machine way to manage docker containers through portainer, it mainly provides :
- a portainer API client module to integrate portainer and docker features
- a portainer command (CLI) to easily consume the portainer API from a shell

This is a draft project...

### Supported features

- [x] show portainer version
- [x] show portainer info
- [x] manage remote portainer host
- [x] portainer authentication
- [x] saved settings
- [x] create / pull a docker image
- [x] remove a docker image
- [x] list docker images
- [x] create a docker container
- [x] get docker container details
- [x] list docker containers
- [x] remove a docker container
- [x] start a docker container
- [x] stop a docker container
- [x] deploy a docker container
- [ ] add i18n resources
- [ ] other docker API features...
- [ ] other portainer API features...

### SDK

> TODO

### Command Line Interface

#### Installation

```sh
$ npm i -g portainer-sdk
```

#### Usage

##### Examples

- Pull a docker image

```sh
$ portainer image-create --from tutum/hello-world
```

- Create a docker container

```sh
$ portainer container-create tutum/hello-world \
  --name hello-world \
  --hostConfig '{ "RestartPolicy": { "Name": "unless-stopped" } }' \
  --labels '{ "traefik.enable": "true", "traefik.frontend.rule": "Host:hello.local.io", "traefik.webservice.frontend.entryPoints": "http" }'
```

- Start the container

```sh
$ portainer container-start hello-world
```

- Test the container

```sh
$ http hello.local.io
```

- Stop the container

```sh
$ portainer container-stop hello-world
```

- Delete the container

```sh
$ portainer container-remove hello-world
```

- Delete the image

```sh
$ portainer image-remove tutum/hello-world
```

- Redeploy a container

```sh
$ portainer container-deploy tutum/hello-world hello-world \                                                                                                     master 
  --hostConfig '{ "RestartPolicy": { "Name": "unless-stopped" } }' \
  --labels '{ "traefik.enable": "true", "traefik.frontend.rule": "Host:hello.local.io", "traefik.webservice.frontend.entryPoints": "http" }'
```

##### Tricks

- Get containers with id

```sh
$ portainer container-list | jq "[.[] | {id: .Id, name: .Names[0]}]" | prettyoutput
```

- Get images with id

```sh
$ portainer image-list | jq "[.[] | {id: .Id, image: .Image}]" | prettyoutput
```

Enjoy !
