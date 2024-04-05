# Fetching the minified node image on apline linux
FROM node:slim

# Setting up the work directory
WORKDIR /app

# Declaring env
ENV NODE_ENV development

# Declaring port env
ENV PORT 3000

# Declaring host env
ENV ADDRESS 0.0.0.0

# COPY package.json
COPY package.json /app

# Installing dependencies
RUN npm install

# Copying all the files in our container working directory
COPY . /app

# Building the app
RUN npm run build

# Exposing server port
EXPOSE 3000

# Starting our application
CMD [ "npm", "start" ]
