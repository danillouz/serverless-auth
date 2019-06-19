# Serverless Auth

Code for the accompanying [blog post](https://blog.danillouz.dev/serverless-auth).

# Use case

> How can we secure an HTTP API with a token based authentication strategy, so only authenticated- and authorized clients can access it?

## Technologies

- The HTTP API is an [AWS API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html).
- The API endpoints are protected with a [bearer token](https://oauth.net/2/bearer-tokens) and implemented as [Lambda Proxy Integrations](https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html).
- [Auth0](https://auth0.com) is used as a third party auth provider.
- An [APIG Lambda Authorizer](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html) is used to verify the token with Auth0.
- The Lambdas are implemented using [Node.js](https://nodejs.org/en) and the [Serverless Framework](https://serverless.com).
- [cURL](https://en.wikipedia.org/wiki/CURL) is used as a "client" to send HTTP requests to the API with a token.

# Development

Lint source code with:

```shell
npm run lint
```

Lint and format (prettier) source code with:

```shell
npm run lint:format
```

# Contributing

Please read the [Contributing Guidelines](CONTRIBUTING.md) first.

# Licence

MIT License

Copyright (c) Daniël Illouz
