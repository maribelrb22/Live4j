FROM node:14 AS build
WORKDIR /app
COPY . .
RUN npm i
RUN npm run build

FROM nginx:1.21.6-alpine
COPY --from=build /app/build /usr/share/nginx/html/
