FROM node

RUN mkdir -p auth-ts/src/server

WORKDIR /auth-ts

COPY ../../package*.json .

COPY ../../tsconfig.json .

COPY ../../.env .

COPY /src/server/ /auth-ts/src/server/

RUN npm install

RUN npm run build

CMD ["npm", "run", "start:build"]