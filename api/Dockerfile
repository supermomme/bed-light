FROM node:10.9.0-alpine
ENV TZ=Europe/Berlin
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apk --no-cache add --virtual builds-deps build-base python

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3030
EXPOSE 1883
CMD ["npm", "start"]
