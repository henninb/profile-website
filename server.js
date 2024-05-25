'use strict';

const express = require('express')
const perimeterx = require('perimeterx-node-express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const axios = require('axios');
//const cors = require('cors');
//const bodyParser = require('body-parser');
const EMAIL = 'henninb@gmail.com'; // Replace with your email
const PASSWORD = 'monday1'; // Replace with your password
const JWT_KEY = 'your_jwt_key'; // Replace with your JWT key

const port = process.env.PORT || 3000
const app = express()

const configPath = './config.json';
const pxConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

app.use(cookieParser());

const px_enrich_custom_parameters_old = async (config, request) => {
    const body = request.method === 'POST' &&
        request.headers.get('content-type')?.includes('application/json') ?
        await request.clone().json() : null;

    // let headerCount = 0;
    // request.headers.forEach(() => {
    //     headerCount++;
    // });
  const headerCount = Object.keys(request.headers).length;

    // Function to get the value of a specific cookie
    const getCookieValue = (name) => {
        // const cookies = request.headers.get('cookie');
        const cookies = request.cookies;
        if (!cookies) return null;
        return cookies[name];
    };

    const pdvidCookieValue = getCookieValue('_pxvid') || 'empty';

    return {
        custom_param1: 'hardcoded value',
        // custom_param2: request.headers.get('Cf-Ray'),
        custom_param3: body?.['body_property'],
        custom_param4: headerCount.toString(),
        custom_param5: pdvidCookieValue,
    };
};

const px_enrich_custom_parameters = function(customParams, originalRequest) {
    customParams["custom_param1"] = "yay, test value";
    return customParams;
  }

pxConfig.px_enrich_custom_parameters = px_enrich_custom_parameters_old;

app.use((request, response, next) => {
  console.log(`Request URL: ${request.url}`);
  response.header("x-powered-by", "ExpressServer");
  next();
});

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

app.listen(port, () => { console.log(`listening on port ${port}`) });
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'), (_req,_response,next) => {
  next();
});

// app.use(cors());

app.post('/api/login', (_, response, next) => {
  console.log('api login post');
  response.send('api login POST called.');
  next();
});

app.get('/api/nhl', (_request, response) => {
  const url = 'https://fixturedownload.com/feed/json/nhl-2023/minnesota-wild';

  axios.get(url)
    .then(res => {
      // If the request is successful, send the JSON response back to the client
      response.status(200).json(res.data);
    })
    .catch(error => {
      console.error('Error fetching NHL schedule:', error);
      response.status(500).send('Error fetching data');
    });
});

app.get('/helloWorld', (_, response, next) => {
  console.log('hello world');
  response.send('Hello World');
  next();
});
