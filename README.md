# paradigm-api

A node restful api that expose a series of endpoints for the websites.

# NPM Commands

To build the solution:

```shell
$ npm run build
```

To run the solution:

```shell
$ npm run dev
```

To run the tests:

```shell
$ npm test
```

To see the test coverage:

```shell
$ npm run coverage
```

Both the run and build command will try to install the packages first, just in case a new package has been added to the solution.

The `$ npm start` runs the solution without watching for changes, and it's used by the hosting platform.

If you run the solution locally, you'll need to provide some of the application secrets. The best solution is to create
a .env file in the root folder, and include the following content:

```env
paradigm_db_connection_string="..."
```

# Api Documentation

If you document the endpoints, you'll find the swagger ui documentation under `[domain:port]/docs`.
You can change the endpoint the the file `paradigm-api-server.ts`:

```ts
.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
```

We are using two libraries to make the documentation. For the server to expose the api, we are using the
[swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express). Swagger Ui Express requires a json
with the endpoint documentation.
Writing a documentation json is not fun task, and we are using typescript for the solution, which gives a lot
of contextual information about the endpoints. That, plus some typescript decorators, we can generate the documentation
automatically. For that task, we are using [typescript-rest-swagger](https://www.npmjs.com/package/typescript-rest-swagger).

You have to decorate the controllers with the proper decorators, and then, when you are ready, you can build the documentation
json by executing in the console the following line:

```shell
$ npm run build-doc
```
