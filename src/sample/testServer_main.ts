
import * as http from 'http';
import * as monitor from '../index.js'
import * as koa from "koa"
import * as Router from 'koa-router'
const app = new koa()

// app.use(monitor(server, {path: '/status', statusHtmlPage: 'index.html'}))
// app.use

let router = new Router()
    .get('/',  async (ctx, next) => {
        console.log('root./')
        ctx.body = 'Hello World3'
    })

app.use(router.routes())
// app.use(function *() {
//   if (this.path === '/') {
//     this.body = 'Hello xxx'
//   }
// })
app.use(monitor(app, {path: '/status', statusHtmlPage: 'index.html'}))
app.listen(3000)
console.log('test done')