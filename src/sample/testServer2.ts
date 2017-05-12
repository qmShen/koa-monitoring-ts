
import * as http from 'http';
import * as monitor from '../index.js'
import * as koa from "koa"
const app = new koa()

const server = http.createServer(app.callback())
app.use(monitor(server, { path: '/status', statusHtmlPage: 'index.html' }))

app.use(function* (next) {
    console.log('middleware')
    yield next;
});


app.use(function* () {
    if (this.path === '/') {
        console.log('test')
        this.body = 'Hello World'
    }
})


app.listen(3001)
server.listen(3000)
