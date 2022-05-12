FROM node:14
ENV NODE_ENV=production
WORKDIR /app
COPY . .
RUN npm i --production=false
RUN npm run build
# RUN npm prune --production
CMD docker-start.sh
