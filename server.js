'use strict';

const express = require('express')
const perimeterx = require('perimeterx-node-express');
//const cors = require('cors');
//const bodyParser = require('body-parser');

const port = process.env.PORT || 3000
const app = express()

const pxConfig = {
    px_app_id: 'PX_APP_ID',
    px_cookie_secret: 'PX_COOKIE_ENCRYPTION_KEY',
    px_auth_token: 'PX_TOKEN',
};
perimeterx.init(pxConfig);

app.listen(port, () => { console.log(`listening on port ${port}`) });
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
// app.use(cors());

app.post('/api/login', (_, response) => {
   response.send('api login POST called.');
});

app.get('/helloWorld', perimeterx.middleware, (_, response) => {
    response.send('Hello World');
});
