#!/bin/sh

docker build -t express-app .
docker run --name=express-app -h express-app --restart unless-stopped -p 3000:3000 -d express-app

exit 0
