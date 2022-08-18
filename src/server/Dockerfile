FROM node

RUN mkdir -p auth-ts/src/server

RUN mkdir -p auth-ts/dist/server

WORKDIR /auth-ts

COPY ../../package*.json ./

COPY ../../tsconfig.json ./

COPY ../../.env ./

COPY . ./src/server

RUN npm install

CMD ["npm", "run", "start"]