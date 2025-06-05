FROM node:24-alpine

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

RUN npm run build

EXPOSE ${PORT}
CMD ["npm", "start"]