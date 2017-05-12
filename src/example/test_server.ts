
import * as http from 'http';
import * as monitor from '../index'
import * as koa from "koa"
import * as Router from 'koa-router'
const app = new koa()
const server = http.createServer(app.callback())
app.use(monitor(server, { path: '/status', statusHtmlPage: 'index.html' }))
let router = new Router()
    .get('/', async (ctx, next) => {
        ctx.body = 'Hello World3'
    })
app.use(router.routes())
app.listen(3001)
server.listen(3000)