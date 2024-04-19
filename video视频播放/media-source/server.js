const Koa = require('koa');
const Router = require('koa-router');
const static = require('koa-static');
const path = require('path');
const fs = require('fs').promises;

const app = new Koa();


const router = new Router();

app.use(static('./static'));
app.use(router.routes());

app.listen(8080, () => {
    console.log('server is run at 8080......');
})