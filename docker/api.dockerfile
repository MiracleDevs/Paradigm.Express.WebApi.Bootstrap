FROM node:14.15.1-alpine3.12
RUN apk update && apk upgrade
RUN apk add curl && apk add bash
RUN mkdir -p /usr/api/
COPY . /usr/api/
WORKDIR /usr/api/
RUN npm run build
CMD npm run start

EXPOSE 5000