FROM node:14-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY yarn.lock ./

# RUN npm install
RUN yarn install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . /app

EXPOSE 3000
# CMD [ "yarn", "start" ]
CMD yarn start