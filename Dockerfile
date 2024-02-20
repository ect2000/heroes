FROM node:18 AS build
RUN mkdir /app
WORKDIR /app
COPY package*.json /app
RUN npm install
COPY . /app
RUN npm run build --prod

FROM nginx:alpine
COPY --from=build app/dist/heroes-app/browser /usr/share/nginx/html

EXPOSE 4200

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
