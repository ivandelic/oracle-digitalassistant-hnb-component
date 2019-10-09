FROM node:12.2.0-alpine
WORKDIR /ui
COPY . ./
RUN npm install
CMD [ "npm", "start" ]