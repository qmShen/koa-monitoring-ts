"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const monitor = require("../index.js");
const koa = require("koa");
const Router = require("koa-router");
const app = new koa();
const server = http.createServer(app.callback());
app.use(monitor(server, { path: '/status', statusHtmlPage: 'index.html' }));
let router = new Router()
    .get('/', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    console.log('root./');
    ctx.body = 'Hello World3';
}));
app.use(router.routes());
app.listen(3001);
server.listen(3000);
