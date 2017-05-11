"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const monitor = require("../index.js");
const koa = require("koa");
const app = new koa();
const server = http.createServer(app.callback());
app.use(monitor(server, { path: '/status', statusHtmlPage: 'index.html' }));
app.use(function* () {
    if (this.path === '/') {
        this.body = 'Hello World';
    }
});
server.listen(3000);
