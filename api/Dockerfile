FROM node:10.9.0
ENV TZ=Europe/Berlin
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
#RUN apk --no-cache add --virtual builds-deps build-base python
RUN apt-get update
RUN apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3030
EXPOSE 33333
CMD ["npm", "start"]
