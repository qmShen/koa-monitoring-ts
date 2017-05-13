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
const myindex_1 = require("../myindex");
const koa = require("koa");
const Router = require("koa-router");
const app = new koa();
app.use(myindex_1.default(app));
let router = new Router()
    .get('/', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    ctx.body = 'Hello World4';
}));
app.use(router.routes());
app.listen(3001);
