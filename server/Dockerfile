FROM node:14
ENV NODE_ENV=production
WORKDIR /app
COPY . .
RUN npm i --production=false
RUN npm run build
CMD npm start
