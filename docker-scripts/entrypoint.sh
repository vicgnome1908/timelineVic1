#!/bin/sh

# Wait until prisma is avaliable, and download schemas
#./docker-scripts/wait-for-it.sh prisma:4466 -- prisma deploy
./docker-scripts/wait-for-it.sh localhost:4466 -- prisma deploy

#node src/index.ts

npm run start

#node ts-node-dev --no-notify --respawn --transpileOnly ./

#graphql get-schema --project prisma

#if [ $DEBUG = 1 ]; then
#
#  echo "Running in debug mode"
#
#  nodemon --exec 'prisma deploy && node' src/index.js --delay 2.5 &
#
#  graphql playground
#
#else
#
#  echo "Running in production mode"
#
#  node src/index.js
#
#fi
