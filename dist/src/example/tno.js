"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as monitor from '../index'
const koa = require("koa");
const app = new koa();
// const server = http.createServer(app.callback())
// app.use(monitor(server, { path: '/status', statusHtmlPage: 'index.html' }))
// app.use(function* () {
//     setTimeout(() => {
//         this.body = 'Hello asynchronous world!';
//     }, 100);
// });
// app.use(async (ctx, next) => {
//   await new Promise((resolve, reject) => {
//     setTimeout(() => {
//       ctx.body = 'Hello asynchronous world!';
//       resolve();
//     }, 100);
//   });
// });
app.use(function* () {
    yield new Promise((resolve, reject) => {
        setTimeout(() => {
            this.body = 'Hello asynchronous world!';
            resolve();
        }, 100);
    });
});
app.listen(3000);
