FROM node:14.21.3 as build

WORKDIR /app

COPY package*.json ./

#RUN npm install
#RUN npm install -g @angular/cli

RUN npm install --save-dev @angular/cli@14.1.3
RUN npm install --save-dev @angular/material-moment-adapter
RUN npm install --save-dev @ngx-translate/core
RUN npm install --save-dev messageformat
RUN npm install --save-dev ngx-translate-messageformat-compiler
RUN npm install --save-dev moment

COPY . .

RUN ng build --configuration=production-pjoter1v

FROM nginx:1.22.0-alpine

COPY --from=build app/dist/squash-app-bootstrap /usr/share/nginx/html

EXPOSE 80