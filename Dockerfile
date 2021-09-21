FROM node:14.15-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

# RUN npm install
# If you are building your code for production
RUN npm ci --only=production

# Open the Express port in the container
EXPOSE 3000

# Establish the command to run the app
CMD [ "npm", "start" ]

# Copy app code into the container
COPY . .
