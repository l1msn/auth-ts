FROM node

WORKDIR /auth-pro/client

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]