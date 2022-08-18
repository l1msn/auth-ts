FROM node

RUN mkdir -p auth-ts/src/client

WORKDIR /auth-ts/src/client

COPY package*.json ./

COPY tsconfig.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "deploy"]