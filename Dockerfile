FROM node:14.21.3 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli

COPY . .

RUN ng build --configuration=production-pjoter1v

FROM nginx:1.22.0-alpine

COPY --from=build app/dist/squash-app-bootstrap /usr/share/nginx/html

EXPOSE 80