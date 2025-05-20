FROM node:13.14.0

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
RUN npm install --production

# Copy the built client app and server code
COPY build ./build
COPY client.js .
COPY .env .
COPY wait-for-it.sh .

# Expose port 3000
EXPOSE 3000

# Command to run the client server
CMD ["node", "client.js"]