FROM node

WORKDIR /auth-pro/server

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "server.js"]