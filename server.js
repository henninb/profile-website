'use strict';

const express = require('express')
const perimeterx = require('perimeterx-node-express');
//const cors = require('cors');
//const bodyParser = require('body-parser');

const port = process.env.PORT || 3000
const app = express()

const pxConfig = {
  px_app_id: 'PXjJ0cYtn9',
  px_cookie_secret: '',
  px_auth_token: '',
  px_bypass_monitor_header: 'x-px-block',
  px_module_mode: 'active_blocking',
  px_logger_severity: 'debug',
  px_login_credentials_extraction_enabled: false,
};

const PxMiddlewareWrap = (req, res, next) => {
  if (pxConfig.px_filter_by_route && pxConfig.px_filter_by_route.includes(req.path)){
    return next();
  }
  PxMiddleware(req, res, next);
};

const setPxMiddleware = (app) => {
  pxInstance = perimeterx.new(pxConfig)
  PxMiddleware = pxInstance.middleware;
  app.use(PxMiddlewareWrap);

  app.use((req, res, next) => {
    for (const [name, value] of Object.entries(req.headers)) {
      res.setHeader(name, value);
    }
    next();
  });
}


perimeterx.init(pxConfig);

var PxMiddleware;
var pxInstance;

pxInstance = perimeterx.new(pxConfig)
PxMiddleware = pxInstance.middleware;
app.use(PxMiddlewareWrap);

setPxMiddleware(app);

//app.use(perimeterx.middleware);

app.listen(port, () => { console.log(`listening on port ${port}`) });
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'), (_req,_response,next) => {
  next();
});

// app.use((error, req, res, next) => {
//   res.status(error.status || 500);
//   res.send(error.message || 'Server internal error');
// });

// app.use(cors());

app.post('/api/login', (_, response, next) => {
  console.log('api login post');
  response.send('api login POST called.');
  next();
});

// app.get('/helloWorld', perimeterx.middleware, (_, response, next) => {
//   console.log('hello world');
//   response.send('Hello World');
//   next();
// });
//

app.get('/helloWorld', (_, response, next) => {
  console.log('hello world');
  response.send('Hello World');
  next();
});
