[![Build Status](https://travis-ci.com/openhoat/portainer-sdk.png?branch=master)](https://travis-ci.com/openhoat/portainer-sdk)
![GitHub package.json version](https://img.shields.io/github/package-json/v/openhoat/portainer-sdk)
[![Coverage Status](https://coveralls.io/repos/github/openhoat/portainer-sdk/badge.png?branch=master)](https://coveralls.io/github/openhoat/portainer-sdk?branch=master)
![GitHub](https://img.shields.io/github/license/openhoat/portainer-sdk)
![GitHub top language](https://img.shields.io/github/languages/top/openhoat/portainer-sdk)
[![Known Vulnerabilities](https://snyk.io/test/github/openhoat/portainer-sdk/badge.svg)](https://snyk.io/test/github/openhoat/portainer-sdk)

Easy way to deploy and update your containers with a command or an API request through [Portainer](https://www.portainer.io/). 

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
- [x] env vars support
- [ ] add i18n resources
- [ ] other docker API features...
- [ ] other portainer API features...

### Command Line Interface

#### Installation

```sh
$ npm i -g portainer-sdk
```

#### Usage

The best way to get started with portainer cli is to simply read the help.

```sh
$ portainer --help
```

##### Examples

Some simple examples of usual tasks :

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

More advanced examples :

- Get containers with id

```sh
$ portainer container-list | jq "[.[] | {id: .Id, name: .Names[0]}]" | prettyoutput
```

- Get images with id

```sh
$ portainer image-list | jq "[.[] | {id: .Id, image: .Image}]" | prettyoutput
```

- Redeploy a remote image from private registry

Example of a web application using a redis database :

```sh
$ portainer container-deploy my-image:0.0.1 my-container \                                                                                     master 
  --registry 'my.private-registry.io' \
  --hostConfig '{ "Links": ["redis-server:redis"], "RestartPolicy": { "Name": "unless-stopped" } }' \
  --env '["APP_ENV=staging", "REDIS_HOST=redis"]' \
  --labels '{ "traefik.enable": "true", "traefik.frontend.rule": "Host:my-container.mydomain.io", "traefik.webservice.frontend.entryPoints": "http" }'
```

#### Supported environment variables

Some environment variables are supported by the command to override settings, or to facilitate bigger process integration :

- PORTAINER_HOST : base URL of the portainer host to use
- PORTAINER_JWT : portainer JWT token (obtained in authentication result, and usually available for 8 hours)
- PORTAINER_USERNAME : username of the portainer account to use when an authentication is needed (to generate a new JWT)
- PORTAINER_PASSWORD : password of the portainer account to use when an authentication is needed (to generate a new JWT)
- PORTAINER_DOCKER_REGISTRY : docker registry server hostname
- ENCRYPTION_KEY : encryption key to use to encrypt / decrypt passwords saved in settings file
- LOG_LEVEL : log level
- LANG : preferred lang to use (aliases : LC_ALL, LC_MESSAGES, LANGUAGE)

### SDK

#### portainer

##### auth

Authenticate a account portainer account and returns a JWT, usually available for 8 hours.

- params : 

    - username : (string, optionnal) portainer account username
    - password?: (string, optionnal) portainer account password
    - host: (string, optionnal) portainer host

- async result :

    - jwt : (string) generated JWT token
    - statusCode : (number) HTTP status code
    - body: (any) response body

##### getHostOptions

Get portainer host options.

- params :

    - host: (string, optionnal) portainer host

- result :

    - saveSettings: (boolean) true if settings are saved
    - defaultHost : (string)
    - jwt: (string, optionnal) last generated JWT
    - hosts: PortainerHostsOptions; 

##### setHostOptions

Set portainer host options.

- params :

    - key: string
    - value: any
    - host?: string

- no result

#### portainer.docker

##### container

> TODO

- params :

    - id: string
    - host?: string

- result : Promise<Response>

##### containers

> TODO

- params : host?: string

- result : Promise<Response>

##### createContainer

> TODO

- params : 

    - image : string
    - hostConfig? : any
    - labels? : any
    - name? : string
    - env? : any
    - data? : any
    - query? : any
    - headers? : any
    - host? : string
    - jwt? : string

- result : Promise<Response>

##### createImage

> TODO

- params :

    - from : string
    - registry? : string
    - data? : any
    - query? : any
    - headers? : any
    - host? : string
    - jwt? : string

- result : Promise<Response>

##### deployContainer

> TODO

- params :

    - image : string
    - name : string
    - hostConfig? : any
    - labels? : any
    - env? : any
    - data? : any
    - query? : any
    - headers? : any
    - host? : string
    - jwt? : string

- result : Promise<Response>

##### images

> TODO

- params :

    - data? : any
    - query? : any
    - headers? : any
    - host? : string
    - jwt? : string

- result : Promise<Response>

##### info

> TODO

- params :

    - data? : any
    - query? : any
    - headers? : any
    - host? : string
    - jwt? : string

- result : Promise<Response>

##### removeContainer

> TODO

- params :

    - id : string
    - data? : any
    - query? : any
    - headers? : any
    - host? : string
    - jwt? : string    

- result : Promise<Response>

##### removeImage

> TODO

- params :

    - image : string
    - data? : any
    - query? : any
    - headers? : any
    - host? : string
    - jwt? : string

- result : Promise<Response>

##### startContainer

> TODO

- params :

    - id : string
    - data? : any
    - query? : any
    - headers? : any
    - host? : string
    - jwt? : string

- result : Promise<Response>

##### stopContainer

> TODO

- params :

    - id : string
    - data? : any
    - query? : any
    - headers? : any
    - host? : string
    - jwt? : string

- result : Promise<Response>

##### version

> TODO

- params :

    - data? : any
    - query? : any
    - headers? : any
    - host? : string
    - jwt? : string

- result : Promise<Response>

Enjoy !
