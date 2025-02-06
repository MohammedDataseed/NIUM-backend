    FROM node:20.17.0-slim
    WORKDIR /usr/src/app
    COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
    RUN npm install --silent
    COPY . .
    RUN npm run build


    # FROM node:20.17.0-alpine
    WORKDIR /usr/src/app
    COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
    RUN npm install --silent --production
    EXPOSE 4400
    COPY --from=0 /usr/src/app/dist/ /usr/src/app/dist/
    CMD npm run start:prod

