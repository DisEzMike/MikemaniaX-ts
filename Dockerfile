FROM node:21-alpine

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

EXPOSE 8000

CMD [ "npm", "start"]
