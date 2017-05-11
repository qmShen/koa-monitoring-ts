import * as Router from "koa-router";
import * as kcors from "kcors";
import * as Koa from "koa";
import * as monitor from '../index.js'
// const Router = require("koa-router");
// const kcors = require("kcors");
// const Koa = require("koa");
// const monitor = require('../index.js')

const getPageRouters = new Router();


getPageRouters
    .get('/', (ctx, next) => {
        ctx.body = 'Hello Monitoring';
    });

function Server() {
    const app = new Koa();
    app.use(getPageRouters.routes())
    return app;
}

function main() {
    const http = require('http')
    const server = Server();
    const xserver = http.createServer(server.callback())
    server.use(monitor(xserver, {path: '/status', statusHtmlPage: 'index.html'}))

    const serverInstance = xserver.listen(3000);
    serverInstance.on("listening", () => {
        const addr = serverInstance.address();
        console.info(`Listening on port ${addr.port}`);
    });
}

main()