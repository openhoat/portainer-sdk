[![Build Status](https://travis-ci.com/openhoat/portainer-sdk.svg?branch=master)](https://travis-ci.com/openhoat/portainer-sdk)
[![Coverage Status](https://coveralls.io/repos/github/openhoat/portainer-sdk/badge.svg?branch=master)](https://coveralls.io/github/openhoat/portainer-sdk?branch=master)

## Portainer SDK

The goal of this project is to deal with a simple machine-to-machine way to manage docker containers through portainer, it mainly provides :
- a portainer API client module to integrate portainer and docker features
- a "portainer" CLI (command line interface) to easily consume the portainer API from a shell

This is a draft project...

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
 
### Roadmap

- [x] support complete docker container lifecycle
- [ ] add i18n resources
- [ ] support all docker API features
- [ ] support all portainer API features
