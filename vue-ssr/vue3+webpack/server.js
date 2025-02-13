const express = require('express');
const { renderToString } = require('@vue/server-renderer');
const { default: myCreateApp } = require('./app');
const { createMemoryHistory } = require('vue-router')
const { default: createRouter } = require('./router')
const path = require('path');

const server = express();

const distPath = path.join(process.cwd(), 'dist');
server.use(express.static(distPath));

server.get('/*', async (req, res) => {
  const app = myCreateApp();
  const router = createRouter(createMemoryHistory());
  app.use(router);
  await router.push(req.url || '/');
  await router.isReady();

  const html = await renderToString(app);
  res.send(`
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
      </head>
      <body>
        <div id="app">
          ${html}
        </div>
      </body>
      <script src="/client/client_bundle.js"></script>
      </html>
    `)
})

server.listen(8000, () => {
  console.log('start server http://localhost:8000')
})