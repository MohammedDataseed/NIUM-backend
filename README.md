## About this repo

This is simple NestJs boilerplate project for InstaReM. It provides following features

1. Module based approach
2. Swagger Integration
3. Commitzen commit message hook (Could be used for SemVer)
4. Postgres & Redis service for database connectivity
5. Application Shutdown hook for gracefull shutdown
6. Global Exception handler custom error handling
7. Application logging to console and AWS S3
8. Audit logs for requests via middleware
9. Docker files included to run your app in docker container
10. Debugging Configuration to attach debugger while app is in docker container

## Contribution Guidelines

This used commitizen for commit message standardization. It is added as a commit hook and will
be triggered on `git commit` command.

Everyone is advised to use the same guidelines.

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Installation

```bash
$ npm install
```

## Code Styling

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Developing app in docker

```bash
# development
$ docker-compose -f docker-compose.debug.yml down && docker-compose -f docker-compose.debug.yml build --no-cache && docker-compose -f docker-compose.debug.yml up
```

### Production Build

```bash
docker build --no-cache -t nestjs_demo:latest .
```

## Documentation

To create compodoc document for NestJS app use `npx compodoc -p tsconfig.json -s`

## License

Nest is [MIT licensed](LICENSE).
