FROM node:12.18-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
#COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production --silent
#RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
